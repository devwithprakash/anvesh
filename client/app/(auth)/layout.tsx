import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FFFBF0] flex flex-col">
      {/* Top bar */}
      <header className="w-full border-b-[3px] border-black bg-[#FFFBF0]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
          <a href="/" className="flex items-center gap-2.5 shrink-0">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg border-2 border-black bg-[#6C47FF] text-white font-black text-sm shadow-[3px_3px_0px_#000] select-none">
              N
            </span>
            <span className="font-black text-lg text-black tracking-tight">Notebook</span>
          </a>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>

      {/* Footer strip */}
      <footer className="border-t-[3px] border-black bg-[#FFFBF0] py-4 text-center text-xs font-bold text-black/50">
        © {new Date().getFullYear()} Notebook. All rights reserved.
      </footer>
    </div>
  );
}
