
import { Category, Intensity, Mood, Page } from './types';

export const CATEGORIES: Category[] = ['Work', 'Personal', 'Health', 'Social', 'Rest', 'Focus'];

// Mapping categories to the 5 Life Pillars
export const PILLARS = {
  HEALTH: { label: 'Health', categories: ['Health'], color: '#10b981', icon: '🌿' },
  CAREER: { label: 'Career / Creation', categories: ['Work', 'Focus'], color: '#3b82f6', icon: '🚀' },
  RELATIONSHIP: { label: 'Relationship', categories: ['Social'], color: '#f43f5e', icon: '❤️' },
  GROWTH: { label: 'Growth', categories: ['Personal'], color: '#8b5cf6', icon: '📖' },
  REST: { label: 'Rest & Fun', categories: ['Rest'], color: '#f59e0b', icon: '☕' },
};

export const CATEGORY_COLORS: Record<Category, string> = {
  Work: '#dbeafe',
  Personal: '#f3e8ff',
  Health: '#d1fae5',
  Social: '#ffe4e6',
  Rest: '#fef3c7',
  Focus: '#f1f3f5'
};

export const INTENSITIES: Intensity[] = ['low', 'medium', 'high'];
export const MOODS: Mood[] = ['Great', 'Good', 'Neutral', 'Tired', 'Low'];

export const INITIAL_PAGES: Page[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: '🏠',
    type: 'system',
    blocks: []
  },
  { id: 'habits', title: 'Habits', icon: '✅', type: 'system', blocks: [] },
  { id: 'money', title: 'Money Tracker', icon: '💰', type: 'system', blocks: [] },
  { id: 'calendar', title: 'Calendar', icon: '📅', type: 'system', blocks: [] },
  { id: 'focus', title: 'Focus Board', icon: '🎯', type: 'system', blocks: [] },
  { id: 'insights', title: 'Insights', icon: '✨', type: 'system', blocks: [] },
  { id: 'settings', title: 'Settings', icon: '⚙️', type: 'system', blocks: [] }
];
