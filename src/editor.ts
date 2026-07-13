import {
  findPersonForChild,
  getChildren,
  getPersonOptions,
} from "./data";
import type {
  DailyCardConfig,
  HomeAssistant,
  OverviewCardConfig,
  RewardTier,
} from "./types";

type EditorConfig = (DailyCardConfig | OverviewCardConfig) & { type?: string };
type EditorKind = "daily" | "overview";

abstract class ChoresManagerCardEditor extends HTMLElement {
  private config?: EditorConfig;
  private hassValue?: HomeAssistant;

  protected abstract readonly kind: EditorKind;

  set hass(hass: HomeAssistant | undefined) {
    this.hassValue = hass;
    this.applyInferredDefaults();
    this.render();
  }

  setConfig(config: EditorConfig): void {
    this.config = { locale: "auto", show_points: true, ...config };
    this.render();
  }

  private applyInferredDefaults(): void {
    if (!this.config || !this.hassValue) {
      return;
    }
    const child = getChildren(this.hassValue).find(
      (item) => item.id === this.config?.child_id,
    );
    if (!child) {
      return;
    }
    const personEntity =
      this.config.person_entity ?? findPersonForChild(this.hassValue, child.name);
    if (this.config.name !== undefined && this.config.person_entity === personEntity) {
      return;
    }
    this.config = { ...this.config, name: this.config.name ?? child.name, person_entity: personEntity };
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this.config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private render(): void {
    if (!this.config) {
      return;
    }

    const children = this.hassValue ? getChildren(this.hassValue) : [];
    const people = this.hassValue ? getPersonOptions(this.hassValue) : [];
    const config = this.config;
    const childName = children.find((child) => child.id === config.child_id)?.name;
    const rewards =
      this.kind === "overview" ? (config as OverviewCardConfig).rewards ?? [] : [];

    this.innerHTML = [
      "<style>",
      ":host{display:block}.editor{display:grid;gap:16px}label,.rewards{display:grid;gap:6px}",
      "span{color:var(--secondary-text-color);font-size:14px}input,select{box-sizing:border-box;width:100%;min-height:40px;padding:0 10px;border:1px solid var(--divider-color);border-radius:4px;background:var(--card-background-color);color:var(--primary-text-color);font:inherit}",
      ".toggle{display:flex;align-items:center;gap:10px}.toggle input{width:auto;min-height:0}.reward{display:grid;grid-template-columns:minmax(72px,.35fr) minmax(0,1fr) 40px;gap:8px;align-items:center}",
      "</style><div class='editor'>",
      this.select("child_id", this.label("child"), children.map((child) => [child.id, child.name]), config.child_id),
      this.input("name", this.label("name"), config.name ?? childName ?? ""),
      this.select("person_entity", this.label("person"), [["", this.label("none")], ...people.map((person) => [person.entityId, person.name])], config.person_entity ?? ""),
      this.select("locale", this.label("locale"), [["auto", this.label("automatic")], ["sv", "Svenska"], ["en", "English"]], config.locale ?? "auto"),
      "<label class='toggle'><input data-field='show_points' type='checkbox'",
      config.show_points !== false ? " checked" : "",
      "><span>", this.label("show_points"), "</span></label>",
      this.kind === "overview"
        ? [
            this.input("goal_points", this.label("goal"), String((config as OverviewCardConfig).goal_points ?? 20), "number"),
            "<div class='rewards'><span>", this.label("rewards"), "</span>",
            ...rewards.map((reward, index) => this.rewardRow(reward, index)),
            "<ha-icon-button data-action='add-reward' label='", this.escape(this.label("add_reward")), "' icon='mdi:plus'></ha-icon-button></div>",
          ].join("")
        : "",
      "</div>",
    ].join("");

    this.querySelectorAll<HTMLInputElement | HTMLSelectElement>("[data-field]").forEach(
      (element) => element.addEventListener("change", this.onFieldChanged),
    );
    this.querySelectorAll<HTMLInputElement>("[data-reward]").forEach(
      (element) => element.addEventListener("change", this.onRewardChanged),
    );
    this.querySelectorAll<HTMLElement>("[data-action]").forEach(
      (element) => element.addEventListener("click", this.onAction),
    );
  }

  private select(
    field: string,
    label: string,
    options: string[][],
    value: string,
  ): string {
    return [
      "<label><span>", this.escape(label), "</span><select data-field='", field, "'>",
      ...options.map(([optionValue, optionLabel]) => [
        "<option value='", this.escape(optionValue), "'",
        optionValue === value ? " selected" : "",
        ">", this.escape(optionLabel), "</option>",
      ].join("")),
      "</select></label>",
    ].join("");
  }

  private input(
    field: string,
    label: string,
    value: string,
    type = "text",
  ): string {
    return [
      "<label><span>", this.escape(label), "</span><input data-field='", field,
      "' type='", type, "' value='", this.escape(value), "'",
      type === "number" ? " min='1'" : "",
      "></label>",
    ].join("");
  }

  private rewardRow(reward: RewardTier, index: number): string {
    return [
      "<div class='reward'><input data-reward='points' data-index='", String(index),
      "' aria-label='", this.escape(this.label("points")), "' type='number' min='1' value='",
      String(reward.points), "'><input data-reward='label' data-index='", String(index),
      "' aria-label='", this.escape(this.label("reward")), "' value='",
      this.escape(reward.label), "'><ha-icon-button data-action='remove-reward' data-index='",
      String(index), "' label='", this.escape(this.label("remove")),
      "' icon='mdi:delete-outline'></ha-icon-button></div>",
    ].join("");
  }

  private onFieldChanged = (event: Event): void => {
    const element = event.currentTarget as HTMLInputElement | HTMLSelectElement;
    const field = element.dataset.field;
    if (!field) {
      return;
    }
    if (field === "child_id") {
      this.changeChild(element.value);
      return;
    }
    if (field === "show_points") {
      this.update({ show_points: (element as HTMLInputElement).checked });
      return;
    }
    if (field === "goal_points") {
      const goal = Number(element.value);
      if (Number.isFinite(goal) && goal > 0) {
        this.update({ goal_points: goal });
      }
      return;
    }
    this.update({ [field]: element.value || undefined });
  };

  private onRewardChanged = (event: Event): void => {
    const element = event.currentTarget as HTMLInputElement;
    const field = element.dataset.reward;
    const index = Number(element.dataset.index);
    const rewards = [...((this.config as OverviewCardConfig).rewards ?? [])];
    const reward = { ...rewards[index] };
    if (field === "points") {
      const points = Number(element.value);
      if (!Number.isFinite(points) || points <= 0) {
        return;
      }
      reward.points = points;
    } else {
      reward.label = element.value;
    }
    rewards[index] = reward;
    this.update({ rewards });
  };

  private onAction = (event: Event): void => {
    const element = event.currentTarget as HTMLElement;
    const action = element.dataset.action;
    const rewards = [...((this.config as OverviewCardConfig).rewards ?? [])];
    if (action === "add-reward") {
      rewards.push({ points: (rewards.at(-1)?.points ?? 0) + 10, label: "" });
    } else if (action === "remove-reward") {
      rewards.splice(Number(element.dataset.index), 1);
    }
    this.update({ rewards });
  };

  private changeChild(childId: string): void {
    const child = this.hassValue
      ? getChildren(this.hassValue).find((item) => item.id === childId)
      : undefined;
    const suggestedPerson =
      this.hassValue && child ? findPersonForChild(this.hassValue, child.name) : undefined;
    this.update({
      child_id: childId,
      name: child?.name,
      person_entity: suggestedPerson ?? this.config?.person_entity,
    });
  }

  private update(update: Partial<EditorConfig>): void {
    if (!this.config) {
      return;
    }
    this.config = { ...this.config, ...update } as EditorConfig;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this.config },
        bubbles: true,
        composed: true,
      }),
    );
    this.render();
  }

  private label(key: string): string {
    const labels = this.hassValue?.language?.toLowerCase().startsWith("sv")
      ? {
          add_reward: "Lägg till belöning", automatic: "Automatiskt", child: "Barn",
          goal: "Målpoäng", locale: "Språk", name: "Visningsnamn", none: "Ingen",
          person: "Person", points: "Poäng", remove: "Ta bort", reward: "Belöning",
          rewards: "Belöningsnivåer", show_points: "Visa poäng",
        }
      : {
          add_reward: "Add reward", automatic: "Automatic", child: "Child",
          goal: "Goal points", locale: "Language", name: "Display name", none: "None",
          person: "Person", points: "Points", remove: "Remove", reward: "Reward",
          rewards: "Reward levels", show_points: "Show points",
        };
    return labels[key as keyof typeof labels];
  }

  private escape(value: string): string {
    return value.replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[character] ?? character);
  }
}

export class ChoresManagerDailyCardEditor extends ChoresManagerCardEditor {
  protected readonly kind = "daily";
}

export class ChoresManagerOverviewCardEditor extends ChoresManagerCardEditor {
  protected readonly kind = "overview";
}

customElements.define("chores-manager-daily-card-editor", ChoresManagerDailyCardEditor);
customElements.define("chores-manager-overview-card-editor", ChoresManagerOverviewCardEditor);
