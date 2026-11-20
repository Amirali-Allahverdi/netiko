import type { TaskPriority, TaskStatus } from '../../common/enums.js';
import type { PaginationQueryDto } from '../../common/pagination.dto.js';
import type { ISODate, UserId, UUID } from '../../common/primitives.js';

export interface CreateTaskRequestDto {
  project: UUID;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee?: UserId | null;
  /** Write-only alias for the model's many-to-many `labels` relation. */
  label_ids?: UUID[];
  due_date?: ISODate | null;
}

/** PUT /api/tasks/{id}/ — project and title are required. */
export interface UpdateTaskRequestDto extends CreateTaskRequestDto {}

/** PATCH /api/tasks/{id}/. */
export interface PatchTaskRequestDto {
  project?: UUID;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee?: UserId | null;
  label_ids?: UUID[];
  due_date?: ISODate | null;
}

/** PATCH /api/tasks/{taskId}/status/. */
export interface SetTaskStatusRequestDto {
  status: TaskStatus;
}

/** PATCH /api/tasks/{taskId}/assign/. Key must be present; null clears assignment. */
export interface AssignTaskRequestDto {
  assignee: UserId | null;
}

export interface TaskQueryDto extends PaginationQueryDto {
  assignee?: UserId;
  status?: TaskStatus;
  priority?: TaskPriority;
  project?: UUID;
  team?: UUID;
  label?: UUID;
  creator?: UserId;
  due_date?: ISODate;
  due_before?: ISODate;
  due_after?: ISODate;
  unassigned?: boolean;
  search?: string;
  ordering?: 'created_at' | '-created_at' | 'updated_at' | '-updated_at' | 'due_date' | '-due_date' | 'priority' | '-priority';
}
