import { LitElement } from "lit";
import { property } from "lit/decorators.js";

import type { HomeAssistant } from "./types";

export abstract class ChoresManagerBaseCard extends LitElement {
  @property({ attribute: false }) hass?: HomeAssistant;
}
