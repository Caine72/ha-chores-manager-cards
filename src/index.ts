import "./daily-card";
import "./overview-card";

import { CARD_VERSION, DAILY_CARD_TYPE, OVERVIEW_CARD_TYPE } from "./const";

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
    }>;
  }
}

console.info(
  `%c CHORES MANAGER CARDS %c ${CARD_VERSION} `,
  "color: white; background: #1677b8; font-weight: 600;",
  "color: white; background: #444;",
);

window.customCards = window.customCards ?? [];
window.customCards.push(
  {
    type: DAILY_CARD_TYPE,
    name: "Chores Manager Daily",
    description: "Child-facing daily chore checklist.",
    preview: false,
  },
  {
    type: OVERVIEW_CARD_TYPE,
    name: "Chores Manager Overview",
    description: "Child points and reward overview.",
    preview: false,
  },
);
