'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  useCreateWorkspace,
  useUpdateWorkspace,
} from '@/features/workspace/mutations';
import { Workspace } from '@/features/workspace/types';

interface CreateWorkspaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspace?: Workspace | null;
}

export function WorkspaceDialog({
  open,
  onOpenChange,
  workspace,
}: CreateWorkspaceDialogProps) {
  if (!open) return null;

  return (
    <WorkspaceDialogContent onOpenChange={onOpenChange} workspace={workspace} />
  );
}

interface WorkspaceDialogContentProps {
  onOpenChange: (open: boolean) => void;
  workspace?: Workspace | null;
}

function WorkspaceDialogContent({
  onOpenChange,
  workspace,
}: WorkspaceDialogContentProps) {
  const router = useRouter();

  const isEditMode = !!workspace;

  const [title, setTitle] = useState(workspace?.title ?? '');
  const [description, setDescription] = useState(workspace?.description ?? '');

  const createWorkspace = useCreateWorkspace();
  const updateWorkspace = useUpdateWorkspace();

  const handleSubmit = async () => {
    if (!title.trim()) return;

    if (isEditMode) {
      await updateWorkspace.mutateAsync({
        workspaceId: workspace.id,
        title: title.trim(),
        description: description.trim(),
      });
    } else {
      const ws = await createWorkspace.mutateAsync({
        title: title.trim(),
        description: description.trim(),
      });
      router.push(`/workspace/${ws.id}`);
    }

    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/20"
        onClick={() => onOpenChange(false)}
      />

      <div className="relative w-full max-w-md rounded-2xl border-[3px] border-black bg-[#FFFBF0] shadow-[8px_8px_0px_#000]">
        <div className="flex items-center justify-between border-b-[2px] border-black px-5 py-4">
          <h2 className="text-base font-black text-black">
            {isEditMode ? 'Edit Workspace' : 'New workspace'}
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="flex size-7 items-center justify-center rounded-lg border-[2px] border-black bg-white shadow-[2px_2px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            <X size={14} />
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-5 p-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black tracking-wide text-black uppercase">
              Title <span className="text-[#FF6B6B]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Research Papers, Product Strategy…"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              autoFocus
              className="h-10 w-full rounded-xl border-[2px] border-black bg-white px-3 text-sm font-semibold text-black shadow-[2px_2px_0px_#000] transition-all outline-none placeholder:text-gray-400 focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black tracking-wide text-black uppercase">
              Description
            </label>
            <textarea
              placeholder="What's this workspace about?"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border-[2px] border-black bg-white px-3 py-2 text-sm font-semibold text-black shadow-[2px_2px_0px_#000] transition-all outline-none placeholder:text-gray-400 focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 border-t-[2px] border-black px-5 py-4">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-xl border-[2px] border-black bg-white px-4 py-2 text-sm font-black text-black shadow-[2px_2px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="rounded-xl border-[2px] border-black bg-[#6C47FF] px-4 py-2 text-sm font-black text-white shadow-[3px_3px_0px_#000] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none disabled:pointer-events-none disabled:opacity-40"
          >
            {isEditMode ? 'Save Changes' : 'Create Workspace'}
          </button>
        </div>
      </div>
    </div>
  );
}
