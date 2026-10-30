import { css, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";

import { ChoresManagerBaseCard } from "./base-card";
import { HISTORY_CARD_TYPE } from "./const";
import { getAssociatedPersonEntity, getCardHassUpdateKey, getChildDisplayName, getChildren, getEntityPicture, getWeeklyPointsUpdateKey } from "./data";
import { localize, resolveLocale } from "./localize";
import { sendMessagePromiseDeduped } from "./websocket";
import type {
  CompletionSnapshot,
  CurrentWeekHistoryResponse,
  HistoryCardConfig,
  HomeAssistant,
  PointActivity,
} from "./types";

interface HistoryDay {
  completions: CompletionSnapshot[];
  adjustments: PointActivity[];
}

@customElement(HISTORY_CARD_TYPE)
export class ChoresManagerHistoryCard extends ChoresManagerBaseCard {
  private config?: HistoryCardConfig;
  @state() private history?: CurrentWeekHistoryResponse;
  @state() private loadFailed = false;
  private groupedHistory?: CurrentWeekHistoryResponse;
  private groupedHistoryCache = new Map<string, HistoryDay>();
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
    return Math.max(2, 1 + this.groupedDays().size * 2);
  }

  protected hassUpdateKey(hass: HomeAssistant): readonly unknown[] | undefined {
    return this.config
      ? getCardHassUpdateKey(hass, this.config.child_id, [
          this.config.weekly_points_entity,
          this.config.person_entity,
          this.history?.person_entity_id,
        ])
      : undefined;
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
    const groups = this.groupedDays();
    if (!groups.size) {
      return html`<p class="empty">${localize("history_empty", this.config?.locale, this.hass)}</p>`;
    }
    return html`
      <div class="history">
        ${[...groups.entries()].map(([localDate, day]) =>
          this.renderDay(localDate, day),
        )}

      </div>
    `;
  }

  private renderDay(localDate: string, { completions, adjustments }: HistoryDay) {
    const total = completions.reduce((sum, completion) => sum + completion.points, 0) +
      adjustments.reduce((sum, activity) => sum + activity.points_delta, 0);
    return html`
      <section data-local-date=${localDate}>
        <h2>${this.weekday(localDate)} <time datetime=${localDate}>${this.calendarDate(localDate)}</time></h2>
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
          ${adjustments.map((activity) => html`
            <li class="activity">
              <span>${localize("activity_points_adjusted", this.config?.locale, this.hass)}</span>
              ${this.config?.show_points !== false
                ? html`<span class="points"> · ${activity.points_delta >= 0 ? "+" : ""}${activity.points_delta}p</span>`
                : nothing}
              <span> · ${activity.actor_name}${activity.reason ? ` · ${activity.reason}` : ""}</span>
            </li>
          `)}
        </ul>
        ${this.config?.show_points !== false
          ? html`<strong class="total">${localize("total", this.config?.locale, this.hass)}: ${total}p</strong>`
          : nothing}
      </section>
    `;
  }

  private groupedDays(): Map<string, HistoryDay> {
    if (this.groupedHistory === this.history) {
      return this.groupedHistoryCache;
    }
    const groups = new Map<string, HistoryDay>();
    const dayFor = (localDate: string): HistoryDay => {
      let day = groups.get(localDate);
      if (!day) {
        day = { completions: [], adjustments: [] };
        groups.set(localDate, day);
      }
      return day;
    };
    for (const completion of this.history?.completions ?? []) {
      dayFor(completion.local_date).completions.push(completion);
    }
    const adjustments = (this.history?.activities ?? [])
      .filter((activity) => activity.action === "points_adjusted")
      .sort((left, right) => left.occurred_at.localeCompare(right.occurred_at) ||
        left.activity_id.localeCompare(right.activity_id));
    const summaries = new Map<string, PointActivity>();
    for (const activity of adjustments) {
      const key = JSON.stringify([
        activity.local_date,
        activity.actor_user_id ?? null,
        activity.actor_name,
        activity.reason ?? "",
        Math.sign(activity.points_delta),
      ]);
      const summary = summaries.get(key);
      if (summary) {
        summary.points_delta += activity.points_delta;
      } else {
        const entry = { ...activity };
        summaries.set(key, entry);
        dayFor(activity.local_date).adjustments.push(entry);
      }
    }
    for (const { completions } of groups.values()) {
      completions.sort(
        (left, right) =>
          left.category.localeCompare(right.category) ||
          left.chore_title.localeCompare(right.chore_title) ||
          left.completion_id.localeCompare(right.completion_id),
      );
    }
    this.groupedHistory = this.history;
    this.groupedHistoryCache = new Map(
      [...groups.entries()].sort(([left], [right]) => left.localeCompare(right)),
    );
    return this.groupedHistoryCache;
  }

  private calendarDate(localDate: string): string {
    const locale = resolveLocale(this.config?.locale, this.hass);
    return new Intl.DateTimeFormat(locale === "sv" ? "sv-SE" : "en-US", {
      day: "numeric",
      month: "short",
    }).format(new Date(`${localDate}T12:00:00`));
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
    void sendMessagePromiseDeduped<CurrentWeekHistoryResponse>(connection, {
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
    h2 time { color: var(--secondary-text-color); font-size: 13px; font-weight: 400; margin-left: 6px; text-transform: none; }
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
