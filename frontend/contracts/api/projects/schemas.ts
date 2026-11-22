import { z } from "zod"
import {
  ISODateTimeSchema,
  UUIDSchema,
  UserIdSchema,
  ProjectStatusSchema,
  paginationQuerySchema,
  paginatedResponseSchema,
} from "../../common/schemas"

export const CreateProjectRequestSchema = z.object({
  team: UUIDSchema,
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  status: ProjectStatusSchema.optional(),
})
export const UpdateProjectRequestSchema = CreateProjectRequestSchema
export const PatchProjectRequestSchema = CreateProjectRequestSchema.partial()
export const ProjectQuerySchema = z
  .object({
    team: UUIDSchema.optional(),
    status: ProjectStatusSchema.optional(),
  })
  .merge(paginationQuerySchema)
export const ProjectListItemResponseSchema = z.object({
  id: UUIDSchema,
  team: UUIDSchema,
  team_name: z.string(),
  name: z.string(),
  status: ProjectStatusSchema,
  task_count: z.number().int().nonnegative(),
  created_at: ISODateTimeSchema,
})
export const ProjectDetailResponseSchema = z.object({
  id: UUIDSchema,
  team: UUIDSchema,
  team_name: z.string(),
  name: z.string(),
  description: z.string(),
  status: ProjectStatusSchema,
  created_by: UserIdSchema.nullable(),
  created_at: ISODateTimeSchema,
  updated_at: ISODateTimeSchema,
})

export const PaginatedProjectListResponseSchema = paginatedResponseSchema(
  ProjectListItemResponseSchema
)
