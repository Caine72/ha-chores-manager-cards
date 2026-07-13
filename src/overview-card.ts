import { handleAction } from "custom-card-helpers";
import type { ActionConfig as HaActionConfig, HomeAssistant as HaHomeAssistant } from "custom-card-helpers";
import { css, html, nothing } from "lit";
import { customElement } from "lit/decorators.js";

import { ChoresManagerBaseCard } from "./base-card";
import { OVERVIEW_CARD_TYPE } from "./const";
import { getChildName, getEntityPicture, getWeeklyPoints } from "./data";
import { localize } from "./localize";
import type { ActionConfig, OverviewCardConfig, RewardTier } from "./types";

@customElement(OVERVIEW_CARD_TYPE)
export class ChoresManagerOverviewCard extends ChoresManagerBaseCard {
  private config?: OverviewCardConfig;

  static getConfigForm() {
    return {
      schema: [
        { name: "child_id", required: true, selector: { text: {} } },
        { name: "name", selector: { text: {} } },
        { name: "person_entity", selector: { entity: { domain: "person" } } },
        { name: "goal_points", selector: { number: { min: 1, mode: "box" } } },
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
    return document.createElement("chores-manager-overview-card-editor");
  }

  static getStubConfig(): OverviewCardConfig {
    return {
      child_id: "kid_1",
      goal_points: 20,
      locale: "auto",
      rewards: [
        { points: 20, label: "Weekly reward" },
        { points: 30, label: "Weekly reward and allowance" },
      ],
    };
  }

  setConfig(config: OverviewCardConfig): void {
    if (!config?.child_id?.trim()) {
      throw new Error("child_id is required");
    }
    if (config.goal_points !== undefined && config.goal_points <= 0) {
      throw new Error("goal_points must be above zero");
    }
    this.config = { locale: "auto", person_position: "left", person_size: "medium", show_name: true, show_person: true, show_points: true, rewards: [], ...config };
    this.requestUpdate();
  }

  getCardSize(): number {
    return 5;
  }

  protected render() {
    if (!this.hass || !this.config) {
      return nothing;
    }

    const points = getWeeklyPoints(this.hass, this.config.child_id) ?? 0;
    const rewards = [...(this.config.rewards ?? [])].sort(
      (left, right) => left.points - right.points,
    );
    const nextReward = this.nextReward(points, rewards);
    const goal =
      nextReward?.points ?? rewards.at(-1)?.points ?? this.config.goal_points ?? 20;
    const portrait = getEntityPicture(this.hass, this.config.person_entity);
    const name =
      this.config.name ?? getChildName(this.hass, this.config.child_id) ?? this.config.child_id;
    const position = this.config.person_position ?? "left";
    const size = this.config.person_size ?? "medium";
    const progress = Math.min(100, Math.round((points / goal) * 100));

    return html`
      <ha-card>
        ${this.config.show_person !== false || this.config.show_name !== false
          ? html`
              <header class="position-${position}">
                ${this.config.show_person !== false
                  ? portrait
                    ? html`<img class="portrait size-${size}" src=${portrait} alt="" />`
                    : html`<ha-icon class="portrait-icon size-${size}" icon="mdi:account-circle"></ha-icon>`
                  : nothing}
                ${this.config.show_name !== false ? html`<h1>${name}</h1>` : nothing}
              </header>
            `
          : nothing}
        <div class="points-row" ?hidden=${this.config.show_points === false}>
          <ha-icon icon="mdi:progress-star"></ha-icon>
          <div>
            <strong>${points} / ${goal} ${localize("points", this.config.locale, this.hass)}</strong>
            ${nextReward
              ? html`<p>${this.rewardMessage(points, nextReward)}</p>`
              : html`<p>${localize("completed", this.config.locale, this.hass)}</p>`}
          </div>
        </div>
        <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax=${goal} aria-valuenow=${points}>
          <span style=${`width: ${progress}%`}></span>
        </div>
        <div class="actions">
          ${this.renderAction("mdi:format-list-checks", localize("daily", this.config.locale, this.hass), this.config.daily_action)}
          ${this.renderAction("mdi:trophy-outline", localize("history", this.config.locale, this.hass), this.config.history_action)}
          ${this.renderAction("mdi:wrench-cog", localize("correction", this.config.locale, this.hass), this.config.correction_action)}
        </div>
        ${this.config.rewards?.length
          ? html`<details><summary>${localize("rewards", this.config.locale, this.hass)}</summary>${this.config.rewards.map((reward) => html`<p class="reward"><strong>${reward.points}p</strong> ${reward.label}${reward.description ? html` · ${reward.description}` : nothing}</p>`)}</details>`
          : nothing}
      </ha-card>
    `;
  }

  private renderAction(icon: string, label: string, action: ActionConfig | undefined) {
    if (!action || action.action === "none") {
      return nothing;
    }
    return html`<button @click=${() => this.runAction(action)}><ha-icon icon=${icon}></ha-icon><span>${label}</span></button>`;
  }

  private runAction(action: ActionConfig): void {
    if (this.hass) {
      handleAction(
        this,
        this.hass as unknown as HaHomeAssistant,
        { tap_action: action as unknown as HaActionConfig },
        "tap",
      );
    }
  }

  private nextReward(points: number, rewards: RewardTier[]): RewardTier | undefined {
    return [...rewards]
      .sort((left, right) => left.points - right.points)
      .find((reward) => reward.points > points);
  }

  private rewardMessage(points: number, reward: RewardTier): string {
    if (!this.config || !this.hass) {
      return "";
    }
    return `${reward.points - points} ${localize("points", this.config.locale, this.hass)} ${localize("remaining", this.config.locale, this.hass)} ${reward.label}`;
  }

  static styles = css`
    :host { display: block; }
    ha-card { padding: 20px; }
    header { display: flex; align-items: center; gap: 12px; }
    header.position-center { flex-direction: column; text-align: center; }
    header.position-right { flex-direction: row-reverse; text-align: right; }
    .portrait { border-radius: 50%; object-fit: cover; }
    .portrait-icon { color: var(--state-icon-color); }
    .size-small { width: 40px; height: 40px; }
    .size-medium { width: 64px; height: 64px; }
    .size-large { width: 96px; height: 96px; }
    ha-icon.size-small { --mdc-icon-size: 40px; }
    ha-icon.size-medium { --mdc-icon-size: 64px; }
    ha-icon.size-large { --mdc-icon-size: 96px; }
    h1 { margin: 0; font-size: 20px; font-weight: 600; }
    .points-row { display: flex; gap: 12px; align-items: center; margin: 18px 0 12px; }
    .points-row > ha-icon { color: var(--state-icon-color); }
    p { margin: 3px 0 0; color: var(--secondary-text-color); font-size: 14px; }
    .progress { height: 6px; background: var(--secondary-background-color); overflow: hidden; }
    .progress span { display: block; height: 100%; background: var(--primary-color); transition: width 180ms ease-out; }
    .actions { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin-top: 20px; }
    button { min-height: 72px; padding: 8px; display: grid; place-items: center; gap: 5px; border: 1px solid var(--divider-color); border-radius: 8px; background: transparent; color: var(--primary-text-color); font: inherit; cursor: pointer; }
    button:hover { background: var(--secondary-background-color); }
    button ha-icon { color: var(--state-icon-color); }
    button span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }
    details { margin-top: 20px; }
    summary { cursor: pointer; font-weight: 600; }
    .reward { margin-left: 12px; }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    [OVERVIEW_CARD_TYPE]: ChoresManagerOverviewCard;
  }
}
