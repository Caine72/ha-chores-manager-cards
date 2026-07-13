import { LitElement } from "lit";

import type { HomeAssistant } from "./types";

export abstract class ChoresManagerBaseCard extends LitElement {
  hass?: HomeAssistant;
}
