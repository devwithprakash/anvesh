import { useQuery } from '@tanstack/react-query';

import { getWorkspaceById, getWorkspaces } from './api';

export function useWorkspaces() {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: getWorkspaces,
  });
}

export function useGetWorkspace(workspaceId: string) {
  return useQuery({
    queryKey: ['workspace', workspaceId],
    queryFn: () => getWorkspaceById(workspaceId),
    enabled: !!workspaceId,
  });
}
