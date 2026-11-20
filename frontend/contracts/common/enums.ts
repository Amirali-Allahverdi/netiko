export const WORKSPACE_ROLES = ['admin', 'member'] as const;
export type WorkspaceRole = (typeof WORKSPACE_ROLES)[number];

export const TEAM_ROLES = ['lead', 'member'] as const;
export type TeamRole = (typeof TEAM_ROLES)[number];

export const PROJECT_STATUSES = ['active', 'archived', 'completed'] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const TASK_STATUSES = ['todo', 'in_progress', 'in_review', 'done', 'cancelled'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export const ASSIGNMENT_STRATEGIES = [
  'label_based',
  'default_assignee',
  'least_loaded',
  'round_robin',
] as const;
export type AssignmentStrategy = (typeof ASSIGNMENT_STRATEGIES)[number];

export const AUDIT_ACTIONS = [
  'create',
  'update',
  'delete',
  'assign',
  'status_change',
  'member_add',
  'member_remove',
  'role_change',
] as const;
export type AuditAction = (typeof AUDIT_ACTIONS)[number];
