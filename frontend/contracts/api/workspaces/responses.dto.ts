import type { WorkspaceRole } from '../../common/enums.js';
import type { CreatedAtDto, TimestampedDto, UUID, UserId } from '../../common/primitives.js';

export interface WorkspaceResponseDto extends TimestampedDto {
  id: UUID;
  name: string;
  slug: string;
  owner: UserId;
  member_count: number;
}

export interface WorkspaceMembershipResponseDto extends CreatedAtDto {
  id: UUID;
  workspace: UUID;
  user: UserId;
  username: string;
  role: WorkspaceRole;
}
