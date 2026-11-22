import { z } from "zod"
import {
  ISODateSchema,
  ISODateTimeSchema,
  TaskPrioritySchema,
  TaskStatusSchema,
  UUIDSchema,
  UserIdSchema,
  BooleanQuerySchema,
  paginationQuerySchema,
  paginatedResponseSchema,
} from "../../common/schemas"
import { LabelResponseSchema } from "../labels/schemas"

export const CreateTaskRequestSchema = z.object({
  project: UUIDSchema,
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  status: TaskStatusSchema.optional(),
  priority: TaskPrioritySchema.optional(),
  assignee: UserIdSchema.nullable().optional(),
  label_ids: z.array(UUIDSchema).optional(),
  due_date: ISODateSchema.nullable().optional(),
})
export const UpdateTaskRequestSchema = CreateTaskRequestSchema
export const PatchTaskRequestSchema = CreateTaskRequestSchema.partial()
export const SetTaskStatusRequestSchema = z.object({ status: TaskStatusSchema })
export const AssignTaskRequestSchema = z.object({
  assignee: UserIdSchema.nullable(),
})

export const TaskQuerySchema = z
  .object({
    assignee: z.coerce.number().int().nonnegative().optional(),
    status: TaskStatusSchema.optional(),
    priority: TaskPrioritySchema.optional(),
    project: UUIDSchema.optional(),
    team: UUIDSchema.optional(),
    label: UUIDSchema.optional(),
    creator: z.coerce.number().int().nonnegative().optional(),
    due_date: ISODateSchema.optional(),
    due_before: ISODateSchema.optional(),
    due_after: ISODateSchema.optional(),
    unassigned: BooleanQuerySchema.optional(),
    search: z.string().optional(),
    ordering: z
      .enum([
        "created_at",
        "-created_at",
        "updated_at",
        "-updated_at",
        "due_date",
        "-due_date",
        "priority",
        "-priority",
      ])
      .optional(),
  })
  .merge(paginationQuerySchema)

export const TaskListItemResponseSchema = z.object({
  id: UUIDSchema,
  project: UUIDSchema,
  project_name: z.string(),
  title: z.string(),
  status: TaskStatusSchema,
  priority: TaskPrioritySchema,
  assignee: UserIdSchema.nullable(),
  assignee_username: z.string().nullable(),
  label_names: z.array(z.string()),
  due_date: ISODateSchema.nullable(),
  created_at: ISODateTimeSchema,
})

export const TaskDetailResponseSchema = z.object({
  id: UUIDSchema,
  project: UUIDSchema,
  title: z.string(),
  description: z.string(),
  status: TaskStatusSchema,
  priority: TaskPrioritySchema,
  assignee: UserIdSchema.nullable(),
  created_by: UserIdSchema.nullable(),
  labels_detail: z.array(LabelResponseSchema),
  comment_count: z.number().int().nonnegative(),
  due_date: ISODateSchema.nullable(),
  created_at: ISODateTimeSchema,
  updated_at: ISODateTimeSchema,
})

export const PaginatedTaskListResponseSchema = paginatedResponseSchema(
  TaskListItemResponseSchema
)
