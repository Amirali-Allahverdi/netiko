import 'client-only';

import {
  API_ROUTES,
  AssignTaskRequestSchema,
  CreateTaskRequestSchema,
  PaginatedTaskListResponseSchema,
  PatchTaskRequestSchema,
  SetTaskStatusRequestSchema,
  TaskDetailResponseSchema,
  TaskQuerySchema,
  UpdateTaskRequestSchema,
} from '@/contracts';
import type {
  AssignTaskRequestDto,
  CreateTaskRequestDto,
  PatchTaskRequestDto,
  SetTaskStatusRequestDto,
  TaskQueryDto,
  UpdateTaskRequestDto,
  UUID,
} from '@/contracts';
import { apiRequest, apiRequestVoid } from '../client/api-client';

export const taskService = {
  list(query?: TaskQueryDto) {
    return apiRequest(API_ROUTES.tasks.list, {
      method: 'GET',
      query,
      querySchema: TaskQuerySchema,
      responseSchema: PaginatedTaskListResponseSchema,
    });
  },

  get(taskId: UUID) {
    return apiRequest(API_ROUTES.tasks.detail(taskId), {
      method: 'GET',
      responseSchema: TaskDetailResponseSchema,
    });
  },

  create(payload: CreateTaskRequestDto) {
    return apiRequest(API_ROUTES.tasks.list, {
      method: 'POST',
      body: payload,
      requestSchema: CreateTaskRequestSchema,
      responseSchema: TaskDetailResponseSchema,
    });
  },

  update(taskId: UUID, payload: UpdateTaskRequestDto) {
    return apiRequest(API_ROUTES.tasks.detail(taskId), {
      method: 'PUT',
      body: payload,
      requestSchema: UpdateTaskRequestSchema,
      responseSchema: TaskDetailResponseSchema,
    });
  },

  patch(taskId: UUID, payload: PatchTaskRequestDto) {
    return apiRequest(API_ROUTES.tasks.detail(taskId), {
      method: 'PATCH',
      body: payload,
      requestSchema: PatchTaskRequestSchema,
      responseSchema: TaskDetailResponseSchema,
    });
  },

  setStatus(taskId: UUID, payload: SetTaskStatusRequestDto) {
    return apiRequest(API_ROUTES.tasks.status(taskId), {
      method: 'PATCH',
      body: payload,
      requestSchema: SetTaskStatusRequestSchema,
      responseSchema: TaskDetailResponseSchema,
    });
  },

  assign(taskId: UUID, payload: AssignTaskRequestDto) {
    return apiRequest(API_ROUTES.tasks.assign(taskId), {
      method: 'PATCH',
      body: payload,
      requestSchema: AssignTaskRequestSchema,
      responseSchema: TaskDetailResponseSchema,
    });
  },

  remove(taskId: UUID) {
    return apiRequestVoid(API_ROUTES.tasks.detail(taskId), {
      method: 'DELETE',
    });
  },
};
