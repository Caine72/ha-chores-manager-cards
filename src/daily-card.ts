import { css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";

import { ChoresManagerBaseCard } from "./base-card";
import { DAILY_CARD_TYPE } from "./const";
import { getAssignments, getChildName, getEntityPicture, getWeeklyPoints, groupAssignments } from "./data";
import { localize } from "./localize";
import type { ChoreAssignment, DailyCardConfig } from "./types";

@customElement(DAILY_CARD_TYPE)
export class ChoresManagerDailyCard extends ChoresManagerBaseCard {
  private config?: DailyCardConfig;

  @state() private busyEntityId?: string;
  @state() private error?: string;

  static getConfigForm() {
    return {
      schema: [
        { name: "child_id", required: true, selector: { text: {} } },
        { name: "title", selector: { text: {} } },
        { name: "name", selector: { text: {} } },
        { name: "person_entity", selector: { entity: { domain: "person" } } },
        {
          name: "locale",
          selector: {
            select: {
              options: [
                { label: "Automatic", value: "auto" },
                { label: "English", value: "en" },
                { label: "Svenska", value: "sv" },
              ],
            },
          },
        },
      ],
    };
  }

  static getConfigElement(): HTMLElement {
    return document.createElement("chores-manager-daily-card-editor");
  }

  static getStubConfig(): DailyCardConfig {
    return { child_id: "kid_1", locale: "auto" };
  }

  setConfig(config: DailyCardConfig): void {
    if (!config?.child_id?.trim()) {
      throw new Error("child_id is required");
    }
    this.config = { locale: "auto", show_header: true, show_person: true, show_points: true, ...config };
    this.requestUpdate();
  }

  getCardSize(): number {
    return 4;
  }

  protected render() {
    if (!this.hass || !this.config) {
      return nothing;
    }

    const assignments = getAssignments(this.hass, this.config.child_id);
    const groups = groupAssignments(assignments);
    const points = getWeeklyPoints(this.hass, this.config.child_id);
    const portrait = getEntityPicture(this.hass, this.config.person_entity);
    const title =
      this.config.title ??
      this.config.name ??
      getChildName(this.hass, this.config.child_id) ??
      localize("chores", this.config.locale, this.hass);

    return html`
      <ha-card>
        ${this.config.show_header !== false
          ? html`
              <header>
                ${this.config.show_person !== false
                  ? portrait
                    ? html`<img class="portrait" src=${portrait} alt="" />`
                    : html`<ha-icon class="portrait-icon" icon="mdi:account-circle"></ha-icon>`
                  : nothing}
                <div>
                  <h1>${title}</h1>
                  ${this.config.show_points !== false && points !== undefined
                    ? html`<p>${points} ${localize("points", this.config.locale, this.hass)}</p>`
                    : nothing}
                </div>
              </header>
            `
          : nothing}
        ${this.error ? html`<p class="error" role="alert">${this.error}</p>` : nothing}
        ${groups.size === 0
          ? html`<p class="empty">${localize("no_chores", this.config.locale, this.hass)}</p>`
          : [...groups.entries()].map(([category, entries]) =>
              this.renderGroup(category, entries),
            )}
      </ha-card>
    `;
  }

  private renderGroup(category: string, entries: ChoreAssignment[]) {
    return html`
      <section>
        <h2>${category}</h2>
        ${entries.map(
          (assignment) => html`
            <button
              class="chore ${assignment.completed ? "completed" : ""}"
              ?disabled=${this.busyEntityId === assignment.entityId}
              @click=${() => this.toggleAssignment(assignment)}
            >
              <ha-icon icon=${assignment.icon}></ha-icon>
              <span class="title">${assignment.title}</span>
              ${this.config?.show_points !== false ? html`<span class="points">${assignment.points}p</span>` : nothing}
              <ha-icon
                class="check"
                icon=${assignment.completed
                  ? "mdi:check-circle"
                  : "mdi:circle-outline"}
              ></ha-icon>
            </button>
          `,
        )}
      </section>
    `;
  }

  private async toggleAssignment(assignment: ChoreAssignment): Promise<void> {
    if (!this.hass) {
      return;
    }

    this.busyEntityId = assignment.entityId;
    this.error = undefined;

    try {
      await this.hass.callService(
        "switch",
        assignment.completed ? "turn_off" : "turn_on",
        { entity_id: assignment.entityId },
      );
    } catch (error) {
      this.error =
        error instanceof Error ? error.message : "Unable to update chore";
    } finally {
      this.busyEntityId = undefined;
    }
  }

  static styles = css`
    :host { display: block; }
    ha-card { padding: 20px; }
    header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
    .portrait { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; }
    .portrait-icon { --mdc-icon-size: 52px; color: var(--state-icon-color); }
    h1, h2, p { margin: 0; }
    h1 { font-size: 20px; font-weight: 600; }
    header p, .points { color: var(--secondary-text-color); }
    section + section { margin-top: 18px; }
    h2 { font-size: 15px; margin-bottom: 6px; color: var(--secondary-text-color); }
    .chore { width: 100%; min-height: 48px; display: grid; grid-template-columns: 28px minmax(0, 1fr) auto 28px; align-items: center; gap: 8px; text-align: left; border: 0; background: transparent; color: var(--primary-text-color); cursor: pointer; font: inherit; }
    .chore:not(:disabled):hover { background: var(--secondary-background-color); }
    .chore:disabled { opacity: 0.55; cursor: progress; }
    .chore > ha-icon { color: var(--state-icon-color); }
    .title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .points { font-size: 13px; }
    .completed .title { text-decoration: line-through; color: var(--secondary-text-color); }
    .completed .check { color: var(--success-color, #34c759); }
    .error { color: var(--error-color); margin-bottom: 12px; }
    .empty { color: var(--secondary-text-color); }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    [DAILY_CARD_TYPE]: ChoresManagerDailyCard;
  }
}
