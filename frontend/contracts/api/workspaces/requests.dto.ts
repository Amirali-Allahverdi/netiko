import type { WorkspaceRole } from '../../common/enums.js';
import type { PaginationQueryDto } from '../../common/pagination.dto.js';

/** POST /api/workspaces/ — owner and slug are assigned/generated server-side. */
export interface CreateWorkspaceRequestDto {
  name: string;
}

/** PUT /api/workspaces/{id}/ — name is required by WorkspaceSerializer. */
export interface UpdateWorkspaceRequestDto {
  name: string;
}

/** PATCH /api/workspaces/{id}/. */
export interface PatchWorkspaceRequestDto {
  name?: string;
}

/** POST /api/workspaces/{workspaceId}/members/. */
export interface AddWorkspaceMemberRequestDto {
  username: string;
  role?: WorkspaceRole;
}

/** PATCH /api/memberships/{membershipId}/ — only role is writable. */
export interface UpdateWorkspaceMembershipRequestDto {
  role: WorkspaceRole;
}

export interface WorkspaceListQueryDto extends PaginationQueryDto {}
