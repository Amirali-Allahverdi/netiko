import type { TeamRole } from "../../common/enums"
import type {
  CreatedAtDto,
  TimestampedDto,
  UUID,
  UserId,
} from "../../common/primitives"

export interface TeamResponseDto extends TimestampedDto {
  id: UUID
  workspace: UUID
  name: string
  description: string
  member_count: number
}

export interface TeamMembershipResponseDto extends CreatedAtDto {
  id: UUID
  team: UUID
  user: UserId
  username: string
  role: TeamRole
}
