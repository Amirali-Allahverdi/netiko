import type { PaginatedResponseDto } from '../common/pagination.dto.js';
import type { AuditEventResponseDto } from './audit/responses.dto.js';
import type { AssignmentRuleResponseDto } from './assignment-rules/responses.dto.js';
import type { LabelResponseDto } from './labels/responses.dto.js';
import type { ProjectListItemResponseDto } from './projects/responses.dto.js';
import type { TaskListItemResponseDto } from './tasks/responses.dto.js';
import type { TeamResponseDto } from './teams/responses.dto.js';
import type { WorkspaceResponseDto, WorkspaceMembershipResponseDto } from './workspaces/responses.dto.js';

export type PaginatedWorkspaceResponseDto = PaginatedResponseDto<WorkspaceResponseDto>;
export type PaginatedWorkspaceMembershipResponseDto = PaginatedResponseDto<WorkspaceMembershipResponseDto>;
export type PaginatedTeamResponseDto = PaginatedResponseDto<TeamResponseDto>;
export type PaginatedProjectListResponseDto = PaginatedResponseDto<ProjectListItemResponseDto>;
export type PaginatedLabelResponseDto = PaginatedResponseDto<LabelResponseDto>;
export type PaginatedTaskListResponseDto = PaginatedResponseDto<TaskListItemResponseDto>;
export type PaginatedAssignmentRuleResponseDto = PaginatedResponseDto<AssignmentRuleResponseDto>;
export type PaginatedAuditEventResponseDto = PaginatedResponseDto<AuditEventResponseDto>;
