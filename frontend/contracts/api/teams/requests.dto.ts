import type { TeamRole } from "../../common/enums"
import type { PaginationQueryDto } from "../../common/pagination.dto"
import type { UUID } from "../../common/primitives"

export interface CreateTeamRequestDto {
  workspace: UUID
  name: string
  description?: string
}

/** PUT /api/teams/{id}/ — workspace and name remain required. */
export interface UpdateTeamRequestDto extends CreateTeamRequestDto {}

/** PATCH /api/teams/{id}/. */
export interface PatchTeamRequestDto {
  workspace?: UUID
  name?: string
  description?: string
}

/** POST /api/teams/{teamId}/members/ — the API resolves username to user. */
export interface AddTeamMemberRequestDto {
  username: string
  role?: TeamRole
}

export interface TeamQueryDto extends PaginationQueryDto {
  workspace?: UUID
  /** The view checks the exact query-string value `1`. */
  mine?: "1"
}
