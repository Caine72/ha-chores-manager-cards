import { css, html, LitElement, nothing, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { getChildren } from "./data";
import type {
  ButtonVisibilityMode,
  DailyCardConfig,
  HomeAssistant,
  OverviewButton,
  OverviewCardConfig,
} from "./types";

type EditorConfig = (DailyCardConfig | OverviewCardConfig) & { type?: string };
type EditorKind = "daily" | "overview";
type FormValueChangedEvent<T> = CustomEvent<{ value: T }>;
interface UserOption {
  id: string;
  name: string;
  is_active: boolean;
  system_generated: boolean;
}

type EditorButton = Omit<OverviewButton, "visibility"> & {
  visibility_mode?: ButtonVisibilityMode;
  visibility_users?: string[];
};

const WEEKLY_POINTS_SELECTOR = {
  entity: { filter: [{ domain: "sensor", integration: "chores_manager" }] },
};

const ACTION_SELECTOR = {
  ui_action: {
    actions: [
      "more-info",
      "navigate",
      "url",
      "toggle",
      "perform-action",
      "call-service",
      "assist",
      "none",
    ],
    default_action: "none",
  },
};

const BUTTON_PRESETS: OverviewButton[] = [
  { label: "Chores", icon: "mdi:format-list-checks", color: "#00bcd4" },
  { label: "History", icon: "mdi:trophy-outline", color: "#ffc107" },
  { label: "Correction", icon: "mdi:wrench-cog", color: "#9c27b0" },
];

function toEditorButton(button: OverviewButton): EditorButton {
  const { visibility, ...fields } = button;
  return {
    ...fields,
    visibility_mode: visibility?.mode ?? "all",
    visibility_users: visibility?.users ?? [],
  };
}

function fromEditorButton(button: EditorButton): OverviewButton {
  const { visibility_mode, visibility_users, ...fields } = button;
  return {
    ...fields,
    visibility: {
      mode: visibility_mode ?? "all",
      users: visibility_users ?? [],
    },
  };
}

function legacyButtons(config: OverviewCardConfig): OverviewButton[] {
  const actions = [config.daily_action, config.history_action, config.correction_action];
  return BUTTON_PRESETS.flatMap((preset, index) => {
    const tapAction = actions[index];
    return tapAction && tapAction.action !== "none"
      ? [{ ...preset, tap_action: tapAction }]
      : [];
  });
}

function defaults(config: EditorConfig, kind: EditorKind): EditorConfig {
  const base = {
    locale: "auto" as const,
    show_header: true,
    show_name: true,
    show_person: true,
    show_points: true,
    person_position: "left" as const,
    person_size: "medium" as const,
  };
  if (kind === "overview" && (config as OverviewCardConfig).buttons === undefined) {
    const overview = config as OverviewCardConfig;
    return {
      ...base,
      ...config,
      buttons: legacyButtons(overview).length ? legacyButtons(overview) : BUTTON_PRESETS,
    };
  }
  return { ...base, ...config };
}

abstract class ChoresManagerCardEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;

  @state() private config?: EditorConfig;
  @state() private users: UserOption[] = [];
  private usersConnection?: HomeAssistant["connection"];

  protected abstract readonly kind: EditorKind;

  setConfig(config: EditorConfig): void {
    this.config = defaults(config, this.kind);
  }
  protected willUpdate(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has("hass")) {
      this.loadUsers();
    }
  }

  private loadUsers(): void {
    const connection = this.hass?.connection;
    if (!connection || connection === this.usersConnection) {
      return;
    }
    this.usersConnection = connection;
    void connection
      .sendMessagePromise<UserOption[]>({ type: "config/auth/list" })
      .then((users) => {
        this.users = users
          .filter((user) => user.is_active && !user.system_generated)
          .sort((left, right) => left.name.localeCompare(right.name));
      })
      .catch(() => {
        this.users = [];
      });
  }

  protected render() {
    if (!this.config) {
      return nothing;
    }

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this.formData()}
        .schema=${this.schema()}
        .computeLabel=${this.computeLabel}
        @value-changed=${this.onFormValueChanged}
      ></ha-form>
      ${this.kind === "overview" ? this.renderButtonEditors() : nothing}
    `;
  }

  private formData(): EditorConfig {
    if (!this.hass || !this.config) {
      return this.config ?? {};
    }
    const childId = this.config.child_id ?? (this.config.child_entity
      ? this.hass.states[this.config.child_entity]?.attributes.child_id
      : undefined);
    return typeof childId === "string"
      ? {
          ...this.config,
          child_id: childId,
          weekly_points_entity:
            this.config.weekly_points_entity ?? this.matchingWeeklyPointsEntity(childId),
        }
      : this.config;
  }

  private schema() {
    const children = this.hass ? getChildren(this.hass) : [];
    const shared = [
      {
        name: "child_id",
        required: true,
        selector: {
          select: {
            mode: "dropdown",
            options: children.map((child) => ({ label: child.name, value: child.id })),
          },
        },
      },
      { name: "weekly_points_entity", selector: WEEKLY_POINTS_SELECTOR },
      { name: "name", selector: { text: {} } },
      { name: "person_entity", selector: { entity: { filter: [{ domain: "person" }] } } },
      {
        name: "locale",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { label: "Automatic", value: "auto" },
              { label: "English", value: "en" },
              { label: "Svenska", value: "sv" },
            ],
          },
        },
      },
    ];

    if (this.kind === "daily") {
      return [
        ...shared,
        {
          type: "grid",
          name: "display",
          flatten: true,
          schema: [
            { name: "show_header", selector: { boolean: {} } },
            { name: "show_person", selector: { boolean: {} } },
            { name: "show_points", selector: { boolean: {} } },
          ],
        },
      ];
    }

    return [
      ...shared,
      {
        type: "grid",
        name: "display",
        flatten: true,
        schema: [
          { name: "show_name", selector: { boolean: {} } },
          { name: "show_person", selector: { boolean: {} } },
          { name: "show_points", selector: { boolean: {} } },
          {
            name: "person_position",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  { label: "Left", value: "left" },
                  { label: "Center", value: "center" },
                  { label: "Right", value: "right" },
                ],
              },
            },
          },
          {
            name: "person_size",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  { label: "Small", value: "small" },
                  { label: "Medium", value: "medium" },
                  { label: "Large", value: "large" },
                ],
              },
            },
          },
          { name: "goal_points", selector: { number: { min: 1, mode: "box" } } },
          { name: "progress_color", selector: { text: { type: "color" } } },
        ],
      },
      {
        name: "rewards",
        selector: {
          object: {
            multiple: true,
            label_field: "label",
            fields: {
              points: { required: true, selector: { number: { min: 1, mode: "box" } } },
              label: { required: true, selector: { text: {} } },
              description: { selector: { text: {} } },
              color: { selector: { text: { type: "color" } } },
            },
          },
        },
      },
    ];
  }

  private renderButtonEditors() {
    const buttons = (this.config as OverviewCardConfig).buttons ?? [];
    return html`
      <section class="button-editors">
        <h2>${this.label("buttons")}</h2>
        ${buttons.map(
          (button, index) => html`
            <section class="button-editor">
              <div class="button-editor-heading">
                <h3>${button.label || `${this.label("button")} ${index + 1}`}</h3>
                <ha-icon-button
                  .label=${this.label("remove_button")}
                  title=${this.label("remove_button")}
                  path="M19,13H5V11H19V13Z"
                  @click=${() => this.removeButton(index)}
                ></ha-icon-button>
              </div>
              <ha-form
                .hass=${this.hass}
                .data=${toEditorButton(button)}
                .schema=${this.buttonSchema(toEditorButton(button))}
                .computeLabel=${this.computeLabel}
                @value-changed=${(event: FormValueChangedEvent<EditorButton>) =>
                  this.onButtonValueChanged(index, event)}
              ></ha-form>
            </section>
          `,
        )}
        ${buttons.length < 3
          ? html`
              <button class="add-button" @click=${this.addButton}>
                <ha-icon icon="mdi:plus"></ha-icon>${this.label("add_button")}
              </button>
            `
          : nothing}
      </section>
    `;
  }

  private buttonSchema(button: EditorButton) {
    const fields: Array<Record<string, unknown>> = [
      { name: "label", required: true, selector: { text: {} } },
      { name: "icon", required: true, selector: { icon: {} } },
      { name: "color", required: true, selector: { text: { type: "color" } } },
      { name: "tap_action", selector: ACTION_SELECTOR },
      { name: "hold_action", selector: ACTION_SELECTOR },
      { name: "double_tap_action", selector: ACTION_SELECTOR },
      {
        name: "visibility_mode",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { label: "All users", value: "all" },
              { label: "Administrators", value: "administrators" },
              { label: "Allow selected users", value: "allow-list" },
              { label: "Hide from selected users", value: "deny-list" },
            ],
          },
        },
      },
    ];
    const users = new Map(this.users.map((user) => [user.id, user.name]));
    for (const userId of button.visibility_users ?? []) {
      users.set(userId, users.get(userId) ?? userId);
    }
    fields.push({
      name: "visibility_users",
      selector: {
        select: {
          multiple: true,
          mode: "dropdown",
          options: [...users].map(([value, label]) => ({ value, label })),
        },
      },
    });
    return fields;
  }

  private onFormValueChanged(event: FormValueChangedEvent<EditorConfig>): void {
    event.stopPropagation();
    const value = event.detail.value;
    const changedChild = value.child_id !== this.config?.child_id;
    this.config = defaults(
      {
        ...this.config,
        ...value,
        weekly_points_entity:
          changedChild && this.hass
            ? this.matchingWeeklyPointsEntity(value.child_id)
            : value.weekly_points_entity,
      },
      this.kind,
    );
    this.emitConfigChanged();
  }

  private onButtonValueChanged(
    index: number,
    event: FormValueChangedEvent<EditorButton>,
  ): void {
    event.stopPropagation();
    const overview = this.config as OverviewCardConfig;
    const buttons = [...(overview.buttons ?? [])];
    const existing = toEditorButton(buttons[index]);
    buttons[index] = fromEditorButton({
      ...existing,
      ...event.detail.value,
      visibility_users:
        event.detail.value.visibility_users ?? existing.visibility_users,
    });
    this.config = { ...overview, buttons };
    this.emitConfigChanged();
  }

  private addButton = (): void => {
    const overview = this.config as OverviewCardConfig;
    const buttons = [...(overview.buttons ?? [])];
    const preset = BUTTON_PRESETS[buttons.length];
    if (!preset) {
      return;
    }
    this.config = { ...overview, buttons: [...buttons, preset] };
    this.emitConfigChanged();
  };

  private removeButton(index: number): void {
    const overview = this.config as OverviewCardConfig;
    const buttons = [...(overview.buttons ?? [])];
    buttons.splice(index, 1);
    this.config = { ...overview, buttons };
    this.emitConfigChanged();
  }

  private emitConfigChanged(): void {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this.config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private matchingWeeklyPointsEntity(childId: string | undefined): string | undefined {
    if (!childId || !this.hass) {
      return undefined;
    }
    return Object.entries(this.hass.states).find(
      ([entityId, entity]) =>
        entityId.startsWith("sensor.") &&
        entity.attributes.child_id === childId,
    )?.[0];
  }

  private computeLabel = (schema: { name: string }): string | undefined =>
    this.label(schema.name);

  private label(key: string): string {
    const labels = this.hass?.language?.toLowerCase().startsWith("sv")
      ? {
          add_button: "Lägg till knapp", button: "Knapp", buttons: "Knappar",
          child_id: "Barn", color: "Färg", description: "Beskrivning",
          double_tap_action: "Dubbeltryck", goal_points: "Reservmålpoäng",
          hold_action: "Håll inne", icon: "Ikon", label: "Etikett", locale: "Språk",
          name: "Visningsnamn", person_entity: "Person", person_position: "Bildposition",
          person_size: "Bildstorlek", points: "Poäng", progress_color: "Förloppsfärg",
          remove_button: "Ta bort knapp", rewards: "Belöningsnivåer",
          show_header: "Visa sidhuvud", show_name: "Visa namn", show_person: "Visa bild",
          show_points: this.kind === "daily" ? "Visa poäng" : "Visa poäng och belöningsmeddelande",
          tap_action: "Tryck", visibility_mode: "Synlig för", visibility_users: "Användare",
          weekly_points_entity: "Veckopoäng",
        }
      : {
          add_button: "Add button", button: "Button", buttons: "Buttons",
          child_id: "Child", color: "Color", description: "Description",
          double_tap_action: "Double-tap behavior", goal_points: "Fallback goal points",
          hold_action: "Hold behavior", icon: "Icon", label: "Label", locale: "Language",
          name: "Display name", person_entity: "Person", person_position: "Picture position",
          person_size: "Picture size", points: "Points", progress_color: "Progress color",
          remove_button: "Remove button", rewards: "Reward levels",
          show_header: "Show header", show_name: "Show name", show_person: "Show picture",
          show_points: this.kind === "daily" ? "Show points" : "Show points and reward message",
          tap_action: "Tap behavior", visibility_mode: "Visible to", visibility_users: "Users",
          weekly_points_entity: "Weekly points",
        };
    return labels[key as keyof typeof labels];
  }

  static styles = css`
    :host { display: block; }
    .button-editors { display: grid; gap: 12px; margin-top: 24px; }
    .button-editors h2, .button-editor h3 { margin: 0; font-size: 16px; }
    .button-editor { border: 1px solid var(--divider-color); border-radius: 8px; padding: 12px; }
    .button-editor-heading { align-items: center; display: flex; justify-content: space-between; margin-bottom: 8px; }
    .add-button { align-items: center; background: transparent; border: 1px solid var(--divider-color); border-radius: 8px; color: var(--primary-text-color); cursor: pointer; display: inline-flex; font: inherit; gap: 8px; justify-content: center; min-height: 40px; padding: 0 12px; }
  `;
}

@customElement("chores-manager-daily-card-editor")
export class ChoresManagerDailyCardEditor extends ChoresManagerCardEditor {
  protected readonly kind = "daily";
}

@customElement("chores-manager-overview-card-editor")
export class ChoresManagerOverviewCardEditor extends ChoresManagerCardEditor {
  protected readonly kind = "overview";
}

declare global {
  interface HTMLElementTagNameMap {
    "chores-manager-daily-card-editor": ChoresManagerDailyCardEditor;
    "chores-manager-overview-card-editor": ChoresManagerOverviewCardEditor;
  }
}
