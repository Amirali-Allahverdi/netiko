import { z } from "zod"
import {
  ISODateTimeSchema,
  UUIDSchema,
  UserIdSchema,
  WorkspaceRoleSchema,
  paginationQuerySchema,
  paginatedResponseSchema,
} from "../../common/schemas"

export const WorkspaceListQuerySchema = paginationQuerySchema
export const CreateWorkspaceRequestSchema = z.object({
  name: z.string().min(1).max(255),
})
export const UpdateWorkspaceRequestSchema = CreateWorkspaceRequestSchema
export const PatchWorkspaceRequestSchema =
  CreateWorkspaceRequestSchema.partial()
export const AddWorkspaceMemberRequestSchema = z.object({
  username: z.string().min(1),
  role: WorkspaceRoleSchema.optional().default("member"),
})
export const UpdateWorkspaceMembershipRequestSchema = z.object({
  role: WorkspaceRoleSchema,
})

export const WorkspaceResponseSchema = z.object({
  id: UUIDSchema,
  name: z.string(),
  slug: z.string(),
  owner: UserIdSchema,
  member_count: z.number().int().nonnegative(),
  created_at: ISODateTimeSchema,
  updated_at: ISODateTimeSchema,
})

export const WorkspaceMembershipResponseSchema = z.object({
  id: UUIDSchema,
  workspace: UUIDSchema,
  user: UserIdSchema,
  username: z.string(),
  role: WorkspaceRoleSchema,
  created_at: ISODateTimeSchema,
})

export const PaginatedWorkspaceResponseSchema = paginatedResponseSchema(
  WorkspaceResponseSchema
)
export const PaginatedWorkspaceMembershipResponseSchema =
  paginatedResponseSchema(WorkspaceMembershipResponseSchema)
