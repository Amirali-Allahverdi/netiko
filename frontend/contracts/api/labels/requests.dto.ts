import type { PaginationQueryDto } from '../../common/pagination.dto.js';
import type { UUID } from '../../common/primitives.js';

export interface CreateLabelRequestDto {
  workspace: UUID;
  name: string;
  /** Hex color is suggested in model help_text; backend enforces max length 7 only. */
  color?: string;
}

/** PUT /api/labels/{id}/ — workspace and name are required. */
export interface UpdateLabelRequestDto extends CreateLabelRequestDto {}

/** PATCH /api/labels/{id}/. */
export interface PatchLabelRequestDto {
  workspace?: UUID;
  name?: string;
  color?: string;
}

export interface LabelQueryDto extends PaginationQueryDto {
  workspace?: UUID;
}
