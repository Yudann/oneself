
export type Intensity = 'low' | 'medium' | 'high';
export type Category = 'Work' | 'Personal' | 'Health' | 'Social' | 'Rest' | 'Focus';
export type Mood = 'Great' | 'Good' | 'Neutral' | 'Tired' | 'Low';

export interface Activity {
  id: string;
  name: string;
  category: Category;
  color: string;
  intensity: Intensity;
  duration: number; // in minutes
  mood: Mood;
  date: string; // ISO format
  tags: string[];
}

export interface FocusItem {
  id: string;
  activityId: string;
  column: 'primary' | 'secondary' | 'rest';
  date: string;
  completed: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  tagline: string;
  avatarColor: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  weekStart: 'monday' | 'sunday';
  language: 'en' | 'id';
  dashboardShowHeatmap: boolean;
  dashboardShowReflection: boolean;
}

export interface EngineSettings {
  energyGuardian: boolean;
  restEncourager: boolean;
  highIntensityLimit: number;
}

export type BlockType =
  | 'text'
  | 'activity_log'
  | 'heatmap'
  | 'insight'
  | 'calendar'
  | 'focus_board'
  | 'heading'
  | 'todo_list'
  | 'bullet_list'
  | 'numbered_list'
  | 'toggle'
  | 'quote'
  | 'divider'
  | 'callout'
  | 'table'
  | 'mood_log';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  config?: Record<string, any>;
  textColor?: string;
  backgroundColor?: string;
}

export interface Page {
  id: string;
  title: string;
  icon: string;
  type: 'system' | 'private';
  parentId?: string;
  blocks: Block[];
  contextRules?: {
    category?: Category;
    tags?: string[];
  };
}

export interface AppState {
  activities: Activity[];
  focusItems: FocusItem[];
  pages: Page[];
  currentPageId: string;
  sidebarOpen: boolean;
  userProfile: UserProfile;
  userPreferences: UserPreferences;
  engineSettings: EngineSettings;
  isAuthenticated: boolean;
}

export interface Rule {
  id: string;
  description: string;
  severity: 'info' | 'warning';
}
