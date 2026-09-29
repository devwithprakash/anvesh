'use client';

import { formatDistanceToNow } from 'date-fns';
import { Plus, MessageSquare, Trash2, MoreHorizontal, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useDeleteConversation } from '@/features/conversation/mutations';
import { useConversations } from '@/features/conversation/queries';
import { cn } from '@/lib/utils';

interface ConversationListProps {
  workspaceId: string;
  activeConversationId?: string;
  onClose?: () => void;
}

export function ConversationList({
  workspaceId,
  activeConversationId,
  onClose,
}: ConversationListProps) {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const deleteConversation = useDeleteConversation();
  const { data: conversationList, isLoading } = useConversations(workspaceId);

  const handleNew = async () => {
    router.push(`/workspace/${workspaceId}/new`);
  };

  const handleDelete = async (convId: string) => {
    await deleteConversation.mutateAsync({
      conversationId: convId,
      workspaceId,
    });
    if (activeConversationId === convId) {
      router.push(`/workspace/${workspaceId}`);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-full w-full shrink-0 flex-col border-r-[3px] border-black bg-[#FFFBF0] md:w-[260px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b-[2px] border-black px-4 py-3">
        <span className="text-sm font-black tracking-wide text-black uppercase">
          Chats
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleNew}
            className="flex size-7 items-center justify-center rounded-lg border-[2px] border-black bg-white shadow-[2px_2px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            <Plus size={14} />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="flex size-7 items-center justify-center rounded-lg border-[2px] border-black bg-white shadow-[2px_2px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="px-3 pt-3 pb-2">
        <button
          onClick={handleNew}
          className="flex w-full items-center gap-2 rounded-xl border-[2px] border-dashed border-black/30 px-3 py-2 text-sm font-bold text-gray-500 transition-all hover:border-black hover:bg-white hover:text-black hover:shadow-[2px_2px_0px_#000]"
        >
          <Plus size={14} className="shrink-0" />
          <span>New chat</span>
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 py-1">
        {!isLoading && conversationList && conversationList.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-4 py-12 text-center">
            <div className="flex size-10 items-center justify-center rounded-xl border-[2px] border-black bg-white shadow-[2px_2px_0px_#000]">
              <MessageSquare size={18} className="text-black" />
            </div>
            <div>
              <p className="text-sm font-black text-black">No chats yet</p>
              <p className="mt-0.5 text-xs font-semibold text-gray-500">
                Click &quot;New chat&quot; to start
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5 py-1">
            {conversationList &&
              conversationList.map(conv => {
                const isActive = activeConversationId === conv.id;
                return (
                  <div
                    key={conv.id}
                    className={cn(
                      'group relative flex cursor-pointer items-start gap-2.5 rounded-xl border-[2px] px-3 py-2.5 transition-all',
                      isActive
                        ? 'translate-x-[2px] translate-y-[2px] border-black bg-white shadow-[2px_2px_0px_#000]'
                        : 'border-transparent hover:border-black/20 hover:bg-white/60',
                    )}
                    onClick={() => {
                      router.push(`/workspace/${workspaceId}/${conv.id}`);
                      onClose?.();
                    }}
                  >
                    {/* Active accent bar */}
                    {isActive && (
                      <div className="absolute top-2 bottom-2 left-0 w-[3px] rounded-full bg-[#6C47FF]" />
                    )}

                    <MessageSquare
                      size={14}
                      className={cn(
                        'mt-0.5 shrink-0',
                        isActive ? 'text-[#6C47FF]' : 'text-gray-400',
                      )}
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span
                        className={cn(
                          'truncate text-sm leading-tight',
                          isActive
                            ? 'font-black text-black'
                            : 'font-bold text-gray-700',
                        )}
                      >
                        {conv.title}
                      </span>
                      <span className="text-[10px] leading-tight font-semibold text-gray-400">
                        {formatDistanceToNow(new Date(conv.updatedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="relative">
                      <button
                        className="flex size-5 items-center justify-center rounded-md opacity-0 transition-all group-hover:opacity-100 hover:bg-gray-100"
                        onClick={e => {
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
                            onClick={e => {
                              e.stopPropagation();
                              setOpenMenu(null);
                            }}
                          />
                          <div className="absolute top-full right-0 z-20 mt-1 w-32 overflow-hidden rounded-xl border-[2px] border-black bg-white shadow-[3px_3px_0px_#000]">
                            <div className="p-1">
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  setOpenMenu(null);
                                  handleDelete(conv.id);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#FF6B6B] transition-colors hover:bg-[#FFF0F0]"
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
