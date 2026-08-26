"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AVAILABLE_MODELS } from "@/lib/mock-data";
import { useCreateWorkspace } from "@/features/workspace/mutations";

interface CreateWorkspaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateWorkspaceDialog({
  open,
  onOpenChange,
}: CreateWorkspaceDialogProps) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [defaultModel, setDefaultModel] = useState("gpt-4o-mini");

  const createWorkspace = useCreateWorkspace();

  if (!open) return null;

  const handleCreate = async () => {
    if (!title.trim()) return;

    const ws = await createWorkspace.mutateAsync({
      title: title.trim(),
      description: description.trim(),
      defaultModel,
    });

    onOpenChange(false);
    setTitle("");
    setDescription("");
    setDefaultModel("gpt-4o-mini");
    router.push(`/workspace/${ws.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-2xl border-[3px] border-black bg-[#FFFBF0] shadow-[8px_8px_0px_#000]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-[2px] border-black px-5 py-4">
          <h2 className="font-black text-base text-black">New workspace</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="flex size-7 items-center justify-center rounded-lg border-[2px] border-black bg-white shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <X size={14} />
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-5 p-5">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-black uppercase tracking-wide">
              Title <span className="text-[#FF6B6B]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Research Papers, Product Strategy…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              autoFocus
              className="h-10 w-full rounded-xl border-[2px] border-black bg-white px-3 text-sm font-semibold text-black placeholder:text-gray-400 shadow-[2px_2px_0px_#000] outline-none focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-black uppercase tracking-wide">
              Description
            </label>
            <textarea
              placeholder="What's this workspace about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-xl border-[2px] border-black bg-white px-3 py-2 text-sm font-semibold text-black placeholder:text-gray-400 shadow-[2px_2px_0px_#000] outline-none focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all resize-none"
            />
          </div>

          {/* Model selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black text-black uppercase tracking-wide">
              Default model
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {AVAILABLE_MODELS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setDefaultModel(m.value)}
                  className={cn(
                    "flex flex-col items-start rounded-xl border-[2px] border-black px-3 py-3 text-left transition-all shadow-[2px_2px_0px_#000]",
                    defaultModel === m.value
                      ? "bg-[#6C47FF] text-white shadow-none translate-x-[2px] translate-y-[2px]"
                      : "bg-white text-black hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]",
                  )}
                >
                  <span className="text-sm font-black">{m.label}</span>
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      defaultModel === m.value
                        ? "text-white/70"
                        : "text-gray-500",
                    )}
                  >
                    {m.description}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 border-t-[2px] border-black px-5 py-4">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-xl border-[2px] border-black bg-white px-4 py-2 text-sm font-black text-black shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!title.trim()}
            className="rounded-xl border-[2px] border-black bg-[#6C47FF] px-4 py-2 text-sm font-black text-white shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            Create workspace
          </button>
        </div>
      </div>
    </div>
  );
}
