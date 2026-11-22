import type { PaginatedResponseDto } from "../common/pagination.dto"
import type { AuditEventResponseDto } from "./audit/responses.dto"
import type { AssignmentRuleResponseDto } from "./assignment-rules/responses.dto"
import type { LabelResponseDto } from "./labels/responses.dto"
import type { ProjectListItemResponseDto } from "./projects/responses.dto"
import type { TaskListItemResponseDto } from "./tasks/responses.dto"
import type { TeamResponseDto } from "./teams/responses.dto"
import type {
  WorkspaceResponseDto,
  WorkspaceMembershipResponseDto,
} from "./workspaces/responses.dto"

export type PaginatedWorkspaceResponseDto =
  PaginatedResponseDto<WorkspaceResponseDto>
export type PaginatedWorkspaceMembershipResponseDto =
  PaginatedResponseDto<WorkspaceMembershipResponseDto>
export type PaginatedTeamResponseDto = PaginatedResponseDto<TeamResponseDto>
export type PaginatedProjectListResponseDto =
  PaginatedResponseDto<ProjectListItemResponseDto>
export type PaginatedLabelResponseDto = PaginatedResponseDto<LabelResponseDto>
export type PaginatedTaskListResponseDto =
  PaginatedResponseDto<TaskListItemResponseDto>
export type PaginatedAssignmentRuleResponseDto =
  PaginatedResponseDto<AssignmentRuleResponseDto>
export type PaginatedAuditEventResponseDto =
  PaginatedResponseDto<AuditEventResponseDto>
