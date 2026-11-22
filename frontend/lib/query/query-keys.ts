/**
 * Query key conventions:
 * - Every key is an immutable tuple.
 * - Put the resource name first for predictable prefix invalidation.
 * - Put filters/params in the key; never serialize them manually.
 * - Keep identifiers and filters in their original typed form.
 */
export const queryKeys = {
  all: ['netiko'] as const,

  auth: {
    all: ['netiko', 'auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },

  accounts: {
    all: ['netiko', 'accounts'] as const,
    me: () => [...queryKeys.accounts.all, 'me'] as const,
  },

  memberships: {
    all: ['netiko', 'memberships'] as const,
    lists: () => [...queryKeys.memberships.all, 'list'] as const,
    list: <TFilter extends object>(filters: TFilter) =>
      [...queryKeys.memberships.lists(), filters] as const,
    details: () => [...queryKeys.memberships.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.memberships.details(), id] as const,
  },

  workspaces: {
    all: ['netiko', 'workspaces'] as const,
    lists: () => [...queryKeys.workspaces.all, 'list'] as const,
    list: <TFilter extends object>(filters: TFilter) =>
      [...queryKeys.workspaces.lists(), filters] as const,
    details: () => [...queryKeys.workspaces.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.workspaces.details(), id] as const,
  },

  teams: {
    all: ['netiko', 'teams'] as const,
    lists: () => [...queryKeys.teams.all, 'list'] as const,
    list: <TFilter extends object>(filters: TFilter) =>
      [...queryKeys.teams.lists(), filters] as const,
    details: () => [...queryKeys.teams.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.teams.details(), id] as const,
  },

  projects: {
    all: ['netiko', 'projects'] as const,
    lists: () => [...queryKeys.projects.all, 'list'] as const,
    list: <TFilter extends object>(filters: TFilter) =>
      [...queryKeys.projects.lists(), filters] as const,
    details: () => [...queryKeys.projects.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.projects.details(), id] as const,
  },

  tasks: {
    all: ['netiko', 'tasks'] as const,
    lists: () => [...queryKeys.tasks.all, 'list'] as const,
    list: <TFilter extends object>(filters: TFilter) =>
      [...queryKeys.tasks.lists(), filters] as const,
    details: () => [...queryKeys.tasks.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.tasks.details(), id] as const,
  },

  labels: {
    all: ['netiko', 'labels'] as const,
    lists: () => [...queryKeys.labels.all, 'list'] as const,
    list: <TFilter extends object>(filters: TFilter) =>
      [...queryKeys.labels.lists(), filters] as const,
    details: () => [...queryKeys.labels.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.labels.details(), id] as const,
  },

  assignmentRules: {
    all: ['netiko', 'assignment-rules'] as const,
    lists: () => [...queryKeys.assignmentRules.all, 'list'] as const,
    list: <TFilter extends object>(filters: TFilter) =>
      [...queryKeys.assignmentRules.lists(), filters] as const,
    details: () => [...queryKeys.assignmentRules.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.assignmentRules.details(), id] as const,
  },

  dashboard: {
    all: ['netiko', 'dashboard'] as const,
    overview: <TFilter extends object>(filters: TFilter) =>
      [...queryKeys.dashboard.all, 'overview', filters] as const,
  },

  audit: {
    all: ['netiko', 'audit'] as const,
    lists: () => [...queryKeys.audit.all, 'list'] as const,
    list: <TFilter extends object>(filters: TFilter) =>
      [...queryKeys.audit.lists(), filters] as const,
  },
} as const;
