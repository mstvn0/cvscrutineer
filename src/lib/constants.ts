export const RESUME_MAX_LENGTH = 9500;

export const DASHBOARD_TABS = [
  { id: 'knockouts', label: 'Knockout Filters' },
  { id: 'drift', label: 'Vector Drift Map' },
  { id: 'recruiter', label: 'Recruiter Search Test' },
] as const;

export type DashboardTabId = (typeof DASHBOARD_TABS)[number]['id'];
