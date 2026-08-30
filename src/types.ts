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
  completionMode: "independent" | "shared";
  completedByChildId?: string;
  completedByChildName?: string;
  completedManually?: boolean;
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

export type DailyCardConfig = BaseCardConfig;

export interface QuickChoreChildConfig {
  child_id: string;
  person_entity?: string;
  /** Optional display-name customization. The child's backend name is used by default. */
  display_name?: string;
}

export interface QuickChoreSlotConfig {
  chore_id: string;
  /** Optional display-name customization. The chore name is used by default. */
  display_name?: string;
  /** @deprecated Use display_name. */
  label?: string;
  subtitle?: string;
  start_time?: string;
  end_time?: string;
  /** Optional icon for the action button. The chore icon is used by default. */
  icon?: string;
  /** Optional colour for the action-button icon. */
  color?: string;
  /** Editor behavior for the optional action-button icon colour. */
  color_mode?: "automatic" | "custom";
  /** @deprecated Use icon for an explicit action-button icon. */
  manual_icon_override?: string;
  /** @deprecated Use color for an explicit action-button icon colour. */
  manual_icon_color?: string;
  /** @deprecated Use icon for an explicit action-button icon. */
  icon_override?: string;
}

export interface QuickChoreCardConfig {
  title?: string;
  locale?: "auto" | "en" | "sv";
  show_border?: boolean;
  status_layout?: "rows" | "columns";
  /** Overall spacing for the card layout. Compact preserves the original Quick Chore layout. */
  density?: "compact" | "normal" | "comfortable";
  shortcut_mode?: "first_incomplete" | "time_window";
  /** Size of the portrait buttons in the shortcut section. */
  shortcut_person_size?: "small" | "medium" | "large";
  shortcut_label?: string;
  manual_label?: string;
  show_manual_actions?: boolean;
  show_reset_action?: boolean;
  children: QuickChoreChildConfig[];
  chores: QuickChoreSlotConfig[];
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
  adjustment_visibility?: ButtonVisibility;
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
