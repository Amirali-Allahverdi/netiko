import type { UserId, UUID } from "../common/primitives"

const segment = (value: string | number) => encodeURIComponent(String(value))

/** Paths verified from backend/config/urls.py and each app's URL module. */
export const API_ROUTES = {
  auth: {
    obtainToken: "/api/auth/token/",
    refreshToken: "/api/auth/token/refresh/",
  },
  accounts: {
    register: "/api/accounts/register/",
    me: "/api/accounts/me/",
    changePassword: "/api/accounts/change-password/",
  },
  workspaces: {
    list: "/api/workspaces/",
    detail: (workspaceId: UUID) => `/api/workspaces/${segment(workspaceId)}/`,
    members: (workspaceId: UUID) =>
      `/api/workspaces/${segment(workspaceId)}/members/`,
    member: (workspaceId: UUID, userId: UserId) =>
      `/api/workspaces/${segment(workspaceId)}/members/${segment(userId)}/`,
  },
  memberships: {
    list: "/api/memberships/",
    detail: (membershipId: UUID) =>
      `/api/memberships/${segment(membershipId)}/`,
  },
  teams: {
    list: "/api/teams/",
    detail: (teamId: UUID) => `/api/teams/${segment(teamId)}/`,
    members: (teamId: UUID) => `/api/teams/${segment(teamId)}/members/`,
    member: (teamId: UUID, userId: UserId) =>
      `/api/teams/${segment(teamId)}/members/${segment(userId)}/`,
  },
  projects: {
    list: "/api/projects/",
    detail: (projectId: UUID) => `/api/projects/${segment(projectId)}/`,
  },
  labels: {
    list: "/api/labels/",
    detail: (labelId: UUID) => `/api/labels/${segment(labelId)}/`,
  },
  tasks: {
    list: "/api/tasks/",
    detail: (taskId: UUID) => `/api/tasks/${segment(taskId)}/`,
    status: (taskId: UUID) => `/api/tasks/${segment(taskId)}/status/`,
    assign: (taskId: UUID) => `/api/tasks/${segment(taskId)}/assign/`,
  },
  assignmentRules: {
    list: "/api/assignment-rules/",
    detail: (ruleId: UUID) => `/api/assignment-rules/${segment(ruleId)}/`,
  },
  auditEvents: {
    list: "/api/audit-events/",
    detail: (eventId: UUID) => `/api/audit-events/${segment(eventId)}/`,
  },
  dashboard: {
    summary: "/api/dashboard/",
  },
} as const
