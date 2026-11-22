import type { TaskPriority, TaskStatus } from "../../common/enums"
import type {
  ISODate,
  CreatedAtDto,
  TimestampedDto,
  UserId,
  UUID,
} from "../../common/primitives"
import type { LabelResponseDto } from "../labels/responses.dto"

/** TaskListSerializer — compact representation used only by list(). */
export interface TaskListItemResponseDto extends CreatedAtDto {
  id: UUID
  project: UUID
  project_name: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  assignee: UserId | null
  assignee_username: string | null
  label_names: string[]
  due_date: ISODate | null
}

/** TaskDetailSerializer — retrieve/create/update and custom task actions. */
export interface TaskDetailResponseDto extends TimestampedDto {
  id: UUID
  project: UUID
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignee: UserId | null
  created_by: UserId | null
  labels_detail: LabelResponseDto[]
  comment_count: number
  due_date: ISODate | null
}
