import { handleClick } from "custom-card-helpers";
import type {
  ActionConfig as HaActionConfig,
  HomeAssistant as HaHomeAssistant,
} from "custom-card-helpers";
import { css, html, nothing } from "lit";
import { customElement } from "lit/decorators.js";

import { ChoresManagerBaseCard } from "./base-card";
import { OVERVIEW_CARD_TYPE } from "./const";
import {
  getAssignments,
  getChildName,
  getConfiguredChildId,
  getEntityPicture,
  getWeeklyPoints,
} from "./data";
import { localize } from "./localize";
import type {
  ChoreAssignment,
  OverviewButton,
  OverviewCardConfig,
  RewardTier,
} from "./types";

const COLOR_ALIASES: Record<string, string> = {
  amber: "#ffc107",
  blue: "#2196f3",
  cyan: "#00bcd4",
  green: "#4caf50",
  orange: "#ff9800",
  purple: "#9c27b0",
  red: "#f44336",
  teal: "#009688",
  yellow: "#ffeb3b",
};
const HEX_COLOR = /^#[0-9a-f]{6}$/iu;
const HOLD_DELAY_MS = 500;
const DOUBLE_TAP_DELAY_MS = 250;

const LEGACY_BUTTONS: Array<Pick<OverviewButton, "label" | "icon" | "color">> = [
  { label: "Chores", icon: "mdi:format-list-checks", color: "#00bcd4" },
  { label: "History", icon: "mdi:trophy-outline", color: "#ffc107" },
  { label: "Correction", icon: "mdi:wrench-cog", color: "#9c27b0" },
];

@customElement(OVERVIEW_CARD_TYPE)
export class ChoresManagerOverviewCard extends ChoresManagerBaseCard {
  private config?: OverviewCardConfig;
  private readonly heldButtons = new WeakSet<HTMLButtonElement>();
  private readonly holdTimers = new WeakMap<HTMLButtonElement, number>();
  private readonly clickTimers = new WeakMap<HTMLButtonElement, number>();

  static getConfigElement() {
    return document.createElement("chores-manager-overview-card-editor");
  }

  static getStubConfig(): OverviewCardConfig {
    return {
      child_id: "kid_1",
      goal_points: 20,
      progress_color: "#00a6d6",
      locale: "auto",
      rewards: [
        { points: 20, label: "Weekly reward", color: "#34c759" },
        { points: 30, label: "Weekly reward and allowance", color: "#ff9f0a" },
      ],
    };
  }

  setConfig(config: OverviewCardConfig): void {
    if (!config?.child_id?.trim() && !config?.child_entity?.trim()) {
      throw new Error("child_id or child_entity is required");
    }
    if (config.goal_points !== undefined && config.goal_points <= 0) {
      throw new Error("goal_points must be above zero");
    }
    this.config = {
      locale: "auto",
      person_position: "left",
      person_size: "medium",
      show_name: true,
      show_person: true,
      show_points: true,
      rewards: [],
      ...config,
    };
    this.requestUpdate();
  }

  getCardSize(): number {
    return 5;
  }

  protected render() {
    if (!this.hass || !this.config) {
      return nothing;
    }

    const childId = getConfiguredChildId(this.hass, this.config);
    if (!childId) {
      return nothing;
    }

    const points = getWeeklyPoints(
      this.hass,
      childId,
      this.config.weekly_points_entity ?? this.config.child_entity,
    ) ?? 0;
    const assignments = getAssignments(this.hass, childId);
    const rewards = [...(this.config.rewards ?? [])].sort(
      (left, right) => left.points - right.points,
    );
    const nextReward = this.nextReward(points, rewards);
    const goal =
      nextReward?.points ?? rewards.at(-1)?.points ?? this.config.goal_points ?? 20;
    const portrait = getEntityPicture(this.hass, this.config.person_entity);
    const name = this.config.name ?? getChildName(this.hass, childId) ?? childId;
    const position = this.config.person_position ?? "left";
    const size = this.config.person_size ?? "medium";
    const progress = Math.min(100, Math.round((points / goal) * 100));
    const progressColor = this.progressColor(points, rewards);
    const buttons = this.buttons().filter((button) => this.isVisible(button));

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
              : html`<p>${this.finalRewardMessage(rewards)}</p>`}
          </div>
        </div>
        <div class="progress" style=${"background: " + this.progressTrackColor(progressColor)} role="progressbar" aria-valuemin="0" aria-valuemax=${goal} aria-valuenow=${points}>
          <span style=${`width: ${progress}%; background: ${progressColor}`}></span>
        </div>
        ${buttons.length
          ? html`
              <div class="button-divider"></div>
              <div class="actions">
                ${buttons.map((button) => this.renderButton(button))}
              </div>
            `
          : nothing}
        ${assignments.length || rewards.length
          ? this.renderPointsAndRewards(assignments, rewards)
          : nothing}
      </ha-card>
    `;
  }

  private renderPointsAndRewards(assignments: ChoreAssignment[], rewards: RewardTier[]) {
    const assignmentsByPoints = new Map<number, ChoreAssignment[]>();
    for (const assignment of assignments) {
      const entries = assignmentsByPoints.get(assignment.points) ?? [];
      entries.push(assignment);
      assignmentsByPoints.set(assignment.points, entries);
    }

    return html`
      <details class="points-rewards">
        <summary>
          <span>${localize("rewards", this.config?.locale, this.hass)}</span>
          <p>${localize("how_points_work", this.config?.locale, this.hass)}</p>
        </summary>
        <div class="rewards-content">
          ${assignmentsByPoints.size
            ? html`
                <section>
                  <h2>${localize("chores", this.config?.locale, this.hass)}</h2>
                  ${[...assignmentsByPoints.entries()]
                    .sort(([left], [right]) => right - left)
                    .map(
                      ([assignmentPoints, entries]) => html`
                        <h3>${assignmentPoints} ${localize("points", this.config?.locale, this.hass)}</h3>
                        <ul>${entries.map((assignment) => html`<li>${assignment.title}</li>`)}</ul>
                      `,
                    )}
                </section>
              `
            : nothing}
          ${rewards.length
            ? html`
                <section>
                  <h2>${localize("reward_levels", this.config?.locale, this.hass)}</h2>
                  <ul class="reward-list">
                    ${rewards.map(
                      (reward) => html`
                        <li><strong>${reward.points}p:</strong> ${reward.label}${reward.description ? html` - ${reward.description}` : nothing}</li>
                      `,
                    )}
                  </ul>
                </section>
              `
            : nothing}
        </div>
      </details>
    `;
  }

  private renderButton(button: OverviewButton) {
    const actions = this.actions(button);
    return html`
      <button
        style=${`--button-icon-color: ${this.buttonColor(button.color)}`}
        @pointerdown=${(event: PointerEvent) => this.startHold(event, actions)}
        @pointerup=${(event: PointerEvent) => this.stopHold(event)}
        @pointercancel=${(event: PointerEvent) => this.stopHold(event)}
        @click=${(event: MouseEvent) => this.handleClick(event, actions)}
        @dblclick=${(event: MouseEvent) => this.handleDoubleClick(event, actions)}
      >
        <ha-icon icon=${button.icon}></ha-icon><span>${button.label}</span>
      </button>
    `;
  }

  private buttons(): OverviewButton[] {
    if (this.config?.buttons !== undefined) {
      return this.config.buttons.slice(0, 3);
    }
    const legacyActions = [
      this.config?.daily_action,
      this.config?.history_action,
      this.config?.correction_action,
    ];
    return LEGACY_BUTTONS.flatMap((preset, index) => {
      const tapAction = legacyActions[index];
      return tapAction && tapAction.action !== "none"
        ? [{ ...preset, tap_action: tapAction }]
        : [];
    });
  }

  private isVisible(button: OverviewButton): boolean {
    const visibility = button.visibility;
    const mode = visibility?.mode ?? "all";
    const users = visibility?.users ?? [];
    const user = this.hass?.user;
    if (mode === "all") {
      return true;
    }
    if (mode === "administrators") {
      return user?.is_admin === true;
    }
    if (!user) {
      return mode === "deny-list";
    }
    return mode === "allow-list" ? users.includes(user.id) : !users.includes(user.id);
  }

  private actions(button: OverviewButton) {
    return {
      tap_action: button.tap_action as HaActionConfig | undefined,
      hold_action: button.hold_action as HaActionConfig | undefined,
      double_tap_action: button.double_tap_action as HaActionConfig | undefined,
    };
  }

  private startHold(event: PointerEvent, actions: ReturnType<typeof this.actions>): void {
    if (!actions.hold_action || actions.hold_action.action === "none") {
      return;
    }
    const button = event.currentTarget as HTMLButtonElement;
    const timer = window.setTimeout(() => {
      this.heldButtons.add(button);
      this.holdTimers.delete(button);
      this.dispatchAction(button, actions, true, false);
    }, HOLD_DELAY_MS);
    this.holdTimers.set(button, timer);
  }

  private stopHold(event: PointerEvent): void {
    const button = event.currentTarget as HTMLButtonElement;
    const timer = this.holdTimers.get(button);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      this.holdTimers.delete(button);
    }
  }

  private handleClick(event: MouseEvent, actions: ReturnType<typeof this.actions>): void {
    const button = event.currentTarget as HTMLButtonElement;
    if (this.heldButtons.delete(button)) {
      return;
    }
    if (actions.double_tap_action && actions.double_tap_action.action !== "none") {
      this.clickTimers.set(
        button,
        window.setTimeout(() => this.dispatchAction(button, actions, false, false), DOUBLE_TAP_DELAY_MS),
      );
      return;
    }
    this.dispatchAction(button, actions, false, false);
  }

  private handleDoubleClick(event: MouseEvent, actions: ReturnType<typeof this.actions>): void {
    const button = event.currentTarget as HTMLButtonElement;
    const timer = this.clickTimers.get(button);
    if (timer !== undefined) {
      window.clearTimeout(timer);
      this.clickTimers.delete(button);
    }
    this.dispatchAction(button, actions, false, true);
  }

  private dispatchAction(
    button: HTMLButtonElement,
    actions: ReturnType<typeof this.actions>,
    hold: boolean,
    doubleClick: boolean,
  ): void {
    if (this.hass) {
      handleClick(button, this.hass as unknown as HaHomeAssistant, actions, hold, doubleClick);
    }
  }

  private buttonColor(color: string): string {
    return this.colorValue(color) ?? "var(--state-icon-color)";
  }

  private progressTrackColor(color: string): string {
    return "color-mix(in srgb, " + color + " 22%, var(--card-background-color))";
  }

  private nextReward(points: number, rewards: RewardTier[]): RewardTier | undefined {
    return rewards.find((reward) => reward.points > points);
  }

  private progressColor(points: number, rewards: RewardTier[]): string {
    const reachedReward = [...rewards].reverse().find(
      (reward) => reward.points <= points && this.colorValue(reward.color),
    );
    return this.colorValue(reachedReward?.color) ?? this.colorValue(this.config?.progress_color) ?? "var(--primary-color)";
  }

  private colorValue(color: string | undefined): string | undefined {
    if (!color) {
      return undefined;
    }
    const normalized = color.trim().toLowerCase();
    return HEX_COLOR.test(normalized) ? normalized : COLOR_ALIASES[normalized];
  }

  private finalRewardMessage(rewards: RewardTier[]): string {
    const finalLabel = rewards.at(-1)?.label.trim();
    return finalLabel || localize("completed", this.config?.locale, this.hass);
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
    h2, h3 { margin: 0; }
    h2 { font-size: 16px; }
    h3 { font-size: 14px; margin-top: 16px; }
    .points-row { display: flex; gap: 12px; align-items: center; margin: 18px 0 12px; }
    .points-row > ha-icon { color: var(--state-icon-color); }
    p { margin: 3px 0 0; color: var(--secondary-text-color); font-size: 14px; }
    .progress { height: 6px; background: var(--secondary-background-color); overflow: hidden; }
    .progress span { display: block; height: 100%; transition: width 180ms ease-out, background 180ms ease-out; }
    .button-divider { height: 6px; margin: 26px 0 20px; background: var(--secondary-background-color); border-radius: 3px; }
    .actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px; }
    button { min-height: 72px; padding: 8px; display: grid; place-items: center; gap: 5px; border: 1px solid var(--divider-color); border-radius: 8px; background: transparent; color: var(--primary-text-color); font: inherit; cursor: pointer; }
    button:hover { background: var(--secondary-background-color); }
    button ha-icon { color: var(--button-icon-color, var(--state-icon-color)); }
    button span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }
    .points-rewards { margin-top: 20px; }
    summary { cursor: pointer; }
    summary span { font-size: 20px; font-weight: 600; }
    .rewards-content { margin-top: 16px; padding: 16px; border: 1px solid var(--divider-color); border-radius: 8px; }
    ul { margin: 8px 0 0; padding-left: 24px; }
    li + li { margin-top: 4px; }
    .reward-list { margin-bottom: 0; }
    .rewards-content section + section { margin-top: 20px; }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    [OVERVIEW_CARD_TYPE]: ChoresManagerOverviewCard;
  }
}
