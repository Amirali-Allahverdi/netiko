import type { ProjectStatus } from '../../common/enums.js';
import type { PaginationQueryDto } from '../../common/pagination.dto.js';
import type { UUID } from '../../common/primitives.js';

export interface CreateProjectRequestDto {
  team: UUID;
  name: string;
  description?: string;
  status?: ProjectStatus;
}

/** PUT /api/projects/{id}/ — team and name are required. */
export interface UpdateProjectRequestDto extends CreateProjectRequestDto {}

/** PATCH /api/projects/{id}/. */
export interface PatchProjectRequestDto {
  team?: UUID;
  name?: string;
  description?: string;
  status?: ProjectStatus;
}

export interface ProjectQueryDto extends PaginationQueryDto {
  team?: UUID;
  status?: ProjectStatus;
}
