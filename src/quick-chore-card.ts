import { css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";

import { ChoresManagerBaseCard } from "./base-card";
import { QUICK_CHORE_CARD_TYPE } from "./const";
import { getAssignments, getAssociatedPersonEntity, getChildDisplayName, getEntityPicture } from "./data";
import { localize, resolveLocale } from "./localize";
import type { ChoreAssignment, QuickChoreCardConfig, QuickChoreChildConfig, QuickChoreSlotConfig } from "./types";

@customElement(QUICK_CHORE_CARD_TYPE)
export class ChoresManagerQuickChoreCard extends ChoresManagerBaseCard {
  private config?: QuickChoreCardConfig;
  private clockTimer?: number;
  @state() private pendingChoreIds = new Set<string>();
  @state() private error?: string;
  @state() private resetOpen = false;

  static getStubConfig(): QuickChoreCardConfig {
    return { title: "Quick chores", children: [{ child_id: "kid_1" }, { child_id: "kid_2" }], chores: [{ chore_id: "chore_1" }] };
  }

  static getConfigElement() {
    return document.createElement("chores-manager-quick-chore-card-editor");
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.clockTimer = window.setInterval(() => this.requestUpdate(), 60_000);
  }

  disconnectedCallback(): void {
    if (this.clockTimer !== undefined) window.clearInterval(this.clockTimer);
    super.disconnectedCallback();
  }

  setConfig(config: QuickChoreCardConfig): void {
    if (!config?.children?.length || !config?.chores?.length) throw new Error("children and chores are required");
    this.config = {
      locale: "auto", show_border: true, status_layout: "rows", density: "compact", shortcut_mode: "first_incomplete", shortcut_person_size: "medium",
      show_manual_actions: true, show_reset_action: false, ...config,
    };
  }

  protected hassUpdateKey(hass: NonNullable<this["hass"]>): readonly unknown[] | undefined {
    if (!this.config) return undefined;
    return this.config.children.flatMap((child) => getAssignments(hass, child.child_id).map((assignment) => [
      assignment.entityId, assignment.completed, assignment.completedByChildId, assignment.completedManually,
      hass.states[assignment.entityId]?.attributes.completed_at,
    ]));
  }

  protected render() {
    if (!this.hass || !this.config) return nothing;
    const completedSlots = this.config.chores.filter((slot) => this.assignmentFor(slot.chore_id)?.completed);
    return html`
      <ha-card class="${this.config.show_border === false ? "borderless " : ""}density-${this.config.density ?? "compact"}">
        ${this.config.title ? html`<h1>${this.config.title}</h1>` : nothing}
        ${this.error ? html`<p class="error" role="alert">${this.error}</p>` : nothing}
        <div class="statuses ${this.config.status_layout === "columns" ? "columns" : ""}">
          ${this.config.chores.map((slot) => this.renderStatus(slot))}
        </div>
        ${this.renderSection(this.config.shortcut_label ?? this.t("quick_shortcut"), html`
          <div class="shortcuts size-${this.config.shortcut_person_size ?? "medium"}">${this.config.children.map((child) => this.renderChildShortcut(child))}</div>
        `)}
        ${this.config.show_manual_actions ? this.renderSection(this.config.manual_label ?? this.t("quick_manual"), html`
          <div class="manual-actions">${this.config.chores.map((slot) => this.renderManualAction(slot))}</div>
        `) : nothing}
        ${this.config.show_reset_action && completedSlots.length ? html`
          <div class="reset-control">
            ${this.resetOpen ? html`<div class="reset-menu" role="menu">
              ${completedSlots.map((slot) => this.renderResetAction(slot))}
              ${completedSlots.length > 1 ? html`<button class="reset-all" @click=${this.resetAll}>
                <ha-icon icon="mdi:undo-variant"></ha-icon><span>${this.t("quick_reset_all")}</span>
              </button>` : nothing}
            </div>` : nothing}
            <button class="reset-toggle" aria-expanded=${this.resetOpen} aria-label=${this.t("quick_reset")}
              title=${this.t("quick_reset")} @click=${() => { this.resetOpen = !this.resetOpen; }}>
              <ha-icon icon="mdi:undo-variant"></ha-icon>
            </button>
          </div>
        ` : nothing}
      </ha-card>
    `;
  }

  private renderStatus(slot: QuickChoreSlotConfig) {
    const assignment = this.assignmentFor(slot.chore_id);
    const done = assignment?.completed === true;
    const manually = assignment?.completedManually === true;
    const claimant = assignment?.completedByChildId;
    const picture = claimant ? this.pictureFor(claimant) : undefined;
    const icon = assignment?.icon ?? "mdi:checkbox-marked-circle-outline";
    let detail = slot.subtitle ?? this.t("quick_not_completed");
    if (done) detail = manually
      ? `${this.t("quick_completed_manually")}${this.timeFor(assignment)}`
      : `${this.t("quick_completed_by")} ${assignment?.completedByChildName ?? claimant ?? ""}${this.timeFor(assignment)}`;
    return html`<div class="status ${done ? "done" : ""}">
      <div class="status-icon">${picture ? html`<img src=${picture} alt="" />` : html`<ha-icon icon=${done ? "mdi:check-circle" : icon}></ha-icon>`}</div>
      <div class="status-copy"><strong>${this.slotLabel(slot, assignment)}</strong><span>${detail}</span></div>
    </div>`;
  }

  private renderSection(label: string, content: unknown) {
    return html`<section class="action-section"><div class="separator"><strong>${label}</strong><span></span></div>${content}</section>`;
  }

  private renderChildShortcut(child: QuickChoreChildConfig) {
    const slot = this.activeShortcutSlot();
    const assignment = slot ? this.assignmentFor(slot.chore_id) : undefined;
    const done = assignment?.completed === true;
    const canUndo = done && assignment?.completedByChildId === child.child_id;
    const disabled = !slot || this.pendingChoreIds.has(slot.chore_id) || (done && !canUndo);
    const picture = this.pictureFor(child.child_id, child.person_entity);
    const name = getChildDisplayName(this.hass!, child.child_id, child.display_name, undefined, child.child_id);
    return html`<button class="shortcut ${disabled ? "disabled" : ""}" title=${slot ? this.slotLabel(slot, assignment) : ""}
      ?disabled=${disabled} @click=${() => slot && this.toggleChild(child.child_id, slot.chore_id, canUndo)}>
      <span class="portrait">${picture ? html`<img src=${picture} alt="" />` : html`<ha-icon icon="mdi:account"></ha-icon>`}</span><span>${name}</span>
    </button>`;
  }

  private renderManualAction(slot: QuickChoreSlotConfig) {
    const assignment = this.assignmentFor(slot.chore_id);
    const done = assignment?.completed === true;
    const icon = slot.icon ?? slot.manual_icon_override ?? slot.icon_override ?? assignment?.icon ?? "mdi:checkbox-marked-circle-outline";
    return html`<button class="manual" ?disabled=${done || this.pendingChoreIds.has(slot.chore_id)}
      @click=${() => this.completeManual(slot.chore_id)}><ha-icon icon=${icon}
        style=${slot.color ?? slot.manual_icon_color ? `color: ${slot.color ?? slot.manual_icon_color}` : nothing}></ha-icon><strong>${this.slotLabel(slot, assignment)}</strong></button>`;
  }

  private renderResetAction(slot: QuickChoreSlotConfig) {
    const assignment = this.assignmentFor(slot.chore_id);
    return html`<button class="reset-slot" ?disabled=${this.pendingChoreIds.has(slot.chore_id)} @click=${async () => {
      await this.resetSlot(slot.chore_id);
      this.resetOpen = false;
    }}><ha-icon icon="mdi:undo"></ha-icon><span>${this.t("quick_reset")} ${this.slotLabel(slot, assignment)}</span></button>`;
  }

  private activeShortcutSlot(): QuickChoreSlotConfig | undefined {
    if (!this.config) return undefined;
    if (this.config.shortcut_mode === "time_window") {
      const now = new Date();
      const minute = now.getHours() * 60 + now.getMinutes();
      const matching = this.config.chores.find((slot) => this.inWindow(minute, slot.start_time, slot.end_time));
      if (matching) return matching;
    }
    return this.config.chores.find((slot) => !this.assignmentFor(slot.chore_id)?.completed) ?? this.config.chores[0];
  }

  private inWindow(minute: number, start: string | undefined, end: string | undefined): boolean {
    const startMinute = this.parseTime(start);
    const endMinute = this.parseTime(end);
    if (startMinute === undefined || endMinute === undefined) return false;
    if (startMinute < endMinute) return minute >= startMinute && minute < endMinute;
    return minute >= startMinute || minute < endMinute;
  }

  private parseTime(value: string | undefined): number | undefined {
    const match = /^(\d{1,2}):(\d{2})$/.exec(value ?? "");
    if (!match) return undefined;
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (minutes > 59 || hours > 24 || (hours === 24 && minutes !== 0)) return undefined;
    return hours === 24 ? 1_440 : hours * 60 + minutes;
  }

  private assignmentFor(choreId: string): ChoreAssignment | undefined {
    if (!this.hass || !this.config) return undefined;
    for (const child of this.config.children) {
      const assignment = this.assignmentForChild(child.child_id, choreId);
      if (assignment) return assignment;
    }
    return undefined;
  }

  private assignmentForChild(childId: string, choreId: string): ChoreAssignment | undefined {
    return getAssignments(this.hass!, childId).find((item) => this.hass?.states[item.entityId]?.attributes.chore_id === choreId);
  }

  private slotLabel(slot: QuickChoreSlotConfig, assignment?: ChoreAssignment): string {
    return slot.display_name?.trim() || slot.label?.trim() || assignment?.title || slot.chore_id;
  }

  private pictureFor(childId: string, override?: string): string | undefined {
    if (!this.hass) return undefined;
    return getEntityPicture(this.hass, override ?? getAssociatedPersonEntity(this.hass, childId));
  }

  private timeFor(assignment: ChoreAssignment | undefined): string {
    const completedAt = assignment && this.hass?.states[assignment.entityId]?.attributes.completed_at;
    if (typeof completedAt !== "string") return "";
    const date = new Date(completedAt);
    if (Number.isNaN(date.valueOf())) return "";
    const timeFormat = this.hass?.locale?.time_format;
    const hourCycle = timeFormat === "24" ? "h23" : timeFormat === "12" ? "h12" : undefined;
    const time = date.toLocaleTimeString(this.hass?.locale?.language ?? this.hass?.language, {
      hour: "2-digit", minute: "2-digit", ...(hourCycle ? { hourCycle } : {}),
    });
    return resolveLocale(this.config?.locale, this.hass) === "sv" ? ` kl. ${time}` : ` at ${time}`;
  }

  private t(key: Parameters<typeof localize>[0]): string {
    return localize(key, this.config?.locale, this.hass);
  }

  private async toggleChild(childId: string, choreId: string, undo: boolean) {
    const assignment = this.assignmentForChild(childId, choreId);
    if (assignment) await this.call(choreId, "switch", undo ? "turn_off" : "turn_on", { entity_id: assignment.entityId });
  }

  private async completeManual(choreId: string) {
    await this.call(choreId, "chores_manager", "complete_chore_manually", { chore_id: choreId });
  }

  private async resetSlot(choreId: string) {
    const assignment = this.assignmentFor(choreId);
    if (assignment?.completedManually) {
      await this.call(choreId, "chores_manager", "reset_manual_chore_completion", { chore_id: choreId });
    } else if (assignment) {
      const claimant = assignment.completedByChildId ? this.assignmentForChild(assignment.completedByChildId, choreId) : assignment;
      await this.call(choreId, "switch", "turn_off", { entity_id: claimant?.entityId ?? assignment.entityId });
    }
  }

  private resetAll = async () => {
    if (!this.config) return;
    for (const slot of this.config.chores) if (this.assignmentFor(slot.chore_id)?.completed) await this.resetSlot(slot.chore_id);
    this.resetOpen = false;
  };

  private async call(choreId: string, domain: string, service: string, data: Record<string, unknown>) {
    if (!this.hass || this.pendingChoreIds.has(choreId)) return;
    this.pendingChoreIds = new Set(this.pendingChoreIds).add(choreId);
    this.error = undefined;
    try { await this.hass.callService(domain, service, data); }
    catch { this.error = this.t("quick_action_error"); }
    finally { const pending = new Set(this.pendingChoreIds); pending.delete(choreId); this.pendingChoreIds = pending; }
  }

  static styles = css`
    :host { display: block; } ha-card { padding: 22px; } h1 { margin: 2px 0 20px; font-size: 1.55rem; font-weight: 500; }
    .statuses { display: grid; gap: 14px; } .statuses.columns { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .status { min-height: 62px; display: flex; gap: 12px; align-items: center; box-sizing: border-box; border: 1px solid var(--divider-color); border-radius: 14px; padding: 10px 16px; }
    .status-icon { width: 38px; height: 38px; display: grid; place-items: center; flex: 0 0 38px; } .status ha-icon { color: var(--secondary-text-color); --mdc-icon-size: 25px; }
    .status.done ha-icon { color: var(--success-color, #4caf50); } .status img { width: 38px; height: 38px; object-fit: cover; border-radius: 50%; }
    .status-copy { min-width: 0; display: grid; gap: 2px; } .status-copy strong { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .status-copy span { color: var(--secondary-text-color); font-size: .88rem; } .action-section { margin-top: 26px; }
    .separator { display: flex; align-items: center; gap: 20px; margin: 0 16px 18px; } .separator strong { font-size: 1rem; }
    .separator span { height: 5px; flex: 1; border-radius: 5px; background: var(--divider-color); opacity: .45; }
    .shortcuts { display: grid; grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)); gap: 22px; }
    button { border: 0; font: inherit; color: var(--primary-text-color); cursor: pointer; } button:disabled { cursor: not-allowed; }
    .shortcut { display: grid; justify-items: center; gap: 7px; background: transparent; } .portrait { width: 64px; height: 64px; display: grid; place-items: center; border-radius: 50%; }
    .portrait img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; } .portrait ha-icon { --mdc-icon-size: 64px; color: var(--secondary-text-color); }
    .shortcuts.size-small .portrait { width: 40px; height: 40px; } .shortcuts.size-small .portrait ha-icon { --mdc-icon-size: 40px; }
    .shortcuts.size-medium .portrait { width: 64px; height: 64px; } .shortcuts.size-medium .portrait ha-icon { --mdc-icon-size: 64px; }
    .shortcuts.size-large .portrait { width: 96px; height: 96px; } .shortcuts.size-large .portrait ha-icon { --mdc-icon-size: 96px; }
    .shortcut.disabled { opacity: .42; }
    .manual-actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px; }
    .manual { min-height: 62px; display: flex; align-items: center; gap: 18px; border: 1px solid var(--divider-color); border-radius: 14px; padding: 12px 18px; background: transparent; text-align: left; }
    .manual ha-icon { color: var(--primary-color); } .manual:disabled { opacity: .42; }
    .reset-control { position: relative; display: flex; justify-content: flex-end; margin-top: 10px; }
    .reset-toggle { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 50%; background: transparent; color: var(--secondary-text-color); }
    .reset-toggle:hover { background: var(--secondary-background-color); color: var(--primary-text-color); }
    .reset-menu { position: absolute; right: 0; bottom: 44px; z-index: 1; display: grid; min-width: 176px; padding: 6px; border: 1px solid var(--divider-color); border-radius: 12px; background: var(--card-background-color, var(--ha-card-background, #fff)); box-shadow: var(--ha-card-box-shadow, 0 3px 8px rgb(0 0 0 / .2)); }
    .reset-slot, .reset-all { min-height: 36px; display: flex; align-items: center; gap: 10px; padding: 7px 10px; border-radius: 8px; background: transparent; color: var(--primary-text-color); text-align: left; }
    .reset-slot:hover, .reset-all:hover { background: var(--secondary-background-color); } .reset-all { border-top: 1px solid var(--divider-color); border-radius: 0 0 8px 8px; margin-top: 4px; padding-top: 10px; }
    ha-card.density-normal { padding: 28px; } ha-card.density-normal h1 { margin-bottom: 24px; }
    .density-normal .statuses { gap: 16px; } .density-normal .status { min-height: 70px; padding: 12px 18px; }
    .density-normal .action-section { margin-top: 32px; } .density-normal .separator { margin-bottom: 22px; }
    .density-normal .shortcuts { gap: 26px; } .density-normal .manual-actions { gap: 16px; } .density-normal .manual { min-height: 70px; padding: 14px 18px; }
    ha-card.density-comfortable { padding: 32px; } ha-card.density-comfortable h1 { margin-bottom: 28px; }
    .density-comfortable .statuses { gap: 18px; } .density-comfortable .status { min-height: 80px; padding: 16px 20px; }
    .density-comfortable .action-section { margin-top: 38px; } .density-comfortable .separator { margin-bottom: 26px; }
    .density-comfortable .shortcuts { gap: 30px; } .density-comfortable .manual-actions { gap: 18px; } .density-comfortable .manual { min-height: 80px; padding: 16px 20px; }
    .error { color: var(--error-color); } ha-card.borderless { border: 0; }
    @media (max-width: 520px) { ha-card { padding: 18px; } .statuses.columns { grid-template-columns: 1fr; } .separator { margin-inline: 10px; } .manual-actions { grid-template-columns: repeat(2, minmax(0, 1fr)); } .manual { gap: 10px; padding-inline: 12px; } }
  `;
}
