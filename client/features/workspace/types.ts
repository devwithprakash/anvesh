export type Workspace = {
  id: string;
  title: string;
  description?: string;
  model: string;
};

export type CreateWorkspaceInput = {
  title: string;
  description?: string;
  defaultModel: string;
};
