import type { ProjectStatus } from "../../common/enums"
import type {
  CreatedAtDto,
  TimestampedDto,
  UUID,
  UserId,
} from "../../common/primitives"

/** ProjectListSerializer. Returned in the paginated list endpoint. */
export interface ProjectListItemResponseDto extends CreatedAtDto {
  id: UUID
  team: UUID
  team_name: string
  name: string
  status: ProjectStatus
  task_count: number
}

/** ProjectDetailSerializer. Returned by retrieve/create/update. */
export interface ProjectDetailResponseDto extends TimestampedDto {
  id: UUID
  team: UUID
  team_name: string
  name: string
  description: string
  status: ProjectStatus
  created_by: UserId | null
}
