import type { ChoreChild } from "./data";

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

interface InventoryResponse {
  children: Array<{ child_id: string; name: string; active: boolean }>;
}

abstract class ChoresManagerCardEditor extends HTMLElement {
  private config?: EditorConfig;
  private hassValue?: HomeAssistant;
  private inventoryChildren?: ChoreChild[];
  private inventoryConnection?: HomeAssistant["connection"];

  protected abstract readonly kind: EditorKind;

  set hass(hass: HomeAssistant | undefined) {
    this.hassValue = hass;
    this.loadInventory();
    this.applyInferredDefaults();
    this.render();
  }

  setConfig(config: EditorConfig): void {
    this.config = {
      locale: "auto",
      person_position: "left",
      person_size: "medium",
      show_header: true,
      show_name: true,
      show_person: true,
      show_points: true,
      ...config,
    };
    this.applyInferredDefaults();
    this.render();
  }

  private loadInventory(): void {
    const connection = this.hassValue?.connection;
    if (!connection || connection === this.inventoryConnection) {
      return;
    }

    this.inventoryConnection = connection;
    void connection
      .sendMessagePromise<InventoryResponse>({ type: "chores_manager/inventory" })
      .then((inventory) => {
        this.inventoryChildren = inventory.children
          .filter((child) => child.active)
          .map((child) => ({ id: child.child_id, name: child.name }))
          .sort((left, right) => left.name.localeCompare(right.name));
        this.applyInferredDefaults();
        this.render();
      })
      .catch(() => {
        this.inventoryChildren = undefined;
        this.render();
      });
  }

  private childOptions(): ChoreChild[] {
    return this.inventoryChildren ?? (this.hassValue ? getChildren(this.hassValue) : []);
  }

  private applyInferredDefaults(): void {
    if (!this.config || !this.hassValue) {
      return;
    }

    const child = this.childOptions().find((item) => item.id === this.config?.child_id);
    if (!child) {
      return;
    }

    const personEntity =
      this.config.person_entity ?? findPersonForChild(this.hassValue, child.name);
    if (this.config.name !== undefined && this.config.person_entity === personEntity) {
      return;
    }

    this.config = {
      ...this.config,
      name: this.config.name ?? child.name,
      person_entity: personEntity,
    };
    this.emitConfigChanged();
  }

  private render(): void {
    if (!this.config) {
      return;
    }

    const config = this.config;
    const children = this.childOptions();
    const people = this.hassValue ? getPersonOptions(this.hassValue) : [];
    const childName = children.find((child) => child.id === config.child_id)?.name;
    const rewards =
      this.kind === "overview" ? (config as OverviewCardConfig).rewards ?? [] : [];

    this.innerHTML = [
      "<style>",
      ":host{display:block}.editor{display:grid;gap:16px}label,.rewards{display:grid;gap:6px}",
      "span{color:var(--secondary-text-color);font-size:14px}input,select{box-sizing:border-box;width:100%;min-height:40px;padding:0 10px;border:1px solid var(--divider-color);border-radius:4px;background:var(--card-background-color);color:var(--primary-text-color);font:inherit}",
      ".toggle{display:flex;align-items:center;gap:10px}.toggle input{width:auto;min-height:0}.reward{display:grid;grid-template-columns:minmax(72px,.35fr) minmax(0,1fr) 40px;gap:8px;align-items:center}",
      ".icon-button{width:40px;height:40px;border:1px solid var(--divider-color);border-radius:50%;background:transparent;color:var(--primary-text-color);font-size:24px;line-height:1;cursor:pointer}.icon-button:hover{background:var(--secondary-background-color)}",
      "</style><div class='editor'>",
      this.select(
        "child_id",
        this.label("child"),
        children.map((child) => [child.id, child.name]),
        config.child_id,
      ),
      this.input("name", this.label("name"), config.name ?? childName ?? ""),
      this.select(
        "person_entity",
        this.label("person"),
        [["", this.label("none")], ...people.map((person) => [person.entityId, person.name])],
        config.person_entity ?? "",
      ),
      this.select(
        "locale",
        this.label("locale"),
        [["auto", this.label("automatic")], ["sv", "Svenska"], ["en", "English"]],
        config.locale ?? "auto",
      ),
      this.toggle("show_points", this.label("show_points"), config.show_points !== false),
      this.kind === "daily"
        ? [
            this.toggle("show_header", this.label("show_header"), config.show_header !== false),
            this.toggle("show_person", this.label("show_person"), config.show_person !== false),
          ].join("")
        : [
            this.toggle("show_name", this.label("show_name"), (config as OverviewCardConfig).show_name !== false),
            this.toggle("show_person", this.label("show_person"), config.show_person !== false),
            this.select(
              "person_position",
              this.label("person_position"),
              [["left", this.label("left")], ["center", this.label("center")], ["right", this.label("right")]],
              (config as OverviewCardConfig).person_position ?? "left",
            ),
            this.select(
              "person_size",
              this.label("person_size"),
              [["small", this.label("small")], ["medium", this.label("medium")], ["large", this.label("large")]],
              (config as OverviewCardConfig).person_size ?? "medium",
            ),
            "<div class='rewards'><span>", this.label("rewards"), "</span>",
            ...rewards.map((reward, index) => this.rewardRow(reward, index)),
            "<button class='icon-button' data-action='add-reward' title='",
            this.escape(this.label("add_reward")),
            "' aria-label='", this.escape(this.label("add_reward")), "'>+</button></div>",
          ].join(""),
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

  private toggle(field: string, label: string, checked: boolean): string {
    return [
      "<label class='toggle'><input data-field='", field, "' type='checkbox'",
      checked ? " checked" : "",
      "><span>", this.escape(label), "</span></label>",
    ].join("");
  }

  private select(
    field: string,
    label: string,
    options: string[][],
    value: string,
  ): string {
    const selectedOptions = options.length ? options : [[value, value]];
    return [
      "<label><span>", this.escape(label), "</span><select data-field='", field, "'>",
      ...selectedOptions.map(([optionValue, optionLabel]) => [
        "<option value='", this.escape(optionValue), "'",
        optionValue === value ? " selected" : "",
        ">", this.escape(optionLabel), "</option>",
      ].join("")),
      "</select></label>",
    ].join("");
  }

  private input(field: string, label: string, value: string): string {
    return [
      "<label><span>", this.escape(label), "</span><input data-field='", field,
      "' value='", this.escape(value), "'></label>",
    ].join("");
  }

  private rewardRow(reward: RewardTier, index: number): string {
    return [
      "<div class='reward'><input data-reward='points' data-index='", String(index),
      "' aria-label='", this.escape(this.label("points")), "' type='number' min='1' value='",
      String(reward.points), "'><input data-reward='label' data-index='", String(index),
      "' aria-label='", this.escape(this.label("reward")), "' value='",
      this.escape(reward.label), "'><button class='icon-button' data-action='remove-reward' data-index='",
      String(index), "' title='", this.escape(this.label("remove")), "' aria-label='",
      this.escape(this.label("remove")), "'>−</button></div>",
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
    if (field.startsWith("show_")) {
      this.update({ [field]: (element as HTMLInputElement).checked });
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
    const rewards = [...((this.config as OverviewCardConfig).rewards ?? [])];
    if (element.dataset.action === "add-reward") {
      rewards.push({ points: (rewards.at(-1)?.points ?? 0) + 10, label: "" });
    } else if (element.dataset.action === "remove-reward") {
      rewards.splice(Number(element.dataset.index), 1);
    }
    this.update({ rewards });
  };

  private changeChild(childId: string): void {
    const child = this.childOptions().find((item) => item.id === childId);
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
    this.emitConfigChanged();
    this.render();
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

  private label(key: string): string {
    const labels = this.hassValue?.language?.toLowerCase().startsWith("sv")
      ? {
          add_reward: "Lägg till belöning", automatic: "Automatiskt", center: "Centrerad",
          child: "Barn", left: "Vänster", locale: "Språk", medium: "Mellan",
          name: "Visningsnamn", none: "Ingen", person: "Person", person_position: "Bildposition",
          person_size: "Bildstorlek", points: "Poäng", remove: "Ta bort", reward: "Belöning",
          rewards: "Belöningsnivåer", right: "Höger", show_header: "Visa sidhuvud",
          show_name: "Visa namn", show_person: "Visa bild", show_points: "Visa poäng",
          small: "Liten", large: "Stor",
        }
      : {
          add_reward: "Add reward", automatic: "Automatic", center: "Center",
          child: "Child", left: "Left", locale: "Language", medium: "Medium",
          name: "Display name", none: "None", person: "Person", person_position: "Picture position",
          person_size: "Picture size", points: "Points", remove: "Remove", reward: "Reward",
          rewards: "Reward levels", right: "Right", show_header: "Show header",
          show_name: "Show name", show_person: "Show picture", show_points: "Show points",
          small: "Small", large: "Large",
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
