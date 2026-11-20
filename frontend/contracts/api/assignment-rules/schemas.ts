import { z, type RefinementCtx } from 'zod';
import type { CreateAssignmentRuleRequestDto } from './requests.dto.js';
import {
  AssignmentStrategySchema,
  ISODateTimeSchema,
  UUIDSchema,
  UserIdSchema,
  BooleanQuerySchema,
  paginationQuerySchema,
  paginatedResponseSchema,
} from '../../common/schemas.js';

const assignmentRuleFields = {
  project: UUIDSchema,
  strategy: AssignmentStrategySchema,
  label: UUIDSchema.nullable().optional(),
  target_user: UserIdSchema.nullable().optional(),
  is_active: z.boolean().optional(),
  priority_order: z.number().int().nonnegative().optional(),
};

const AssignmentRulePutBaseSchema = z.object(assignmentRuleFields);

/** Mirrors AssignmentRuleSerializer.validate() for create payloads. */
export const CreateAssignmentRuleRequestSchema = AssignmentRulePutBaseSchema.superRefine((value: CreateAssignmentRuleRequestDto, ctx: RefinementCtx) => {
  if (value.strategy === 'label_based' && !value.label) {
    ctx.addIssue({ code: 'custom', path: ['label'], message: 'Required for label_based strategy.' });
  }
  if (value.strategy === 'default_assignee' && !value.target_user) {
    ctx.addIssue({ code: 'custom', path: ['target_user'], message: 'Required for default_assignee strategy.' });
  }
});

/** PUT requires project and strategy, but backend validation can reuse stored optional fields. */
export const UpdateAssignmentRuleRequestSchema = AssignmentRulePutBaseSchema;

/** PATCH uses the persisted instance for fields omitted from the request. */
export const PatchAssignmentRuleRequestSchema = AssignmentRulePutBaseSchema.partial();

export const AssignmentRuleQuerySchema = z.object({
  project: UUIDSchema.optional(),
  strategy: AssignmentStrategySchema.optional(),
  is_active: BooleanQuerySchema.optional(),
}).merge(paginationQuerySchema);
export const AssignmentRuleResponseSchema = z.object({
  id: UUIDSchema,
  project: UUIDSchema,
  strategy: AssignmentStrategySchema,
  label: UUIDSchema.nullable(),
  target_user: UserIdSchema.nullable(),
  is_active: z.boolean(),
  priority_order: z.number().int().nonnegative(),
  created_at: ISODateTimeSchema,
});

export const PaginatedAssignmentRuleResponseSchema = paginatedResponseSchema(AssignmentRuleResponseSchema);
