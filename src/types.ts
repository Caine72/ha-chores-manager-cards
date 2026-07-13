export interface HassEntity {
  state: string;
  attributes: Record<string, unknown>;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  language?: string;
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
  ) => Promise<unknown>;
}

export interface ChoreAssignment {
  assignmentId: string;
  entityId: string;
  childId: string;
  title: string;
  category: string;
  points: number;
  icon: string;
  sortOrder: number;
  completed: boolean;
}

export interface RewardTier {
  points: number;
  label: string;
  description?: string;
}

export interface ActionConfig {
  action?: "more-info" | "navigate" | "url" | "toggle" | "perform-action" | "none";
  navigation_path?: string;
  url_path?: string;
  entity?: string;
  perform_action?: string;
  data?: Record<string, unknown>;
}

export interface BaseCardConfig {
  child_id: string;
  name?: string;
  person_entity?: string;
  locale?: "auto" | "en" | "sv";
  show_points?: boolean;
}

export interface DailyCardConfig extends BaseCardConfig {
  title?: string;
}

export interface OverviewCardConfig extends BaseCardConfig {
  goal_points?: number;
  rewards?: RewardTier[];
  daily_action?: ActionConfig;
  history_action?: ActionConfig;
  correction_action?: ActionConfig;
}
