import type { AssignmentStrategy } from "../../common/enums"
import type { CreatedAtDto, UserId, UUID } from "../../common/primitives"

/** AssignmentRuleSerializer response. updated_at is not serialized by the backend. */
export interface AssignmentRuleResponseDto extends CreatedAtDto {
  id: UUID
  project: UUID
  strategy: AssignmentStrategy
  label: UUID | null
  target_user: UserId | null
  is_active: boolean
  priority_order: number
}
