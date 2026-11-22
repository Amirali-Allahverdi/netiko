import type { AssignmentStrategy } from "../../common/enums"
import type { PaginationQueryDto } from "../../common/pagination.dto"
import type { UserId, UUID } from "../../common/primitives"

export interface CreateAssignmentRuleRequestDto {
  project: UUID
  strategy: AssignmentStrategy
  label?: UUID | null
  target_user?: UserId | null
  is_active?: boolean
  priority_order?: number
}

/** PUT /api/assignment-rules/{id}/ — project and strategy are required. */
export interface UpdateAssignmentRuleRequestDto extends CreateAssignmentRuleRequestDto {}

/** PATCH supports partial updates; conditional validation also depends on persisted values. */
export interface PatchAssignmentRuleRequestDto {
  project?: UUID
  strategy?: AssignmentStrategy
  label?: UUID | null
  target_user?: UserId | null
  is_active?: boolean
  priority_order?: number
}

export interface AssignmentRuleQueryDto extends PaginationQueryDto {
  project?: UUID
  strategy?: AssignmentStrategy
  is_active?: boolean
}
