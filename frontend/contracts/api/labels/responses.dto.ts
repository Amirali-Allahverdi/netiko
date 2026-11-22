import type { CreatedAtDto, UUID } from "../../common/primitives"

/** LabelSerializer omits updated_at even though the model is timestamped. */
export interface LabelResponseDto extends CreatedAtDto {
  id: UUID
  workspace: UUID
  name: string
  color: string
}
