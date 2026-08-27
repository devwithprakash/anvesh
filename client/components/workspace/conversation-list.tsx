"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Plus, MessageSquare, Trash2, MoreHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppState } from "@/components/providers/app-provider";
import { useCreateConversation } from "@/features/conversation/mutations";
import { useConversations } from "@/features/conversation/queries";

interface ConversationListProps {
  workspaceId: string;
  activeConversationId?: string;
  /** When provided, a close (×) button is shown — used by mobile slide-over */
  onClose?: () => void;
}

export function ConversationList({
  workspaceId,
  activeConversationId,
  onClose,
}: ConversationListProps) {
  const router = useRouter();
  const { deleteConversation } = useAppState();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const createConversation = useCreateConversation();

  const handleNew = async () => {
    const conv = await createConversation.mutateAsync({ workspaceId });

    console.log("workspaceId:", workspaceId);
    console.log("created conversation:", conv);
    console.log("conversation id:", conv?.id);
    router.push(`/workspace/${workspaceId}/${conv.id}`);
    onClose?.();
  };

  const handleDelete = (convId: string) => {
    deleteConversation(workspaceId, convId);
    if (activeConversationId === convId) {
      router.push(`/workspace/${workspaceId}`);
    }
  };

  const { data: conversationList, isLoading } = useConversations(workspaceId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-full w-full md:w-[260px] shrink-0 flex-col border-r-[3px] border-black bg-[#FFFBF0]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b-[2px] border-black">
        <span className="font-black text-sm text-black uppercase tracking-wide">
          Chats
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleNew}
            className="flex size-7 items-center justify-center rounded-lg border-[2px] border-black bg-white shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <Plus size={14} />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="flex size-7 items-center justify-center rounded-lg border-[2px] border-black bg-white shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* New chat button */}
      <div className="px-3 pt-3 pb-2">
        <button
          onClick={handleNew}
          className="flex w-full items-center gap-2 rounded-xl border-[2px] border-dashed border-black/30 px-3 py-2 text-sm font-bold text-gray-500 hover:border-black hover:text-black hover:bg-white hover:shadow-[2px_2px_0px_#000] transition-all"
        >
          <Plus size={14} className="shrink-0" />
          <span>New chat</span>
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 py-1">
        {!isLoading && conversationList && conversationList.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center px-4">
            <div className="flex size-10 items-center justify-center rounded-xl border-[2px] border-black bg-white shadow-[2px_2px_0px_#000]">
              <MessageSquare size={18} className="text-black" />
            </div>
            <div>
              <p className="text-sm font-black text-black">No chats yet</p>
              <p className="text-xs font-semibold text-gray-500 mt-0.5">
                Click &quot;New chat&quot; to start
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5 py-1">
            {conversationList &&
              conversationList.map((conv) => {
                const isActive = activeConversationId === conv.id;
                return (
                  <div
                    key={conv.id}
                    className={cn(
                      "group relative flex items-start gap-2.5 rounded-xl px-3 py-2.5 cursor-pointer transition-all border-[2px]",
                      isActive
                        ? "border-black bg-white shadow-[2px_2px_0px_#000] translate-x-[2px] translate-y-[2px]"
                        : "border-transparent hover:border-black/20 hover:bg-white/60",
                    )}
                    onClick={() => {
                      router.push(`/workspace/${workspaceId}/${conv.id}`);
                      onClose?.();
                    }}
                  >
                    {/* Active accent bar */}
                    {isActive && (
                      <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-[#6C47FF]" />
                    )}

                    <MessageSquare
                      size={14}
                      className={cn(
                        "mt-0.5 shrink-0",
                        isActive ? "text-[#6C47FF]" : "text-gray-400",
                      )}
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span
                        className={cn(
                          "truncate text-sm leading-tight",
                          isActive
                            ? "font-black text-black"
                            : "font-bold text-gray-700",
                        )}
                      >
                        {conv.title}
                      </span>
                      <span className="text-[10px] font-semibold text-gray-400 leading-tight">
                        {formatDistanceToNow(new Date(conv.updatedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="relative">
                      <button
                        className="flex size-5 items-center justify-center rounded-md opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenu(openMenu === conv.id ? null : conv.id);
                        }}
                      >
                        <MoreHorizontal size={13} />
                      </button>
                      {openMenu === conv.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenu(null);
                            }}
                          />
                          <div className="absolute right-0 top-full mt-1 z-20 w-32 rounded-xl border-[2px] border-black bg-white shadow-[3px_3px_0px_#000] overflow-hidden">
                            <div className="p-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenu(null);
                                  handleDelete(conv.id);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#FF6B6B] hover:bg-[#FFF0F0] transition-colors"
                              >
                                <Trash2 size={11} />
                                Delete
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
