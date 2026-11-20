import { z } from 'zod';
import { TASK_PRIORITIES } from '../../common/enums.js';
import { UUIDSchema, UserIdSchema } from '../../common/schemas.js';

export const DashboardQuerySchema = z.object({ workspace: UUIDSchema.optional() });
export const DashboardAssigneeCountSchema = z.object({
  assignee_id: UserIdSchema,
  username: z.string(),
  count: z.number().int().nonnegative(),
});
export const DashboardResponseSchema = z.object({
  total_workspaces: z.number().int().nonnegative(),
  total_projects: z.number().int().nonnegative(),
  total_tasks: z.number().int().nonnegative(),
  todo: z.number().int().nonnegative(),
  in_progress: z.number().int().nonnegative(),
  in_review: z.number().int().nonnegative(),
  completed: z.number().int().nonnegative(),
  cancelled: z.number().int().nonnegative(),
  overdue: z.number().int().nonnegative(),
  tasks_by_priority: z.record(z.enum(TASK_PRIORITIES), z.number().int().nonnegative()),
  tasks_by_assignee: z.array(DashboardAssigneeCountSchema),
});
