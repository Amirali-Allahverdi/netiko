import { z, type ZodType, type ZodTypeAny } from "zod"
import {
  ASSIGNMENT_STRATEGIES,
  AUDIT_ACTIONS,
  PROJECT_STATUSES,
  TASK_PRIORITIES,
  TASK_STATUSES,
  TEAM_ROLES,
  WORKSPACE_ROLES,
} from "./enums"
import { JsonValue } from "./primitives"

export const UUIDSchema = z.string().uuid()
export const UserIdSchema = z.number().int().nonnegative()
export const ISODateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
export const ISODateTimeSchema = z.string().datetime({ offset: true })

export const WorkspaceRoleSchema = z.enum(WORKSPACE_ROLES)
export const TeamRoleSchema = z.enum(TEAM_ROLES)
export const ProjectStatusSchema = z.enum(PROJECT_STATUSES)
export const TaskStatusSchema = z.enum(TASK_STATUSES)
export const TaskPrioritySchema = z.enum(TASK_PRIORITIES)
export const AssignmentStrategySchema = z.enum(ASSIGNMENT_STRATEGIES)
export const AuditActionSchema = z.enum(AUDIT_ACTIONS)

export const JsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(JsonValueSchema),
    z.record(z.string(), JsonValueSchema),
  ])
)

export const ApiErrorSchema = z
  .object({
    detail: z.string().optional(),
    code: z.string().optional(),
  })
  .passthrough()

export const BooleanQuerySchema = z.preprocess((value: unknown) => {
  if (value === "true" || value === "1") return true
  if (value === "false" || value === "0") return false
  return value
}, z.boolean())

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  page_size: z.coerce.number().int().positive().max(100).optional(),
})

export const paginatedResponseSchema = <T extends ZodTypeAny>(itemSchema: T) =>
  z.object({
    count: z.number().int().nonnegative(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(itemSchema),
  })
