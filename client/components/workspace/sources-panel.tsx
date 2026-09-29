'use client';

import { YoutubeLogo, TextT } from '@phosphor-icons/react';
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
  AlertCircle,
} from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';

import {
  useDeleteSource,
  useUploadFileSource,
  useUploadTextSource,
  useUploadWebsiteSource,
  useUploadYoutubeSource,
} from '@/features/source/mutations';
import { useSources } from '@/features/source/queries';
import { type Source } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const SOURCE_META: Record<
  string,
  { icon: React.ReactNode; label: string; accent: string; bg: string }
> = {
  FILE: {
    icon: <FileText size={14} />,
    label: 'FILE',
    accent: 'text-[#FF6B6B]',
    bg: 'bg-[#FFE8E8]',
  },
  PDF: {
    icon: <FileText size={14} />,
    label: 'PDF',
    accent: 'text-[#FF6B6B]',
    bg: 'bg-[#FFE8E8]',
  },
  WEBSITE: {
    icon: <Globe size={14} />,
    label: 'Website',
    accent: 'text-blue-600',
    bg: 'bg-[#E8F0FF]',
  },
  YOUTUBE: {
    icon: <YoutubeLogo size={14} />,
    label: 'YouTube',
    accent: 'text-red-600',
    bg: 'bg-[#FFE8E8]',
  },
  TEXT: {
    icon: <TextT size={14} />,
    label: 'Text',
    accent: 'text-[#00B87C]',
    bg: 'bg-[#EAFFF6]',
  },
  MARKDOWN: {
    icon: <TextT size={14} />,
    label: 'Markdown',
    accent: 'text-[#6C47FF]',
    bg: 'bg-[#EDE9FE]',
  },
};

function StatusBadge({ status }: { status: Source['status'] }) {
  if (status === 'READY')
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full border-[1.5px] border-[#00B87C] bg-[#EAFFF6] px-1.5 py-0.5 text-[9px] font-black text-[#00B87C]">
        <CheckCircle size={8} /> Ready
      </span>
    );
  if (status === 'PROCESSING')
    return (
      <span className="inline-flex items-center gap-0.5 rounded-full border-[1.5px] border-amber-500 bg-amber-50 px-1.5 py-0.5 text-[9px] font-black text-amber-600">
        <Loader size={8} className="animate-spin" /> Processing
      </span>
    );
  if (status === 'PENDING')
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

interface SourcesPanelProps {
  workspaceId: string;
  onClose?: () => void;
}

export function SourcesPanel({ workspaceId, onClose }: SourcesPanelProps) {
  const [addOpen, setAddOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const { data: sourceList, isPending } = useSources(workspaceId);
  const deleteSource = useDeleteSource();

  if (isPending || !sourceList) {
    return <div>Loading...</div>;
  }

  const readyCount = sourceList.filter(s => s.status === 'READY').length;

  const handleDeleteSource = async (workspaceId: string, sourceId: string) => {
    try {
      await deleteSource.mutateAsync({
        workspaceId,
        sourceId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-full w-full shrink-0 flex-col border-l-[3px] border-black bg-[#FFFBF0] md:w-[260px]">
      <div className="flex items-center justify-between border-b-[2px] border-black px-3 py-3.5">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black tracking-wide text-black uppercase">
            Sources
          </span>
          {sourceList.length > 0 && (
            <span className="rounded-full border-[1.5px] border-black bg-[#EDE9FE] px-1.5 py-0.5 text-[9px] font-black text-[#6C47FF]">
              {readyCount}/{sourceList.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAddOpen(true)}
            className="flex size-6 items-center justify-center rounded-md border-[2px] border-black bg-white shadow-[1px_1px_0px_#000] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
          >
            <Plus size={12} />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="flex size-6 items-center justify-center rounded-md border-[2px] border-black bg-white shadow-[1px_1px_0px_#000] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="px-2.5 pt-2.5 pb-1.5">
        <button
          onClick={() => setAddOpen(true)}
          className="flex w-full items-center gap-1.5 rounded-lg border-[2px] border-dashed border-black/30 px-2.5 py-1.5 text-xs font-bold text-gray-500 transition-all hover:border-black hover:bg-white hover:text-black hover:shadow-[2px_2px_0px_#000]"
        >
          <Plus size={12} className="shrink-0" />
          Add source
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2.5 py-1">
        {sourceList.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2.5 py-10 text-center">
            <div className="flex size-9 items-center justify-center rounded-xl border-[2px] border-black bg-white shadow-[2px_2px_0px_#000]">
              <FileText size={16} className="text-black" />
            </div>
            <div>
              <p className="text-xs font-black text-black">No sources</p>
              <p className="mt-0.5 text-[10px] font-semibold text-gray-500">
                Add files, websites or videos
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 py-1">
            {sourceList.map(src => {
              const meta = SOURCE_META[src.type] || {
                icon: <FileText size={14} />,
                label: src.type || 'Document',
                accent: 'text-gray-500',
                bg: 'bg-gray-100',
              };
              return (
                <div
                  key={src.id}
                  className="group relative flex items-center gap-2 rounded-lg border-[2px] border-black bg-white px-2.5 py-2 shadow-[2px_2px_0px_#000]"
                >
                  <div
                    className={cn(
                      'flex size-6 shrink-0 items-center justify-center rounded-md border-[1.5px] border-black',
                      meta.bg,
                    )}
                  >
                    <span className={meta.accent}>{meta.icon}</span>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-[11px] leading-tight font-black text-black">
                      {src.title}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={src.status} />
                      {src.url && (
                        <span className="max-w-[80px] truncate text-[9px] font-semibold text-gray-400">
                          {src.url.replace(/^https?:\/\//, '').split('/')[0]}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="relative shrink-0">
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === src.id ? null : src.id)
                      }
                      className="flex size-5 items-center justify-center rounded-md opacity-0 transition-all group-hover:opacity-100 hover:bg-gray-100"
                    >
                      <MoreHorizontal size={11} />
                    </button>
                    {openMenu === src.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenMenu(null)}
                        />
                        <div className="absolute top-full right-0 z-20 mt-1 w-28 overflow-hidden rounded-lg border-[2px] border-black bg-white shadow-[2px_2px_0px_#000]">
                          <div className="p-1">
                            <button
                              onClick={() => {
                                handleDeleteSource(workspaceId, src.id);
                                setOpenMenu(null);
                              }}
                              className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-bold text-[#FF6B6B] transition-colors hover:bg-[#FFF0F0]"
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

      {sourceList.length > 0 && (
        <div className="border-t-[2px] border-black px-3 py-1.5">
          <p className="text-[9px] font-black tracking-wide text-gray-400 uppercase">
            {readyCount} ready · {sourceList.length - readyCount} processing
          </p>
        </div>
      )}

      {addOpen && (
        <AddSourceDialog
          setAddOpen={setAddOpen}
          onClose={() => setAddOpen(false)}
          workspaceId={workspaceId}
        />
      )}
    </div>
  );
}

function AddSourceDialog({
  onClose,
  setAddOpen,
  workspaceId,
}: {
  onClose: () => void;
  setAddOpen: React.Dispatch<React.SetStateAction<boolean>>;
  workspaceId: string;
}) {
  const [tab, setTab] = useState<'file' | 'website' | 'youtube' | 'text'>(
    'file',
  );
  const [file, setFile] = useState<File | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [websiteTitle, setWebsiteTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [youtubeTitle, setYoutubeTitle] = useState('');
  const [textTitle, setTextTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [textType, setTextType] = useState<'TEXT' | 'MARKDOWN'>('TEXT');
  const [fileError, setFileError] = useState<string | null>(null);
  const [websiteError, setWebsiteError] = useState<string | null>(null);
  const [youtubeError, setYoutubeError] = useState<string | null>(null);
  const [textTitleError, setTextTitleError] = useState<string | null>(null);
  const [textContentError, setTextContentError] = useState<string | null>(null);

  const createFileSource = useUploadFileSource();
  const createWebsiteSource = useUploadWebsiteSource();
  const createYoutubeSource = useUploadYoutubeSource();
  const createTextSource = useUploadTextSource();

  const isUploading =
    createFileSource.isPending ||
    createWebsiteSource.isPending ||
    createYoutubeSource.isPending ||
    createTextSource.isPending;

  const tabs: { id: typeof tab; label: string; icon: React.ReactNode }[] = [
    { id: 'file', label: 'FILE', icon: <FileText size={13} /> },
    { id: 'website', label: 'Website', icon: <Globe size={13} /> },
    { id: 'youtube', label: 'YouTube', icon: <YoutubeLogo size={13} /> },
    { id: 'text', label: 'Text', icon: <TextT size={13} /> },
  ];

  const ALLOWED_FILE_TYPES = ['.pdf', '.txt', '.md'];

  const YOUTUBE_HOSTS = [
    'youtube.com',
    'www.youtube.com',
    'm.youtube.com',
    'music.youtube.com',
    'youtu.be',
  ];

  const MAX_TEXT_CHARS = 100_000; // match your backend limit
  const MAX_TITLE_CHARS = 200;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    const extension = '.' + selectedFile.name.split('.').pop()?.toLowerCase();

    if (!ALLOWED_FILE_TYPES.includes(extension)) {
      setFile(null);
      setFileError('Only PDF, TXT, and MD files are allowed.');
      e.target.value = '';
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setFile(null);
      setFileError('File is too large. It must be under 10 MB.');
      e.target.value = '';
      return;
    }

    setFileError(null);
    setFile(selectedFile);
  };

  const normalizeUrl = (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return '';
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  };

  const validateWebsiteUrl = (input: string): string | null => {
    if (!input.trim()) return 'Please enter a website URL.';

    try {
      const url = new URL(normalizeUrl(input));

      if (!['http:', 'https:'].includes(url.protocol)) {
        return 'URL must start with http:// or https://';
      }
      // needs a real domain like example.com (rejects "https://abc")
      if (!url.hostname.includes('.')) {
        return 'Please enter a valid website URL.';
      }
      return null;
    } catch {
      return 'Please enter a valid website URL.';
    }
  };

  const validateYoutubeUrl = (input: string): string | null => {
    if (!input.trim()) return 'Please enter a YouTube URL.';

    try {
      const url = new URL(normalizeUrl(input));

      if (!YOUTUBE_HOSTS.includes(url.hostname)) {
        return 'Please enter a valid YouTube link.';
      }

      const isShortLink =
        url.hostname === 'youtu.be' && url.pathname.length > 1;
      const hasVideoParam = !!url.searchParams.get('v');
      const isPathVideo = /^\/(shorts|embed|live)\/[\w-]+/.test(url.pathname);

      if (!isShortLink && !hasVideoParam && !isPathVideo) {
        return "This link doesn't point to a specific video.";
      }
      return null;
    } catch {
      return 'Please enter a valid YouTube link.';
    }
  };

  const validateText = (title: string, content: string) => {
    const errors: { title?: string; content?: string } = {};

    if (!title.trim()) errors.title = 'Please enter a title.';
    else if (title.trim().length > MAX_TITLE_CHARS)
      errors.title = `Title must be under ${MAX_TITLE_CHARS} characters.`;

    if (!content.trim()) errors.content = 'Please enter some content.';
    else if (content.length > MAX_TEXT_CHARS)
      errors.content = `Content is too long. Max ${MAX_TEXT_CHARS.toLocaleString()} characters.`;

    return errors;
  };

  const handleFileSourceUpload = async () => {
    try {
      if (!file) {
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      await createFileSource.mutateAsync({
        workspaceId,
        formData,
      });
      setAddOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleWebsiteSourceUpload = async () => {
    const error = validateWebsiteUrl(websiteUrl);
    if (error) {
      setWebsiteError(error);
      return;
    }

    setWebsiteError(null);

    try {
      await createWebsiteSource.mutateAsync({
        workspaceId,
        data: {
          url: normalizeUrl(websiteUrl),
          title: websiteTitle.trim() || undefined,
        },
      });

      setWebsiteUrl('');
      setWebsiteTitle('');
      setAddOpen(false);
    } catch (err) {
      console.error(err);
      setWebsiteError(
        err instanceof Error && err.message
          ? err.message
          : "Couldn't add this website. Please try again.",
      );
    }
  };

  const handleYoutubeSourceUpload = async () => {
    try {
      const error = validateYoutubeUrl(youtubeUrl);

      if (error) {
        setYoutubeError(error);
        return;
      }

      setYoutubeError(null);

      await createYoutubeSource.mutateAsync({
        workspaceId,
        data: {
          url: normalizeUrl(websiteUrl),
          title: youtubeTitle.trim() || undefined,
        },
      });
      setYoutubeUrl('');
      setYoutubeTitle('');
      setAddOpen(false);
    } catch (error) {
      console.error(error);
      setWebsiteError(
        error instanceof Error && error.message
          ? error.message
          : "Couldn't import this video. Please try again.",
      );
    }
  };

  const handleTextSourceUpload = async () => {
    const errors = validateText(textTitle, textContent);
    setTextTitleError(errors.title ?? null);
    setTextContentError(errors.content ?? null);
    if (errors.title || errors.content) return;

    try {
      await createTextSource.mutateAsync({
        workspaceId,
        data: {
          title: textTitle.trim(),
          content: textContent,
          type: textType,
        },
      });
      setTextTitle('');
      setTextContent('');
      setAddOpen(false);
    } catch (err) {
      console.error(err);
      setTextContentError(
        err instanceof Error && err.message
          ? err.message
          : "Couldn't add this text. Please try again.",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl border-[3px] border-black bg-white shadow-[8px_8px_0px_#000]">
        <div className="flex items-center justify-between border-b-[2px] border-black px-5 py-4">
          <h2 className="text-base font-black text-black">Add source</h2>
          <button
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-lg border-[2px] border-black bg-white shadow-[2px_2px_0px_#000] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex border-b-[2px] border-black">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 border-r-[2px] border-black py-2.5 text-xs font-black transition-colors last:border-r-0',
                tab === t.id
                  ? 'bg-[#6C47FF] text-white'
                  : 'bg-white text-black hover:bg-gray-100',
              )}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === 'file' && (
            <div className="flex flex-col gap-4">
              <label
                htmlFor="file-upload"
                className={cn(
                  'flex cursor-pointer flex-col items-center justify-center rounded-xl border-[2.5px] border-dashed px-6 py-10 transition-all',
                  fileError
                    ? 'border-red-500 bg-red-50'
                    : file
                      ? 'border-[#6C47FF] bg-[#EDE9FE]'
                      : 'border-black/30 hover:border-black hover:bg-gray-50',
                )}
              >
                <FileText size={32} className="mb-2 text-[#FF6B6B]" />

                {file ? (
                  <>
                    <p className="text-sm font-black text-black">{file.name}</p>

                    <p className="mt-0.5 text-xs font-semibold text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-black text-black">
                      Drop file here or click
                    </p>

                    <p className="mt-0.5 text-xs font-semibold text-gray-500">
                      PDF, TXT, or MD · Max 10 MB
                    </p>
                  </>
                )}

                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.txt,.md"
                  className="sr-only"
                  onChange={handleFileChange}
                  aria-invalid={!!fileError}
                  aria-describedby={fileError ? 'file-error' : undefined}
                />
              </label>

              {fileError && (
                <p
                  id="file-error"
                  role="alert"
                  className="flex items-center gap-1.5 text-xs font-bold text-red-600"
                >
                  <AlertCircle size={14} />
                  {fileError}
                </p>
              )}

              {file && (
                <button
                  onClick={() => {
                    setFile(null);
                    setFileError(null);
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black"
                >
                  <X size={12} />
                  Remove file
                </button>
              )}

              <NbButton
                onClick={() => file && handleFileSourceUpload()}
                disabled={!file || isUploading}
              >
                {isUploading ? (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span className="spinner" aria-hidden="true" />
                    Uploading...
                  </span>
                ) : (
                  'Upload File'
                )}
              </NbButton>
            </div>
          )}

          {tab === 'website' && (
            <div className="flex flex-col gap-3">
              <NbInput
                label="URL *"
                type="url"
                placeholder="https://example.com/article"
                value={websiteUrl}
                error={websiteError}
                onChange={e => {
                  setWebsiteUrl(e.target.value);
                  if (websiteError) setWebsiteError(null);
                }}
              />
              <NbInput
                label="Title (optional)"
                placeholder="Auto-detected from page"
                value={websiteTitle}
                onChange={e => setWebsiteTitle(e.target.value)}
              />
              <NbButton
                onClick={handleWebsiteSourceUpload}
                disabled={!websiteUrl.trim() || isUploading}
              >
                {isUploading ? (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span className="spinner" aria-hidden="true" />
                    Importing...
                  </span>
                ) : (
                  'Import Webiste'
                )}
              </NbButton>
            </div>
          )}

          {tab === 'youtube' && (
            <div className="flex flex-col gap-3">
              <NbInput
                label="YouTube URL *"
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={youtubeUrl}
                error={youtubeError}
                onChange={e => {
                  setYoutubeUrl(e.target.value);
                  if (youtubeError) setYoutubeError(null);
                }}
              />
              <NbInput
                label="Title (optional)"
                placeholder="Auto-detected from video"
                value={youtubeTitle}
                onChange={e => setYoutubeTitle(e.target.value)}
              />
              <NbButton
                onClick={handleYoutubeSourceUpload}
                disabled={!youtubeUrl.trim() || isUploading}
              >
                {isUploading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="spinner" aria-hidden="true" />
                    Importing...
                  </span>
                ) : (
                  'Import YouTube'
                )}
              </NbButton>
            </div>
          )}

          {tab === 'text' && (
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                {(['TEXT', 'MARKDOWN'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTextType(t)}
                    className={cn(
                      'flex-1 rounded-lg border-[2px] border-black py-1.5 text-xs font-black shadow-[2px_2px_0px_#000] transition-all',
                      textType === t
                        ? 'translate-x-[2px] translate-y-[2px] bg-[#6C47FF] text-white shadow-none'
                        : 'bg-white text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none',
                    )}
                  >
                    {t === 'TEXT' ? 'Plain text' : 'Markdown'}
                  </button>
                ))}
              </div>
              <NbInput
                label="Title *"
                placeholder="Source title"
                value={textTitle}
                error={textTitleError}
                onChange={e => {
                  setTextTitle(e.target.value);
                  if (textTitleError) setTextTitleError(null);
                }}
              />

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="text-content"
                  className="text-xs font-black tracking-wide text-black uppercase"
                >
                  Content *
                </label>
                <textarea
                  id="text-content"
                  placeholder="Paste your content here…"
                  value={textContent}
                  onChange={e => {
                    setTextContent(e.target.value);
                    if (textContentError) setTextContentError(null);
                  }}
                  rows={5}
                  aria-invalid={!!textContentError}
                  aria-describedby={
                    textContentError ? 'text-content-error' : undefined
                  }
                  className={cn(
                    'w-full resize-none rounded-xl border-[2px] bg-white px-3 py-2 text-sm font-semibold text-black transition-all outline-none placeholder:text-gray-400',
                    'focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none',
                    textContentError
                      ? 'border-red-500 bg-red-50 shadow-[2px_2px_0px_#ef4444]'
                      : 'border-black shadow-[2px_2px_0px_#000]',
                  )}
                />
                <div className="flex items-start justify-between gap-2">
                  {textContentError ? (
                    <p
                      id="text-content-error"
                      role="alert"
                      className="flex items-center gap-1.5 text-xs font-bold text-red-600"
                    >
                      <AlertCircle size={14} />
                      {textContentError}
                    </p>
                  ) : (
                    <span />
                  )}
                  <span className="shrink-0 text-xs font-semibold text-gray-400">
                    {textContent.length.toLocaleString()} /{' '}
                    {MAX_TEXT_CHARS.toLocaleString()}
                  </span>
                </div>
              </div>

              <NbButton
                onClick={handleTextSourceUpload}
                disabled={
                  !textTitle.trim() ||
                  !textContent.trim() ||
                  createTextSource.isPending
                }
              >
                {isUploading ? (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span className="spinner" aria-hidden="true" />
                    Uploading...
                  </span>
                ) : (
                  'Add Text'
                )}
              </NbButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type NbInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string | null;
};

function NbInput({ label, error, className, id, ...props }: NbInputProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={inputId}
        className="text-xs font-black tracking-wide text-black uppercase"
      >
        {label}
      </label>

      <input
        {...props}
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'h-10 w-full rounded-xl border-[2px] bg-white px-3 text-sm font-semibold text-black transition-all outline-none placeholder:text-gray-400',
          'focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none',
          error
            ? 'border-red-500 bg-red-50 shadow-[2px_2px_0px_#ef4444]'
            : 'border-black shadow-[2px_2px_0px_#000]',
          className,
        )}
      />

      {error && (
        <p
          id={errorId}
          role="alert"
          className="flex items-center gap-1.5 text-xs font-bold text-red-600"
        >
          <AlertCircle size={14} />
          {error}
        </p>
      )}
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
      className="w-full rounded-xl border-[2.5px] border-black bg-[#6C47FF] py-2.5 text-sm font-black text-white shadow-[3px_3px_0px_#000] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  );
}
