import type {
  AssignmentStrategy,
  AuditAction,
  ProjectStatus,
  TaskPriority,
  TaskStatus,
  TeamRole,
  WorkspaceRole,
} from "../common/enums"
import type {
  ISODate,
  ISODateTime,
  JsonObject,
  UserId,
  UUID,
} from "../common/primitives"

/** Domain layer uses camelCase and is independent from DRF wire naming. */
export interface UserEntity {
  id: UserId
  username: string
  email: string
  firstName: string
  lastName: string
  dateJoined: ISODateTime
}

export interface WorkspaceEntity {
  id: UUID
  name: string
  slug: string
  ownerId: UserId
  memberCount: number
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

export interface WorkspaceMembershipEntity {
  id: UUID
  workspaceId: UUID
  userId: UserId
  username: string
  role: WorkspaceRole
  createdAt: ISODateTime
}

export interface TeamEntity {
  id: UUID
  workspaceId: UUID
  name: string
  description: string
  memberCount: number
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

export interface TeamMembershipEntity {
  id: UUID
  teamId: UUID
  userId: UserId
  username: string
  role: TeamRole
  createdAt: ISODateTime
}

export interface ProjectEntity {
  id: UUID
  teamId: UUID
  teamName: string
  name: string
  description: string
  status: ProjectStatus
  createdById: UserId | null
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

export interface ProjectSummaryEntity {
  id: UUID
  teamId: UUID
  teamName: string
  name: string
  status: ProjectStatus
  taskCount: number
  createdAt: ISODateTime
}

export interface LabelEntity {
  id: UUID
  workspaceId: UUID
  name: string
  color: string
  createdAt: ISODateTime
}

export interface TaskEntity {
  id: UUID
  projectId: UUID
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId: UserId | null
  createdById: UserId | null
  labels: LabelEntity[]
  commentCount: number
  dueDate: ISODate | null
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

export interface TaskSummaryEntity {
  id: UUID
  projectId: UUID
  projectName: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId: UserId | null
  assigneeUsername: string | null
  labelNames: string[]
  dueDate: ISODate | null
  createdAt: ISODateTime
}

export interface AssignmentRuleEntity {
  id: UUID
  projectId: UUID
  strategy: AssignmentStrategy
  labelId: UUID | null
  targetUserId: UserId | null
  isActive: boolean
  priorityOrder: number
  createdAt: ISODateTime
}

/** Model-level shape only. The supplied backend does not expose a Comment API yet. */
export interface CommentEntity {
  id: UUID
  taskId: UUID
  authorId: UserId
  body: string
  createdAt: ISODateTime
  updatedAt: ISODateTime
}

export interface AuditEventEntity {
  id: UUID
  workspaceId: UUID
  actorId: UserId | null
  actorUsername: string | null
  action: AuditAction
  targetType: string
  targetId: string
  description: string
  metadata: JsonObject
  createdAt: ISODateTime
}

export interface DashboardEntity {
  totalWorkspaces: number
  totalProjects: number
  totalTasks: number
  taskCounts: {
    todo: number
    inProgress: number
    inReview: number
    completed: number
    cancelled: number
    overdue: number
  }
  tasksByPriority: Partial<Record<TaskPriority, number>>
  tasksByAssignee: Array<{
    assigneeId: UserId
    username: string
    count: number
  }>
}
