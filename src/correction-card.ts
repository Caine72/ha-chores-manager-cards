import { css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";

import { ChoresManagerBaseCard } from "./base-card";
import { CORRECTION_CARD_TYPE } from "./const";
import { getAssociatedPersonEntity, getChildren, getEntityPicture, getWeeklyPointsWeekStart } from "./data";
import { localize, resolveLocale } from "./localize";
import type {
  CompletionSnapshot,
  CorrectionCardConfig,
  CurrentWeekCompletionsResponse,
  HomeAssistant,
  InventoryAssignment,
  InventoryChore,
  InventoryResponse,
  WeeklyPointsResponse,
} from "./types";

interface CorrectionRow {
  assignment: InventoryAssignment;
  chore: InventoryChore;
  completed: boolean;
}

type CorrectionError = "child_not_found" | "load_failed";

@customElement(CORRECTION_CARD_TYPE)
export class ChoresManagerCorrectionCard extends ChoresManagerBaseCard {
  private config?: CorrectionCardConfig;
  @state() private inventory?: InventoryResponse;
  @state() private history?: CurrentWeekCompletionsResponse;
  @state() private weeklyPoints?: WeeklyPointsResponse;
  @state() private selectedDate?: string;
  @state() private pendingAssignment?: string;
  @state() private error?: CorrectionError;
  @state() private dateInputReady = Boolean(customElements.get("ha-date-input"));
  private requestChildId?: string;
  private requestConnection?: HomeAssistant["connection"];
  private requestWeekStart?: string;

  static getConfigElement() {
    return document.createElement("chores-manager-correction-card-editor");
  }

  static getStubConfig(hass?: HomeAssistant): CorrectionCardConfig {
    return {
      child_id: hass ? getChildren(hass)[0]?.id ?? "kid_1" : "kid_1",
      locale: "auto",
      show_border: true,
      show_header: true,
    };
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.loadDateInput();
  }

  setConfig(config: CorrectionCardConfig): void {
    if (!config?.child_id?.trim()) {
      throw new Error("child_id is required");
    }
    this.config = { locale: "auto", show_border: true, show_header: true, ...config };
    this.load();
    this.requestUpdate();
  }

  protected willUpdate(): void {
    this.load();
  }

  getCardSize(): number {
    return 9;
  }

  protected render() {
    if (!this.hass || !this.config) {
      return nothing;
    }
    const child = this.inventory?.children.find(
      (candidate) => candidate.child_id === this.config?.child_id,
    );
    const name = this.config.name ?? child?.name ?? this.config.child_id;
    const portrait = getEntityPicture(
      this.hass,
      this.config.person_entity ??
        child?.person_entity_id ??
        this.weeklyPoints?.person_entity_id ??
        getAssociatedPersonEntity(this.hass, this.config.child_id),
    );

    return html`
      <ha-card class=${this.config.show_border === false ? "borderless" : ""}>
        ${this.config.show_header !== false
          ? html`
              <header>
                ${portrait
                  ? html`<img class="portrait" src=${portrait} alt="" />`
                  : html`<ha-icon class="portrait-icon" icon="mdi:account-circle"></ha-icon>`}
                <strong class="title">${localize("correct_chores", this.config.locale, this.hass)} - ${name}</strong>
                <span class="header-points">${this.weeklyPoints?.current_week.points ?? 0}p</span>
                <button class="header-button" aria-label=${localize("back", this.config.locale, this.hass)} @click=${this.goBack}>
                  <ha-icon icon="mdi:arrow-left"></ha-icon>
                </button>
                <button class="header-button" aria-label=${localize("close", this.config.locale, this.hass)} @click=${this.close}>
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              </header>
            `
          : nothing}
        ${this.error
          ? html`<p class="error" role="alert">${localize(
              this.error === "child_not_found"
                ? "correction_child_not_found"
                : "correction_error",
              this.config.locale,
              this.hass,
            )}</p>`
          : this.history && this.inventory && this.selectedDate
            ? html`
                ${this.renderDateNavigation()}
                <div class="groups">${this.renderGroups()}</div>
              `
            : nothing}
      </ha-card>
    `;
  }

  private renderDateNavigation() {
    const locale = resolveLocale(this.config?.locale, this.hass);
    const selected = new Date(`${this.selectedDate}T12:00:00`);
    const label = new Intl.DateTimeFormat(locale === "sv" ? "sv-SE" : "en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(selected);
    const atStart = this.selectedDate === this.history?.window.start;
    const atEnd = this.selectedDate === this.history?.window.end;
    return html`
      <section class="date-navigation">
        <h1>${label}</h1>
        <div class="date-actions">
          <button ?disabled=${atStart} aria-label=${localize("previous_date", this.config?.locale, this.hass)} @click=${() => this.shiftDate(-1)}>
            <ha-icon icon="mdi:chevron-left"></ha-icon>
          </button>
          <button ?disabled=${atEnd} aria-label=${localize("next_date", this.config?.locale, this.hass)} @click=${() => this.shiftDate(1)}>
            <ha-icon icon="mdi:chevron-right"></ha-icon>
          </button>
          <div
            class=${this.dateInputReady ? "date-picker" : "date-picker loading"}
            aria-busy=${this.dateInputReady ? "false" : "true"}
          >
            <ha-icon icon="mdi:calendar"></ha-icon>
            <ha-date-input
              .label=${localize("choose_date", this.config?.locale, this.hass)}
              .locale=${this.dateInputLocale()}
              .min=${this.history?.window.start ?? ""}
              .max=${this.history?.window.end ?? ""}
              .value=${this.selectedDate ?? ""}
              @change=${this.chooseDate}
            ></ha-date-input>
          </div>
        </div>
      </section>
    `;
  }

  private renderGroups() {
    const groups = new Map<string, CorrectionRow[]>();
    for (const row of this.rows()) {
      const entries = groups.get(row.chore.category) ?? [];
      entries.push(row);
      groups.set(row.chore.category, entries);
    }
    return [...groups].map(
      ([category, rows]) => html`
        <section class="group">
          <h2>${category}</h2>
          ${rows.map((row) => this.renderRow(row))}
        </section>
      `,
    );
  }

  private renderRow(row: CorrectionRow) {
    const pending = this.pendingAssignment === row.assignment.assignment_id;
    const label = row.completed
      ? localize("remove_completion", this.config?.locale, this.hass)
      : localize("add_completion", this.config?.locale, this.hass);
    return html`
      <div class="chore-row">
        <ha-icon class="chore-icon" icon=${row.chore.icon}></ha-icon>
        <div class="chore-copy">
          <strong>${row.chore.title}</strong>
          <span>${row.chore.points}p</span>
        </div>
        <button class=${row.completed ? "remove" : "add"} ?disabled=${pending} aria-label=${`${label}: ${row.chore.title}`} @click=${() => this.setCompletion(row, !row.completed)}>
          <ha-icon icon=${row.completed ? "mdi:minus" : "mdi:plus"}></ha-icon>
        </button>
      </div>
    `;
  }

  private rows(): CorrectionRow[] {
    if (!this.inventory || !this.history || !this.config || !this.selectedDate) {
      return [];
    }
    const chores = new Map(this.inventory.chores.map((chore) => [chore.chore_id, chore]));
    const completed = new Set(
      this.history.completions
        .filter(
          (completion) =>
            completion.child_id === this.config?.child_id &&
            completion.local_date === this.selectedDate,
        )
        .map((completion) => completion.assignment_id),
    );
    return this.inventory.assignments
      .filter((assignment) => assignment.child_id === this.config?.child_id)
      .flatMap((assignment) => {
        const chore = chores.get(assignment.chore_id);
        return chore ? [{ assignment, chore, completed: completed.has(assignment.assignment_id) }] : [];
      })
      .sort(
        (left, right) =>
          left.chore.sort_order - right.chore.sort_order ||
          left.chore.title.localeCompare(right.chore.title),
      );
  }

  private load(): void {
    const connection = this.hass?.connection;
    const childId = this.config?.child_id;
    if (!connection || !childId) {
      return;
    }
    const weekStart = getWeeklyPointsWeekStart(this.hass!, childId);
    if (
      childId === this.requestChildId &&
      connection === this.requestConnection &&
      weekStart === this.requestWeekStart
    ) {
      return;
    }
    this.requestChildId = childId;
    this.requestConnection = connection;
    this.requestWeekStart = weekStart;
    this.error = undefined;
    void Promise.all([
      connection.sendMessagePromise<InventoryResponse>({ type: "chores_manager/inventory" }),
      connection.sendMessagePromise<CurrentWeekCompletionsResponse>({ type: "chores_manager/current_week_completions" }),
    ])
      .then(async ([inventory, history]) => {
        if (
          this.requestChildId !== childId ||
          this.requestConnection !== connection ||
          this.requestWeekStart !== weekStart
        ) {
          return;
        }
        this.inventory = inventory;
        this.history = history;
        if (!inventory.children.some((child) => child.child_id === childId)) {
          this.error = "child_not_found";
          return;
        }
        const weeklyPoints = await connection.sendMessagePromise<WeeklyPointsResponse>({
          type: "chores_manager/weekly_points",
          child_id: childId,
        });
        if (
          this.requestChildId !== childId ||
          this.requestConnection !== connection ||
          this.requestWeekStart !== weekStart
        ) {
          return;
        }
        this.weeklyPoints = weeklyPoints;
        this.selectedDate = this.selectedDate && this.selectedDate >= history.window.start && this.selectedDate <= history.window.end
          ? this.selectedDate
          : history.window.end;
      })
      .catch(() => {
        if (
          this.requestChildId === childId &&
          this.requestConnection === connection &&
          this.requestWeekStart === weekStart
        ) {
          this.error = "load_failed";
        }
      });
  }

  private async setCompletion(row: CorrectionRow, completed: boolean): Promise<void> {
    const connection = this.hass?.connection;
    if (!connection || !this.selectedDate || this.pendingAssignment) {
      return;
    }
    this.pendingAssignment = row.assignment.assignment_id;
    try {
      const result = await connection.sendMessagePromise<{
        completion_id: string | null;
        changed: boolean;
      }>({
        type: "chores_manager/set_current_week_completion",
        assignment_id: row.assignment.assignment_id,
        local_date: this.selectedDate,
        completed,
      });
      this.updateHistory(row, completed, result.completion_id);
      this.weeklyPoints = await connection.sendMessagePromise<WeeklyPointsResponse>({
        type: "chores_manager/weekly_points",
        child_id: this.config?.child_id,
      });
    } catch {
      this.error = "load_failed";
    } finally {
      this.pendingAssignment = undefined;
    }
  }

  private updateHistory(
    row: CorrectionRow,
    completed: boolean,
    completionId: string | null,
  ): void {
    if (!this.history || !this.config || !this.selectedDate) {
      return;
    }
    const remaining = this.history.completions.filter(
      (completion) =>
        completion.assignment_id !== row.assignment.assignment_id ||
        completion.local_date !== this.selectedDate,
    );
    if (completed && completionId) {
      const snapshot: CompletionSnapshot = {
        completion_id: completionId,
        assignment_id: row.assignment.assignment_id,
        assignment_exists: true,
        child_id: this.config.child_id,
        chore_id: row.chore.chore_id,
        local_date: this.selectedDate,
        completed_at: new Date().toISOString(),
        child_name: this.weeklyPoints?.child_name ?? this.config.child_id,
        chore_title: row.chore.title,
        category: row.chore.category,
        points: row.chore.points,
      };
      remaining.push(snapshot);
    }
    this.history = { ...this.history, completions: remaining };
  }

  private shiftDate(days: -1 | 1): void {
    if (!this.selectedDate || !this.history) return;
    const date = new Date(`${this.selectedDate}T12:00:00`);
    date.setDate(date.getDate() + days);
    const next = date.toISOString().slice(0, 10);
    if (next >= this.history.window.start && next <= this.history.window.end) {
      this.selectedDate = next;
    }
  }

  private chooseDate(event: Event): void {
    const value = (event.currentTarget as HTMLElement & { value?: string }).value;
    if (value) this.selectedDate = value;
  }

  private dateInputLocale() {
    return this.hass?.locale ?? {
      language: resolveLocale(this.config?.locale, this.hass),
      number_format: "language",
      time_format: "language",
      date_format: "language",
      first_weekday: "language",
      time_zone: "local",
    };
  }

  private loadDateInput(): void {
    if (this.dateInputReady || customElements.get("ha-date-input")) {
      this.dateInputReady = true;
      return;
    }
    const loadCardHelpers = (window as Window & {
      loadCardHelpers?: () => Promise<{
        importMoreInfoControl: (domain: string) => void;
      }>;
    }).loadCardHelpers;
    if (!loadCardHelpers) {
      return;
    }
    void loadCardHelpers()
      .then((helpers) => {
        helpers.importMoreInfoControl("input_datetime");
        return customElements.whenDefined("ha-date-input");
      })
      .then(() => {
        this.dateInputReady = true;
      })
      .catch(() => {
        this.dateInputReady = false;
      });
  }

  private goBack = (): void => history.back();

  private close = (): void => {
    if (location.hash) location.hash = "";
    else history.back();
  };

  static styles = css`
    :host { display:block; }
    ha-card.borderless { border:0; }
    ha-card { padding:16px 20px 28px; overflow:hidden; }
    header { display:grid; grid-template-columns:56px minmax(0,1fr) auto 56px 56px; align-items:center; gap:10px; }
    .portrait, .portrait-icon { width:56px; height:56px; border-radius:50%; object-fit:cover; }
    .portrait-icon { --mdc-icon-size:56px; color:var(--state-icon-color); }
    .title { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:14px; }
    .header-points { font-size:12px; }
    button { border:1px solid var(--divider-color); background:transparent; color:var(--primary-text-color); cursor:pointer; }
    button:disabled { cursor:default; opacity:.35; }
    .header-button { width:56px; height:56px; border:0; border-radius:50%; background:var(--secondary-background-color); }
    .header-button ha-icon { --mdc-icon-size:28px; }
    .date-navigation { display:flex; align-items:center; justify-content:space-between; gap:16px; margin:26px 0 30px; }
    .date-navigation h1 { margin:0; font-size:23px; text-transform:capitalize; }
    .date-actions { display:flex; align-items:center; gap:8px; }
    .date-actions button, .date-picker { position:relative; display:grid; place-items:center; width:40px; height:40px; border:0; color:var(--state-icon-color); }
    .date-picker ha-date-input { position:absolute; inset:0; width:100%; opacity:0; cursor:pointer; }
    .date-picker.loading { opacity:.35; pointer-events:none; }
    .groups { display:grid; gap:24px; }
    .group h2 { margin:0 0 10px; font-size:17px; font-weight:500; }
    .chore-row { display:grid; grid-template-columns:34px minmax(0,1fr) 40px; align-items:center; gap:8px; min-height:44px; padding-left:28px; }
    .chore-icon { color:var(--state-icon-color); }
    .chore-copy { display:grid; min-width:0; }
    .chore-copy strong { overflow:hidden; text-overflow:ellipsis; font-size:14px; }
    .chore-copy span { color:var(--secondary-text-color); font-size:12px; }
    .chore-row button { width:36px; height:36px; border-radius:50%; }
    .chore-row .add ha-icon { color:var(--success-color,#43a047); }
    .chore-row .remove ha-icon { color:var(--error-color,#ef5350); }
    .error { color:var(--error-color,#ef5350); }
    @media (max-width:480px) {
      ha-card { padding:10px 8px 24px; }
      header { grid-template-columns:56px minmax(0,1fr) auto 56px 56px; gap:6px; }
      .date-navigation { margin:28px 0 30px; }
      .chore-row { padding-left:38px; }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    [CORRECTION_CARD_TYPE]: ChoresManagerCorrectionCard;
  }
}
