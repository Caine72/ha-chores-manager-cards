export interface HassEntity {
  state: string;
  attributes: Record<string, unknown>;
  last_updated?: string;
}

export interface HomeAssistantUser {
  id: string;
  is_admin?: boolean;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  language?: string;
  locale?: {
    language: string;
    number_format: string;
    time_format: string;
    date_format: string;
    first_weekday: string;
    time_zone: string;
  };
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

export interface WeeklyPointsPeriod {
  start: string;
  end: string;
  points: number;
}

export interface WeeklyPointsResponse {
  child_id: string;
  child_name: string;
  person_entity_id?: string;
  points_entity_id: string;
  can_adjust: boolean;
  current_week: WeeklyPointsPeriod;
  previous_week: WeeklyPointsPeriod;
}

export interface WeeklyPointsAdjustmentResponse {
  child_id: string;
  points_entity_id: string;
  adjustment_id: string | null;
  requested_amount: number;
  applied_amount: number;
  current_points: number;
}

export interface InventoryChild {
  child_id: string;
  name: string;
  person_entity_id?: string;
  active: boolean;
  points_entity_id: string | null;
}

export interface InventoryChore {
  chore_id: string;
  title: string;
  category: string;
  points: number;
  icon: string;
  active: boolean;
  sort_order: number;
}

export interface InventoryAssignment {
  assignment_id: string;
  child_id: string;
  chore_id: string;
  active: boolean;
  switch_expected: boolean;
  switch_entity_id: string | null;
}

export interface InventoryResponse {
  children: InventoryChild[];
  chores: InventoryChore[];
  assignments: InventoryAssignment[];
  week: { start: string; end: string };
}

export interface CompletionSnapshot {
  completion_id: string;
  assignment_id: string;
  assignment_exists: boolean;
  child_id: string;
  chore_id: string;
  local_date: string;
  completed_at: string;
  child_name: string;
  chore_title: string;
  category: string;
  points: number;
}

export interface CurrentWeekCompletionsResponse {
  window: { start: string; end: string };
  completions: CompletionSnapshot[];
}

export interface CurrentWeekHistoryResponse extends CurrentWeekCompletionsResponse {
  child_id: string;
  child_name: string;
  person_entity_id?: string;
  points_entity_id: string;
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
  show_border?: boolean;
}

export interface DailyCardConfig extends BaseCardConfig {
  title?: string;
}

export interface HistoryCardConfig extends BaseCardConfig {
  child_id: string;
}

export interface OverviewCardConfig extends BaseCardConfig {
  show_name?: boolean;
  person_position?: "left" | "center" | "right";
  person_size?: "small" | "medium" | "large";
  goal_points?: number;
  progress_color?: string;
  show_previous_week?: boolean;
  show_adjustments?: boolean;
  rewards?: RewardTier[];
  buttons?: OverviewButton[];
  daily_action?: ActionConfig;
  history_action?: ActionConfig;
  correction_action?: ActionConfig;
}

export interface CorrectionCardConfig {
  child_id: string;
  name?: string;
  person_entity?: string;
  locale?: "auto" | "en" | "sv";
  show_header?: boolean;
  show_border?: boolean;
}
