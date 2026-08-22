import { css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";

import { ChoresManagerBaseCard } from "./base-card";
import { HISTORY_CARD_TYPE } from "./const";
import { getAssociatedPersonEntity, getChildDisplayName, getChildren, getEntityPicture, getWeeklyPointsUpdateKey } from "./data";
import { localize, resolveLocale } from "./localize";
import type {
  CompletionSnapshot,
  CurrentWeekHistoryResponse,
  HistoryCardConfig,
  HomeAssistant,
} from "./types";

@customElement(HISTORY_CARD_TYPE)
export class ChoresManagerHistoryCard extends ChoresManagerBaseCard {
  private config?: HistoryCardConfig;
  @state() private history?: CurrentWeekHistoryResponse;
  @state() private loadFailed = false;
  private requestChildId?: string;
  private requestConnection?: HomeAssistant["connection"];
  private requestUpdateKey?: string;

  static getConfigElement() {
    return document.createElement("chores-manager-history-card-editor");
  }

  static getStubConfig(hass?: HomeAssistant): HistoryCardConfig {
    return {
      child_id: hass ? getChildren(hass)[0]?.id ?? "kid_1" : "kid_1",
      locale: "auto",
      show_border: true,
      show_header: true,
      show_person: true,
      show_points: true,
    };
  }

  setConfig(config: HistoryCardConfig): void {
    if (!config?.child_id?.trim()) {
      throw new Error("child_id is required");
    }
    this.config = {
      locale: "auto",
      show_border: true,
      show_header: true,
      show_person: true,
      show_points: true,
      ...config,
    };
    this.load();
    this.requestUpdate();
  }

  protected willUpdate(): void {
    this.load();
  }

  getCardSize(): number {
    return Math.max(2, 1 + this.groupedCompletions().size * 2);
  }

  protected render() {
    if (!this.hass || !this.config) {
      return nothing;
    }
    const portrait = getEntityPicture(
      this.hass,
      this.config.person_entity ??
        this.history?.person_entity_id ??
        getAssociatedPersonEntity(this.hass, this.config.child_id),
    );
    const title = getChildDisplayName(
      this.hass,
      this.config.child_id,
      this.config.name,
      this.history?.child_name,
      localize("weekly_chores", this.config.locale, this.hass),
    );

    return html`
      <ha-card class=${this.config.show_border === false ? "borderless" : ""}>
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
                  <p>${localize("weekly_chores", this.config.locale, this.hass)}</p>
                </div>
              </header>
            `
          : nothing}
        ${this.loadFailed
          ? html`<p class="error" role="alert">${localize("history_error", this.config.locale, this.hass)}</p>`
          : this.history
            ? this.renderHistory()
            : nothing}
      </ha-card>
    `;
  }

  private renderHistory() {
    const groups = this.groupedCompletions();
    if (!groups.size) {
      return html`<p class="empty">${localize("history_empty", this.config?.locale, this.hass)}</p>`;
    }
    return html`
      <div class="history">
        ${[...groups.entries()].map(([localDate, completions]) =>
          this.renderDay(localDate, completions),
        )}
      </div>
    `;
  }

  private renderDay(localDate: string, completions: CompletionSnapshot[]) {
    const total = completions.reduce((sum, completion) => sum + completion.points, 0);
    return html`
      <section data-local-date=${localDate}>
        <h2>${this.weekday(localDate)}</h2>
        <ul>
          ${completions.map(
            (completion) => html`
              <li>
                <span>${completion.chore_title}</span>
                ${this.config?.show_points !== false
                  ? html`<span class="points"> · ${completion.points}p</span>`
                  : nothing}
              </li>
            `,
          )}
        </ul>
        ${this.config?.show_points !== false
          ? html`<strong class="total">${localize("total", this.config?.locale, this.hass)}: ${total}p</strong>`
          : nothing}
      </section>
    `;
  }

  private groupedCompletions(): Map<string, CompletionSnapshot[]> {
    const groups = new Map<string, CompletionSnapshot[]>();
    for (const completion of this.history?.completions ?? []) {
      const entries = groups.get(completion.local_date) ?? [];
      entries.push(completion);
      groups.set(completion.local_date, entries);
    }
    for (const entries of groups.values()) {
      entries.sort(
        (left, right) =>
          left.category.localeCompare(right.category) ||
          left.chore_title.localeCompare(right.chore_title) ||
          left.completion_id.localeCompare(right.completion_id),
      );
    }
    return new Map([...groups.entries()].sort(([left], [right]) => left.localeCompare(right)));
  }

  private weekday(localDate: string): string {
    const locale = resolveLocale(this.config?.locale, this.hass);
    return new Intl.DateTimeFormat(locale === "sv" ? "sv-SE" : "en-US", {
      weekday: "long",
    }).format(new Date(`${localDate}T12:00:00`));
  }

  private load(): void {
    const connection = this.hass?.connection;
    const childId = this.config?.child_id;
    if (!connection || !childId) {
      return;
    }
    const updateKey = getWeeklyPointsUpdateKey(
      this.hass!,
      childId,
      this.config?.weekly_points_entity,
    );
    if (
      childId === this.requestChildId &&
      connection === this.requestConnection &&
      updateKey === this.requestUpdateKey
    ) {
      return;
    }
    this.requestChildId = childId;
    this.requestConnection = connection;
    this.requestUpdateKey = updateKey;
    this.history = undefined;
    this.loadFailed = false;
    void connection
      .sendMessagePromise<CurrentWeekHistoryResponse>({
        type: "chores_manager/current_week_history",
        child_id: childId,
      })
      .then((history) => {
        if (
          this.requestChildId === childId &&
          this.requestConnection === connection &&
          this.requestUpdateKey === updateKey
        ) {
          this.history = history;
        }
      })
      .catch(() => {
        if (
          this.requestChildId === childId &&
          this.requestConnection === connection &&
          this.requestUpdateKey === updateKey
        ) {
          this.loadFailed = true;
        }
      });
  }

  static styles = css`
    :host { display: block; }
    ha-card { padding: 22px 28px 26px; }
    ha-card.borderless { border: 0; }
    header { align-items: center; display: flex; gap: 12px; margin-bottom: 22px; }
    header h1, header p, h2, ul, .empty, .error { margin: 0; }
    header h1 { font-size: 18px; font-weight: 600; }
    header p { color: var(--secondary-text-color); font-size: 13px; margin-top: 2px; }
    .portrait { border-radius: 50%; height: 48px; object-fit: cover; width: 48px; }
    .portrait-icon { --mdc-icon-size: 48px; color: var(--state-icon-color); }
    .history { display: grid; gap: 24px; }
    h2 { font-size: 16px; font-weight: 600; margin-bottom: 12px; text-transform: capitalize; }
    ul { padding-left: 24px; }
    li { line-height: 1.45; margin-bottom: 7px; padding-left: 2px; }
    .points { white-space: nowrap; }
    .total { display: block; font-size: 14px; margin-top: 14px; }
    .empty { color: var(--secondary-text-color); font-style: italic; }
    .error { color: var(--error-color); }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    [HISTORY_CARD_TYPE]: ChoresManagerHistoryCard;
  }
}
