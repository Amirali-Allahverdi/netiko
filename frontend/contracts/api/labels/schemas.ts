import { z } from 'zod';
import { ISODateTimeSchema, UUIDSchema, paginationQuerySchema, paginatedResponseSchema } from '../../common/schemas.js';

export const CreateLabelRequestSchema = z.object({
  workspace: UUIDSchema,
  name: z.string().min(1).max(50),
  color: z.string().min(1).max(7).optional(),
});
export const LabelQuerySchema = z.object({ workspace: UUIDSchema.optional() }).merge(paginationQuerySchema);
export const UpdateLabelRequestSchema = CreateLabelRequestSchema;
export const PatchLabelRequestSchema = CreateLabelRequestSchema.partial();
export const LabelResponseSchema = z.object({
  id: UUIDSchema,
  workspace: UUIDSchema,
  name: z.string(),
  color: z.string(),
  created_at: ISODateTimeSchema,
});

export const PaginatedLabelResponseSchema = paginatedResponseSchema(LabelResponseSchema);
