import { z } from "zod"
import {
  AuditActionSchema,
  ISODateTimeSchema,
  JsonValueSchema,
  UUIDSchema,
  UserIdSchema,
  paginationQuerySchema,
  paginatedResponseSchema,
} from "../../common/schemas.js"

export const AuditEventQuerySchema = z
  .object({
    workspace: UUIDSchema.optional(),
    action: AuditActionSchema.optional(),
    target_type: z.string().optional(),
    target_id: z.string().optional(),
    actor: z.coerce.number().int().nonnegative().optional(),
    ordering: z.enum(["created_at", "-created_at"]).optional(),
  })
  .merge(paginationQuerySchema)
export const AuditEventResponseSchema = z.object({
  id: UUIDSchema,
  workspace: UUIDSchema,
  actor: UserIdSchema.nullable(),
  actor_username: z.string().nullable(),
  action: AuditActionSchema,
  target_type: z.string(),
  target_id: z.string(),
  description: z.string(),
  metadata: z.record(z.string(), JsonValueSchema),
  created_at: ISODateTimeSchema,
})

export const PaginatedAuditEventResponseSchema = paginatedResponseSchema(
  AuditEventResponseSchema
)
