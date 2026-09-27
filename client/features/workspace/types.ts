export type Workspace = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  sourceCount?: number;
};

export type CreateWorkspaceInput = {
  title: string;
  description?: string;
};
export type UpdateWorkspaceInput = {
  workspaceId: string;
  title: string;
  description?: string;
};

export type DeleteWorkspaceInput = {
  workspaceId: string;
};
