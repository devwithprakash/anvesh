"use client";

import * as React from "react";
import { useState } from "react";
import {
  Plus,
  FileText,
  Globe,
  Trash2,
  MoreHorizontal,
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader,
  X,
} from "lucide-react";
import { YoutubeLogo, TextT } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useAppState } from "@/components/providers/app-provider";
import { type SourceType, type Source } from "@/lib/mock-data";

// ─── Source type metadata ─────────────────────────────────────────────────────

const SOURCE_META: Record<SourceType, { icon: React.ReactNode; label: string; accent: string; bg: string }> = {
  PDF:      { icon: <FileText size={14} />,   label: "PDF",      accent: "text-[#FF6B6B]",  bg: "bg-[#FFE8E8]" },
  WEBSITE:  { icon: <Globe size={14} />,       label: "Website",  accent: "text-blue-600",   bg: "bg-[#E8F0FF]" },
  YOUTUBE:  { icon: <YoutubeLogo size={14} />,     label: "YouTube",  accent: "text-red-600",    bg: "bg-[#FFE8E8]" },
  TEXT:     { icon: <TextT size={14} />,        label: "Text",     accent: "text-[#00B87C]",  bg: "bg-[#EAFFF6]" },
  MARKDOWN: { icon: <TextT size={14} />,        label: "Markdown", accent: "text-[#6C47FF]",  bg: "bg-[#EDE9FE]" },
};

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Source["status"] }) {
  if (status === "READY")
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full border-[1.5px] border-[#00B87C] bg-[#EAFFF6] px-1.5 py-0.5 text-[9px] font-black text-[#00B87C]">
        <CheckCircle size={8} /> Ready
      </span>
    );
  if (status === "PROCESSING")
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full border-[1.5px] border-amber-500 bg-amber-50 px-1.5 py-0.5 text-[9px] font-black text-amber-600">
        <Loader size={8} className="animate-spin" /> Processing
      </span>
    );
  if (status === "PENDING")
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full border-[1.5px] border-gray-400 bg-gray-100 px-1.5 py-0.5 text-[9px] font-black text-gray-500">
        <Clock size={8} /> Pending
      </span>
    );
  return (
    <span className="inline-flex items-center gap-0.5 rounded-full border-[1.5px] border-[#FF6B6B] bg-[#FFF0F0] px-1.5 py-0.5 text-[9px] font-black text-[#FF6B6B]">
      <AlertTriangle size={8} /> Failed
    </span>
  );
}

// ─── Sources Panel ────────────────────────────────────────────────────────────

interface SourcesPanelProps {
  workspaceId: string;
  /** When provided, a close (×) button is shown — used by mobile slide-over */
  onClose?: () => void;
}

export function SourcesPanel({ workspaceId, onClose }: SourcesPanelProps) {
  const { sources, addSource, deleteSource } = useAppState();
  const srcList = sources[workspaceId] ?? [];
  const [addOpen, setAddOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const readyCount = srcList.filter((s) => s.status === "READY").length;

  return (
    <div className="flex h-full w-full md:w-[260px] shrink-0 flex-col border-l-[3px] border-black bg-[#FFFBF0]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b-[2px] border-black">
        <div className="flex items-center gap-1.5">
          <span className="font-black text-xs text-black uppercase tracking-wide">Sources</span>
          {srcList.length > 0 && (
            <span className="rounded-full border-[1.5px] border-black bg-[#EDE9FE] px-1.5 py-0.5 text-[9px] font-black text-[#6C47FF]">
              {readyCount}/{srcList.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAddOpen(true)}
            className="flex size-6 items-center justify-center rounded-md border-[2px] border-black bg-white shadow-[1px_1px_0px_#000] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
          >
            <Plus size={12} />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="flex size-6 items-center justify-center rounded-md border-[2px] border-black bg-white shadow-[1px_1px_0px_#000] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Add source button */}
      <div className="px-2.5 pt-2.5 pb-1.5">
        <button
          onClick={() => setAddOpen(true)}
          className="flex w-full items-center gap-1.5 rounded-lg border-[2px] border-dashed border-black/30 px-2.5 py-1.5 text-xs font-bold text-gray-500 hover:border-black hover:text-black hover:bg-white hover:shadow-[2px_2px_0px_#000] transition-all"
        >
          <Plus size={12} className="shrink-0" />
          Add source
        </button>
      </div>

      {/* Source list */}
      <div className="flex-1 min-h-0 overflow-y-auto px-2.5 py-1">
        {srcList.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2.5 py-10 text-center">
            <div className="flex size-9 items-center justify-center rounded-xl border-[2px] border-black bg-white shadow-[2px_2px_0px_#000]">
              <FileText size={16} className="text-black" />
            </div>
            <div>
              <p className="text-xs font-black text-black">No sources</p>
              <p className="text-[10px] font-semibold text-gray-500 mt-0.5">
                Add PDFs, websites or videos
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 py-1">
            {srcList.map((src) => {
              const meta = SOURCE_META[src.type];
              return (
                <div
                  key={src.id}
                  className="group relative flex items-center gap-2 rounded-lg border-[2px] border-black bg-white px-2.5 py-2 shadow-[2px_2px_0px_#000]"
                >
                  {/* Type icon badge */}
                  <div className={cn("flex size-6 shrink-0 items-center justify-center rounded-md border-[1.5px] border-black", meta.bg)}>
                    <span className={meta.accent}>{meta.icon}</span>
                  </div>

                  {/* Content */}
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-[11px] font-black text-black leading-tight">
                      {src.title}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={src.status} />
                      {src.url && (
                        <span className="truncate text-[9px] font-semibold text-gray-400 max-w-[80px]">
                          {src.url.replace(/^https?:\/\//, "").split("/")[0]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="relative shrink-0">
                    <button
                      onClick={() => setOpenMenu(openMenu === src.id ? null : src.id)}
                      className="flex size-5 items-center justify-center rounded-md opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all"
                    >
                      <MoreHorizontal size={11} />
                    </button>
                    {openMenu === src.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
                        <div className="absolute right-0 top-full mt-1 z-20 w-28 rounded-lg border-[2px] border-black bg-white shadow-[2px_2px_0px_#000] overflow-hidden">
                          <div className="p-1">
                            <button
                              onClick={() => {
                                deleteSource(workspaceId, src.id);
                                setOpenMenu(null);
                              }}
                              className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-bold text-[#FF6B6B] hover:bg-[#FFF0F0] transition-colors"
                            >
                              <Trash2 size={10} />
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

      {/* Footer stats */}
      {srcList.length > 0 && (
        <div className="border-t-[2px] border-black px-3 py-1.5">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-wide">
            {readyCount} ready · {srcList.length - readyCount} processing
          </p>
        </div>
      )}

      {/* Add Source Dialog */}
      {addOpen && (
        <AddSourceDialog
          onClose={() => setAddOpen(false)}
          workspaceId={workspaceId}
        />
      )}
    </div>
  );
}

// ─── Add Source Dialog ────────────────────────────────────────────────────────

function AddSourceDialog({
  onClose,
  workspaceId,
}: {
  onClose: () => void;
  workspaceId: string;
}) {
  const { addSource } = useAppState();
  const [tab, setTab] = useState<"pdf" | "website" | "youtube" | "text">("pdf");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [websiteTitle, setWebsiteTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeTitle, setYoutubeTitle] = useState("");
  const [textTitle, setTextTitle] = useState("");
  const [textContent, setTextContent] = useState("");
  const [textType, setTextType] = useState<"TEXT" | "MARKDOWN">("TEXT");

  const simulateAdd = (partial: Partial<Source>) => {
    addSource(workspaceId, {
      id: `src-${Date.now()}`,
      workspaceId,
      type: "TEXT",
      title: "New Source",
      status: "PENDING",
      createdAt: new Date().toISOString(),
      ...partial,
    } as Source);
    onClose();
  };

  const tabs: { id: typeof tab; label: string; icon: React.ReactNode }[] = [
    { id: "pdf",     label: "PDF",     icon: <FileText size={13} /> },
    { id: "website", label: "Website", icon: <Globe size={13} /> },
    { id: "youtube", label: "YouTube", icon: <YoutubeLogo size={13} /> },
    { id: "text",    label: "Text",    icon: <TextT size={13} /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      {/* Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl border-[3px] border-black bg-white shadow-[8px_8px_0px_#000]">
        {/* Header */}
        <div className="flex items-center justify-between border-b-[2px] border-black px-5 py-4">
          <h2 className="font-black text-base text-black">Add source</h2>
          <button
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-lg border-[2px] border-black bg-white shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <X size={14} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b-[2px] border-black">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-black transition-colors border-r-[2px] border-black last:border-r-0",
                tab === t.id
                  ? "bg-[#6C47FF] text-white"
                  : "bg-white text-black hover:bg-gray-100"
              )}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5">
          {tab === "pdf" && (
            <div className="flex flex-col gap-4">
              <label
                htmlFor="pdf-file"
                className={cn(
                  "flex flex-col items-center justify-center rounded-xl border-[2.5px] border-dashed px-6 py-10 cursor-pointer transition-all",
                  pdfFile
                    ? "border-[#6C47FF] bg-[#EDE9FE]"
                    : "border-black/30 hover:border-black hover:bg-gray-50"
                )}
              >
                <FileText size={32} className="text-[#FF6B6B] mb-2" />
                {pdfFile ? (
                  <>
                    <p className="text-sm font-black text-black">{pdfFile.name}</p>
                    <p className="text-xs font-semibold text-gray-500 mt-0.5">
                      {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-black text-black">Drop PDF here or click</p>
                    <p className="text-xs font-semibold text-gray-500 mt-0.5">Max 10 MB</p>
                  </>
                )}
                <input id="pdf-file" type="file" accept=".pdf" className="sr-only"
                  onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)} />
              </label>
              {pdfFile && (
                <button onClick={() => setPdfFile(null)}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black">
                  <X size={12} /> Remove file
                </button>
              )}
              <NbButton onClick={() => pdfFile && simulateAdd({ type: "PDF", title: pdfFile.name.replace(".pdf",""), status: "PROCESSING" })} disabled={!pdfFile}>
                Upload PDF
              </NbButton>
            </div>
          )}

          {tab === "website" && (
            <div className="flex flex-col gap-3">
              <NbInput label="URL *" type="url" placeholder="https://example.com/article"
                value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} />
              <NbInput label="Title (optional)" placeholder="Auto-detected from page"
                value={websiteTitle} onChange={(e) => setWebsiteTitle(e.target.value)} />
              <NbButton onClick={() => websiteUrl && simulateAdd({ type: "WEBSITE", title: websiteTitle || websiteUrl, url: websiteUrl, status: "PENDING" })} disabled={!websiteUrl}>
                Import website
              </NbButton>
            </div>
          )}

          {tab === "youtube" && (
            <div className="flex flex-col gap-3">
              <NbInput label="YouTube URL *" type="url" placeholder="https://youtube.com/watch?v=..."
                value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
              <NbInput label="Title (optional)" placeholder="Auto-detected from video"
                value={youtubeTitle} onChange={(e) => setYoutubeTitle(e.target.value)} />
              <NbButton onClick={() => youtubeUrl && simulateAdd({ type: "YOUTUBE", title: youtubeTitle || "YouTube Video", url: youtubeUrl, status: "PENDING" })} disabled={!youtubeUrl}>
                Import YouTube
              </NbButton>
            </div>
          )}

          {tab === "text" && (
            <div className="flex flex-col gap-3">
              {/* Type toggle */}
              <div className="flex gap-2">
                {(["TEXT","MARKDOWN"] as const).map((t) => (
                  <button key={t} onClick={() => setTextType(t)}
                    className={cn(
                      "flex-1 rounded-lg border-[2px] border-black py-1.5 text-xs font-black transition-all shadow-[2px_2px_0px_#000]",
                      textType === t
                        ? "bg-[#6C47FF] text-white shadow-none translate-x-[2px] translate-y-[2px]"
                        : "bg-white text-black hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                    )}>
                    {t === "TEXT" ? "Plain text" : "Markdown"}
                  </button>
                ))}
              </div>
              <NbInput label="Title *" placeholder="Source title"
                value={textTitle} onChange={(e) => setTextTitle(e.target.value)} />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-black text-black uppercase tracking-wide">Content *</label>
                <textarea
                  placeholder="Paste your content here…"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  rows={5}
                  className="w-full rounded-xl border-[2px] border-black bg-white px-3 py-2 text-sm font-semibold text-black placeholder:text-gray-400 shadow-[2px_2px_0px_#000] outline-none focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all resize-none"
                />
              </div>
              <NbButton onClick={() => textTitle && textContent && simulateAdd({ type: textType, title: textTitle, content: textContent, status: "READY" })} disabled={!textTitle || !textContent}>
                Add text
              </NbButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Reusable neo-brutalist primitives ───────────────────────────────────────

function NbInput({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-black text-black uppercase tracking-wide">{label}</label>
      <input
        {...props}
        className="h-10 w-full rounded-xl border-[2px] border-black bg-white px-3 text-sm font-semibold text-black placeholder:text-gray-400 shadow-[2px_2px_0px_#000] outline-none focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
      />
    </div>
  );
}

function NbButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-xl border-[2.5px] border-black bg-[#6C47FF] py-2.5 text-sm font-black text-white shadow-[3px_3px_0px_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all disabled:opacity-40 disabled:pointer-events-none"
    >
      {children}
    </button>
  );
}
