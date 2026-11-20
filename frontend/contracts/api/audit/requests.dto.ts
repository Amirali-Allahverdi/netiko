import type { AuditAction } from '../../common/enums.js';
import type { PaginationQueryDto } from '../../common/pagination.dto.js';
import type { UserId, UUID } from '../../common/primitives.js';

/** Audit endpoint is read-only; these are list filters only. */
export interface AuditEventQueryDto extends PaginationQueryDto {
  workspace?: UUID;
  action?: AuditAction;
  target_type?: string;
  target_id?: string;
  actor?: UserId;
  ordering?: 'created_at' | '-created_at';
}
