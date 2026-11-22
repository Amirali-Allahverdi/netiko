import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { taskService } from '@/lib/api/client';
import { queryKeys } from '@/lib/query';
import type {
  AssignTaskRequestDto,
  CreateTaskRequestDto,
  PatchTaskRequestDto,
  SetTaskStatusRequestDto,
  TaskQueryDto,
  UpdateTaskRequestDto,
  UUID,
} from '@/contracts';

export const taskQueries = {
  list: (query: TaskQueryDto = {}) =>
    queryOptions({
      queryKey: queryKeys.tasks.list(query),
      queryFn: () => taskService.list(query),
    }),

  detail: (taskId: UUID) =>
    queryOptions({
      queryKey: queryKeys.tasks.detail(taskId),
      queryFn: () => taskService.get(taskId),
    }),
};

export function useTasks(query: TaskQueryDto = {}) {
  return useQuery(taskQueries.list(query));
}

export function useTask(taskId: UUID, enabled = true) {
  return useQuery({
    ...taskQueries.detail(taskId),
    enabled,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskRequestDto) => taskService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}


export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: UUID; payload: UpdateTaskRequestDto }) =>
      taskService.update(taskId, payload),
    onSuccess: async (task) => {
      queryClient.setQueryData(queryKeys.tasks.detail(task.id), task);
      await queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}

export function usePatchTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: UUID; payload: PatchTaskRequestDto }) =>
      taskService.patch(taskId, payload),
    onSuccess: async (task) => {
      queryClient.setQueryData(queryKeys.tasks.detail(task.id), task);
      await queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}

export function useSetTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: UUID; payload: SetTaskStatusRequestDto }) =>
      taskService.setStatus(taskId, payload),
    onSuccess: async (task) => {
      queryClient.setQueryData(queryKeys.tasks.detail(task.id), task);
      await queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}

export function useAssignTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: UUID; payload: AssignTaskRequestDto }) =>
      taskService.assign(taskId, payload),
    onSuccess: async (task) => {
      queryClient.setQueryData(queryKeys.tasks.detail(task.id), task);
      await queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: UUID) => taskService.remove(taskId),
    onSuccess: async (_result, taskId) => {
      queryClient.removeQueries({ queryKey: queryKeys.tasks.detail(taskId) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}
