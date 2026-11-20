import type { AuditAction } from '../../common/enums.js';
import type { CreatedAtDto, JsonObject, UserId, UUID } from '../../common/primitives.js';

/** AuditEventSerializer; all fields are read-only. */
export interface AuditEventResponseDto extends CreatedAtDto {
  id: UUID;
  workspace: UUID;
  actor: UserId | null;
  actor_username: string | null;
  action: AuditAction;
  target_type: string;
  target_id: string;
  description: string;
  metadata: JsonObject;
}
