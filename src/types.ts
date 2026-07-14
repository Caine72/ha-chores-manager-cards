export interface HassEntity {
  state: string;
  attributes: Record<string, unknown>;
}

export interface HomeAssistantUser {
  id: string;
  is_admin?: boolean;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  language?: string;
  user?: HomeAssistantUser;
  connection?: {
    sendMessagePromise: <T>(message: Record<string, unknown>) => Promise<T>;
  };
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
  color?: string;
}

export interface ActionConfig {
  action?: "more-info" | "navigate" | "url" | "toggle" | "perform-action" | "call-service" | "assist" | "none";
  navigation_path?: string;
  url_path?: string;
  entity?: string;
  perform_action?: string;
  service?: string;
  data?: Record<string, unknown>;
  target?: Record<string, unknown>;
  confirmation?: Record<string, unknown>;
  pipeline_id?: string;
  start_listening?: boolean;
}

export type ButtonVisibilityMode =
  | "all"
  | "administrators"
  | "allow-list"
  | "deny-list";

export interface ButtonVisibility {
  mode?: ButtonVisibilityMode;
  users?: string[];
}

export interface OverviewButton {
  label: string;
  icon: string;
  color: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
  visibility?: ButtonVisibility;
}

export interface BaseCardConfig {
  child_id?: string;
  weekly_points_entity?: string;
  child_entity?: string;
  name?: string;
  person_entity?: string;
  locale?: "auto" | "en" | "sv";
  show_points?: boolean;
  show_header?: boolean;
  show_person?: boolean;
}

export interface DailyCardConfig extends BaseCardConfig {
  title?: string;
}

export interface OverviewCardConfig extends BaseCardConfig {
  show_name?: boolean;
  person_position?: "left" | "center" | "right";
  person_size?: "small" | "medium" | "large";
  goal_points?: number;
  progress_color?: string;
  rewards?: RewardTier[];
  buttons?: OverviewButton[];
  daily_action?: ActionConfig;
  history_action?: ActionConfig;
  correction_action?: ActionConfig;
}
