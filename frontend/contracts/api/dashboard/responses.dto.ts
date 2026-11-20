import type { TaskPriority } from '../../common/enums.js';
import type { UserId } from '../../common/primitives.js';

export interface DashboardAssigneeCountDto {
  assignee_id: UserId;
  username: string;
  count: number;
}

/** Plain aggregate response returned by DashboardView (not a DRF serializer). */
export interface DashboardResponseDto {
  total_workspaces: number;
  total_projects: number;
  total_tasks: number;
  todo: number;
  in_progress: number;
  in_review: number;
  completed: number;
  cancelled: number;
  overdue: number;
  /** Only priorities found in the filtered task queryset are included. */
  tasks_by_priority: Partial<Record<TaskPriority, number>>;
  tasks_by_assignee: DashboardAssigneeCountDto[];
}
