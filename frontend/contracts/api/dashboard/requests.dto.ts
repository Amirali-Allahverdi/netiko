import type { UUID } from '../../common/primitives.js';

export interface DashboardQueryDto {
  /** Optional UUID scope; absent means all workspaces visible to the caller. */
  workspace?: UUID;
}
