import { LitElement, type PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import type { HomeAssistant } from "./types";

export abstract class ChoresManagerBaseCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;

  protected abstract hassUpdateKey(
    hass: HomeAssistant,
  ): readonly unknown[] | undefined;

  protected shouldUpdate(changedProperties: PropertyValues<this>): boolean {
    if (!changedProperties.has("hass") || changedProperties.size !== 1) {
      return true;
    }

    const previousHass = changedProperties.get("hass") as HomeAssistant | undefined;
    if (!previousHass || !this.hass) {
      return true;
    }

    const previousKey = this.hassUpdateKey(previousHass);
    const nextKey = this.hassUpdateKey(this.hass);
    if (!previousKey || !nextKey || previousKey.length !== nextKey.length) {
      return true;
    }
    return previousKey.some((value, index) => !Object.is(value, nextKey[index]));
  }
}
