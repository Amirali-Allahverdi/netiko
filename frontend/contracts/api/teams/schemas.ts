import { z } from "zod"
import {
  ISODateTimeSchema,
  UUIDSchema,
  UserIdSchema,
  TeamRoleSchema,
  paginationQuerySchema,
  paginatedResponseSchema,
} from "../../common/schemas"

export const CreateTeamRequestSchema = z.object({
  workspace: UUIDSchema,
  name: z.string().min(1).max(255),
  description: z.string().optional(),
})
export const UpdateTeamRequestSchema = CreateTeamRequestSchema
export const PatchTeamRequestSchema = CreateTeamRequestSchema.partial()
export const TeamQuerySchema = z
  .object({
    workspace: UUIDSchema.optional(),
    mine: z.literal("1").optional(),
  })
  .merge(paginationQuerySchema)
export const AddTeamMemberRequestSchema = z.object({
  username: z.string().min(1),
  role: TeamRoleSchema.optional().default("member"),
})
export const TeamResponseSchema = z.object({
  id: UUIDSchema,
  workspace: UUIDSchema,
  name: z.string(),
  description: z.string(),
  member_count: z.number().int().nonnegative(),
  created_at: ISODateTimeSchema,
  updated_at: ISODateTimeSchema,
})
export const TeamMembershipResponseSchema = z.object({
  id: UUIDSchema,
  team: UUIDSchema,
  user: UserIdSchema,
  username: z.string(),
  role: TeamRoleSchema,
  created_at: ISODateTimeSchema,
})

export const PaginatedTeamResponseSchema =
  paginatedResponseSchema(TeamResponseSchema)
