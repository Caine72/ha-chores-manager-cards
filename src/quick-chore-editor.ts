import { css, html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { getChildren } from "./data";
import type {
  HomeAssistant,
  QuickChoreCardConfig,
  QuickChoreChildConfig,
  QuickChoreSlotConfig,
} from "./types";

type ValueChangedEvent = CustomEvent<{ value: QuickChoreCardConfig }>;
type ChildValueChangedEvent = CustomEvent<{ value: QuickChoreChildConfig }>;
type EditorChore = QuickChoreSlotConfig & { color_mode?: "automatic" | "custom" };
type ChoreValueChangedEvent = CustomEvent<{ value: EditorChore }>;

const EDIT_PATH = "M3,17.25V21H6.75L17.81,9.94L14.06,6.19L3,17.25M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C17.98,2.9 17.35,2.9 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04Z";
const DELETE_PATH = "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19C6,20.1 6.9,21 8,21H16C17.1,21 18,20.1 18,19V7H6V19Z";

@customElement("chores-manager-quick-chore-card-editor")
export class ChoresManagerQuickChoreCardEditor extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
  @state() private config?: QuickChoreCardConfig;
  @state() private editingChildIndex?: number;
  @state() private editingChildDraft?: QuickChoreChildConfig;
  @state() private editingChoreIndex?: number;
  @state() private editingChoreDraft?: EditorChore;
  private draggingChildIndex?: number;
  private draggingChoreIndex?: number;

  setConfig(config: QuickChoreCardConfig): void {
    this.config = {
      locale: "auto",
      show_border: true,
      status_layout: "rows",
      density: "compact",
      shortcut_mode: "first_incomplete",
      shortcut_person_size: "medium",
      show_manual_actions: true,
      show_reset_action: false,
      ...config,
      children: config.children ?? [],
      chores: (config.chores ?? []).map((slot) => {
        const { label, ...normalizedSlot } = slot;
        const displayName = slot.display_name ?? (label?.trim() && label !== slot.chore_id ? label : undefined);
        const icon = slot.icon ?? slot.manual_icon_override ?? slot.icon_override;
        const color = slot.color ?? slot.manual_icon_color;
        return {
          ...normalizedSlot,
          ...(displayName ? { display_name: displayName } : {}),
          ...(icon ? { icon } : {}),
          ...(color ? { color } : {}),
        };
      }),
    };
  }

  protected render() {
    if (!this.config) return nothing;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this.config}
        .schema=${this.schema()}
        .computeLabel=${this.computeLabel}
        @value-changed=${this.onValueChanged}
      ></ha-form>
      <section class="config-section children-section">
        <h2>Children</h2>
        <div class="item-list">
          ${this.config.children.map((child, index) => this.renderChildRow(child, index))}
        </div>
        <button class="add-child" ?disabled=${this.availableChildren().length === 0} @click=${this.addChild}>
          <ha-icon icon="mdi:plus"></ha-icon>Add child
        </button>
      </section>
      <section class="config-section chores-section">
        <h2>Chores</h2>
        <div class="item-list">
          ${this.config.chores.map((chore, index) => this.renderChoreRow(chore, index))}
        </div>
        <button class="add-chore" ?disabled=${this.availableChores().length === 0} @click=${this.addChore}>
          <ha-icon icon="mdi:plus"></ha-icon>Add chore
        </button>
      </section>
      ${this.renderChildDialog()}
      ${this.renderChoreDialog()}
    `;
  }

  private schema() {
    return [
      { name: "title", selector: { text: {} } },
      { name: "locale", selector: { select: { mode: "dropdown", options: [{ label: "Automatic", value: "auto" }, { label: "English", value: "en" }, { label: "Svenska", value: "sv" }] } } },
      { name: "show_border", selector: { boolean: {} } },
      { name: "status_layout", selector: { select: { mode: "dropdown", options: [{ label: "One row per chore", value: "rows" }, { label: "Chores side by side", value: "columns" }] } } },
      { name: "density", selector: { select: { mode: "dropdown", options: [{ label: "Compact", value: "compact" }, { label: "Normal", value: "normal" }, { label: "Comfortable", value: "comfortable" }] } } },
      { name: "shortcut_mode", selector: { select: { mode: "dropdown", options: [{ label: "First unfinished chore", value: "first_incomplete" }, { label: "Choose chore by time", value: "time_window" }] } } },
      { name: "shortcut_person_size", selector: { select: { mode: "dropdown", options: [{ label: "Small", value: "small" }, { label: "Medium", value: "medium" }, { label: "Large", value: "large" }] } } },
      { name: "shortcut_label", selector: { text: {} } },
      { name: "show_manual_actions", selector: { boolean: {} } },
      { name: "manual_label", selector: { text: {} } },
      { name: "show_reset_action", selector: { boolean: {} } },
    ];
  }

  private onValueChanged = (event: ValueChangedEvent): void => {
    event.stopPropagation();
    this.updateConfig(event.detail.value);
  };

  private renderChildRow(child: QuickChoreCardConfig["children"][number], index: number) {
    const name = this.childName(child);
    return html`
      <section class="item-row child-row" draggable="true" @dragstart=${(event: DragEvent) => this.startChildDrag(event, index)}
        @dragover=${this.allowItemDrop} @drop=${(event: DragEvent) => this.dropChild(event, index)}>
        <ha-icon class="drag-handle" icon="mdi:drag-horizontal-variant" aria-label="Drag to reorder"></ha-icon>
        <span class="item-name">${name}</span>
        <ha-icon-button .label=${"Edit child"} title="Edit child" .path=${EDIT_PATH}
          @click=${() => this.openChildDialog(index, child)}></ha-icon-button>
        <ha-icon-button .label=${"Remove child"} title="Remove child" .path=${DELETE_PATH}
          ?disabled=${this.config!.children.length === 1} @click=${() => this.removeConfiguredChild(index)}></ha-icon-button>
      </section>
    `;
  }

  private renderChildDialog() {
    const index = this.editingChildIndex;
    const child = this.editingChildDraft;
    if (index === undefined || !child) return nothing;
    return html`
      <ha-dialog .open=${true} header-title=${this.childName(child)} @closed=${this.cancelChildDialog}>
        <ha-form .hass=${this.hass} .data=${child} .schema=${this.childSchema()} .computeLabel=${this.computeLabel}
          @value-changed=${this.onChildDraftChanged}></ha-form>
        <ha-dialog-footer slot="footer">
          <ha-button slot="secondaryAction" appearance="plain" @click=${this.cancelChildDialog}>${this.dialogLabel("cancel")}</ha-button>
          <ha-button slot="primaryAction" @click=${this.saveChildDialog}>${this.dialogLabel("save")}</ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `;
  }

  private childSchema() {
    return [
      { name: "child_id", required: true, selector: { select: { mode: "dropdown", options: (this.hass ? getChildren(this.hass) : []).map((child) => ({ label: child.name, value: child.id })) } } },
      { name: "display_name", selector: { text: {} } },
    ];
  }

  private onChildDraftChanged = (event: ChildValueChangedEvent): void => {
    event.stopPropagation();
    this.editingChildDraft = { ...this.editingChildDraft!, ...event.detail.value };
  };

  private availableChildren() {
    const selected = new Set(this.config?.children.map((child) => child.child_id));
    return (this.hass ? getChildren(this.hass) : []).filter((child) => !selected.has(child.id));
  }

  private addChild = (): void => {
    const child = this.availableChildren()[0];
    if (!child) return;
    this.openChildDialog(this.config!.children.length, { child_id: child.id });
  };

  private removeConfiguredChild(index: number): void {
    if (this.config!.children.length > 1) this.updateConfig({ children: this.config!.children.filter((_, itemIndex) => itemIndex !== index) });
  }

  private childName(child: QuickChoreCardConfig["children"][number]): string {
    return child.display_name?.trim()
      ?? (this.hass ? getChildren(this.hass) : []).find((candidate) => candidate.id === child.child_id)?.name
      ?? child.child_id;
  }

  private renderChoreRow(chore: QuickChoreCardConfig["chores"][number], index: number) {
    return html`
      <section class="item-row chore-row" draggable="true" @dragstart=${(event: DragEvent) => this.startChoreDrag(event, index)}
        @dragover=${this.allowItemDrop} @drop=${(event: DragEvent) => this.dropChore(event, index)}>
        <ha-icon class="drag-handle" icon="mdi:drag-horizontal-variant" aria-label="Drag to reorder"></ha-icon>
        <span class="item-name">${this.choreName(chore)}</span>
        <ha-icon-button .label=${"Edit chore"} title="Edit chore" .path=${EDIT_PATH}
          @click=${() => this.openChoreDialog(index, chore)}></ha-icon-button>
        <ha-icon-button .label=${"Remove chore"} title="Remove chore" .path=${DELETE_PATH}
          ?disabled=${this.config!.chores.length === 1} @click=${() => this.removeConfiguredChore(index)}></ha-icon-button>
      </section>
    `;
  }

  private renderChoreDialog() {
    const index = this.editingChoreIndex;
    const chore = this.editingChoreDraft;
    if (index === undefined || !chore) return nothing;
    return html`
      <ha-dialog .open=${true} header-title=${this.choreName(chore)} @closed=${this.cancelChoreDialog}>
        <ha-form .hass=${this.hass} .data=${chore} .schema=${this.choreSchema(chore)} .computeLabel=${this.computeLabel}
          @value-changed=${this.onChoreDraftChanged}></ha-form>
        <ha-dialog-footer slot="footer">
          <ha-button slot="secondaryAction" appearance="plain" @click=${this.cancelChoreDialog}>${this.dialogLabel("cancel")}</ha-button>
          <ha-button slot="primaryAction" @click=${this.saveChoreDialog}>${this.dialogLabel("save")}</ha-button>
        </ha-dialog-footer>
      </ha-dialog>
    `;
  }

  private choreSchema(chore: QuickChoreCardConfig["chores"][number]) {
    const usesCustomColor = chore.color_mode === "custom" || Boolean(chore.color);
    return [
      { name: "chore_id", required: true, selector: { select: { mode: "dropdown", options: [...this.choreTitles()].map(([value, label]) => ({ value, label })) } } },
      { name: "display_name", selector: { text: {} } },
      { name: "subtitle", selector: { text: {} } },
      ...(this.config?.shortcut_mode === "time_window" ? [
        { name: "start_time", selector: { text: {} } },
        { name: "end_time", selector: { text: {} } },
      ] : []),
      { name: "icon", selector: { icon: {} } },
      { name: "color_mode", selector: { select: { mode: "dropdown", options: [{ label: "Automatic", value: "automatic" }, { label: "Custom", value: "custom" }] } } },
      ...(usesCustomColor ? [{ name: "color", selector: { text: { type: "color" } } }] : []),
    ];
  }

  private onChoreDraftChanged = (event: ChoreValueChangedEvent): void => {
    event.stopPropagation();
    const value = event.detail.value;
    const color = value.color_mode === "custom" ? value.color?.trim() || "#03a9f4" : undefined;
    this.editingChoreDraft = { ...this.editingChoreDraft!, ...value, color };
  };

  private availableChores() {
    const selected = new Set(this.config?.chores.map((chore) => chore.chore_id));
    return [...this.choreTitles()].filter(([choreId]) => !selected.has(choreId));
  }

  private addChore = (): void => {
    const [choreId] = this.availableChores()[0] ?? [];
    if (!choreId) return;
    this.openChoreDialog(this.config!.chores.length, { chore_id: choreId });
  };

  private removeConfiguredChore(index: number): void {
    if (this.config!.chores.length > 1) this.updateConfig({ chores: this.config!.chores.filter((_, itemIndex) => itemIndex !== index) });
  }

  private openChildDialog(index: number, child: QuickChoreChildConfig): void {
    this.editingChildIndex = index;
    this.editingChildDraft = { ...child };
  }

  private openChoreDialog(index: number, chore: QuickChoreSlotConfig): void {
    this.editingChoreIndex = index;
    this.editingChoreDraft = this.toEditorChore(chore);
  }

  private cancelChildDialog = (event?: Event): void => {
    event?.preventDefault();
    event?.stopPropagation();
    this.editingChildIndex = undefined;
    this.editingChildDraft = undefined;
  };

  private cancelChoreDialog = (event?: Event): void => {
    event?.preventDefault();
    event?.stopPropagation();
    this.editingChoreIndex = undefined;
    this.editingChoreDraft = undefined;
  };

  private saveChildDialog = (event?: Event): void => {
    event?.preventDefault();
    event?.stopPropagation();
    const index = this.editingChildIndex;
    const draft = this.editingChildDraft;
    if (index === undefined || !draft?.child_id) return;
    const displayName = draft.display_name?.trim();
    const child = { ...draft };
    delete child.display_name;
    const saved = { ...child, ...(displayName ? { display_name: displayName } : {}) };
    const children = [...this.config!.children];
    if (index < children.length) children.splice(index, 1, saved);
    else children.push(saved);
    this.updateConfig({ children });
    this.cancelChildDialog();
  };

  private saveChoreDialog = (event?: Event): void => {
    event?.preventDefault();
    event?.stopPropagation();
    const index = this.editingChoreIndex;
    const draft = this.editingChoreDraft;
    if (index === undefined || !draft?.chore_id) return;
    const displayName = draft.display_name?.trim();
    const chore = { ...draft };
    delete chore.label;
    delete chore.display_name;
    delete chore.manual_icon_override;
    delete chore.manual_icon_color;
    delete chore.icon_override;
    delete chore.color_mode;
    delete chore.color;
    const color = draft.color_mode === "custom" ? draft.color?.trim() || "#03a9f4" : undefined;
    const saved = { ...chore, ...(displayName ? { display_name: displayName } : {}), ...(color ? { color } : {}) };
    const chores = [...this.config!.chores];
    if (index < chores.length) chores.splice(index, 1, saved);
    else chores.push(saved);
    this.updateConfig({ chores });
    this.cancelChoreDialog();
  };

  private startChildDrag(event: DragEvent, index: number): void {
    this.draggingChildIndex = index;
    event.dataTransfer?.setData("text/plain", String(index));
    if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
  }

  private dropChild(event: DragEvent, targetIndex: number): void {
    event.preventDefault();
    const sourceIndex = this.draggingChildIndex ?? Number(event.dataTransfer?.getData("text/plain"));
    this.draggingChildIndex = undefined;
    if (!Number.isInteger(sourceIndex) || sourceIndex < 0 || sourceIndex === targetIndex) return;
    const children = [...this.config!.children];
    const [moved] = children.splice(sourceIndex, 1);
    children.splice(targetIndex, 0, moved);
    this.updateConfig({ children });
  }

  private startChoreDrag(event: DragEvent, index: number): void {
    this.draggingChoreIndex = index;
    event.dataTransfer?.setData("text/plain", String(index));
    if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
  }

  private allowItemDrop = (event: DragEvent): void => {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
  };

  private dropChore(event: DragEvent, targetIndex: number): void {
    event.preventDefault();
    const sourceIndex = this.draggingChoreIndex ?? Number(event.dataTransfer?.getData("text/plain"));
    this.draggingChoreIndex = undefined;
    if (!Number.isInteger(sourceIndex) || sourceIndex < 0 || sourceIndex === targetIndex) return;
    const chores = [...this.config!.chores];
    const [moved] = chores.splice(sourceIndex, 1);
    chores.splice(targetIndex, 0, moved);
    this.updateConfig({ chores });
  }

  private choreName(chore: QuickChoreCardConfig["chores"][number]): string {
    return chore.display_name?.trim() ?? this.choreTitles().get(chore.chore_id) ?? chore.chore_id;
  }

  private toEditorChore(chore: QuickChoreCardConfig["chores"][number]): EditorChore {
    return { ...chore, color_mode: chore.color ? "custom" : "automatic" };
  }

  private dialogLabel(key: "cancel" | "save"): string {
    const swedish = this.hass?.language?.toLowerCase().startsWith("sv");
    return key === "cancel" ? (swedish ? "Avbryt" : "Cancel") : (swedish ? "Spara" : "Save");
  }

  private updateConfig(change: Partial<QuickChoreCardConfig>): void {
    this.config = { ...this.config!, ...change };
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: this.config }, bubbles: true, composed: true,
    }));
  }

  private choreTitles(): Map<string, string> {
    const chores = new Map<string, string>();
    for (const entity of Object.values(this.hass?.states ?? {})) {
      const choreId = entity.attributes.chore_id;
      if (typeof choreId === "string") {
        const title = entity.attributes.title;
        chores.set(choreId, typeof title === "string" ? title : choreId);
      }
    }
    return chores;
  }

  private computeLabel = (schema: { name: string }): string | undefined => ({
    title: "Title",
    locale: "Language",
    show_border: "Show card border",
    status_layout: "Status layout",
    density: "Density",
    shortcut_mode: "Portrait button behavior",
    shortcut_person_size: "Shortcut portrait size",
    shortcut_label: "Shortcut section title (optional)",
    show_manual_actions: "Show manual action",
    manual_label: "Manual section title (optional)",
    show_reset_action: "Show reset action",
    child_id: "Child",
    display_name: "Display name",
    chore_id: "Chore",
    subtitle: "Subtitle",
    start_time: "Active from (HH:MM)",
    end_time: "Active until (HH:MM; 24:00 allowed)",
    icon: "Icon",
    color_mode: "Icon color",
    color: "Color",
  })[schema.name];

  static styles = css`
    .config-section { display: grid; gap: 12px; margin: 24px 16px 0; }
    h2 { margin: 0; font-size: 16px; }
    .item-list { display: grid; gap: 8px; }
    .item-row { align-items: center; border: 1px solid var(--divider-color); border-radius: 8px; cursor: grab; display: grid; gap: 8px; grid-template-columns: auto 1fr auto auto; min-height: 48px; padding: 0 8px 0 12px; }
    .item-row:active { cursor: grabbing; }
    .item-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .drag-handle { color: var(--secondary-text-color); }
    .add-child, .add-chore { align-items: center; background: transparent; border: 1px solid var(--divider-color); border-radius: 8px; color: var(--primary-text-color); cursor: pointer; display: inline-flex; font: inherit; gap: 8px; justify-content: center; min-height: 40px; padding: 0 12px; }
    .add-child:disabled, .add-chore:disabled { cursor: not-allowed; opacity: .5; }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "chores-manager-quick-chore-card-editor": ChoresManagerQuickChoreCardEditor;
  }
}
