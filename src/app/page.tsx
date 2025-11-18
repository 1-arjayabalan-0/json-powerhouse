import Image from "next/image";
import Header from "./components/Header";
import SideNav from "./components/SideNav";
import JSONFormatter from "./tools/json-formatter/page";

export default function Home() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-[#EAEAEA]">
      <div className="relative flex h-screen w-full flex-col overflow-hidden">
        <Header />
        <div className="flex h-full min-h-0 grow">
          {/* <!-- SideNavBar --> */}
          <SideNav />
          {/* <!-- Main Content --> */}
          <main className="flex flex-1 flex-col overflow-hidden">
            {/* <!-- PageHeading --> */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-6">
              <div className="flex flex-col gap-1">
                <h1 className="text-white text-2xl font-bold leading-tight tracking-[-0.033em]">JSON Formatter</h1>
                <p className="text-white/60 text-sm font-normal leading-normal">Paste your JSON below to format it instantly.</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-9 px-3 bg-white/10 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/20">
                  <span className="material-symbols-outlined text-lg">tune</span>
                  <span className="truncate">Settings</span>
                </button>
              </div>
            </div>
            {/* <!-- Dual Pane Editor --> */}
            <JSONFormatter />
            {/* <!-- Bottom Action Bar --> */}
            <div className="flex shrink-0 items-center justify-between gap-4 border-t border-white/10 bg-background-dark/80 p-3 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90">
                  <span className="material-symbols-outlined text-xl">format_align_left</span>
                  <span className="truncate">Format</span>
                </button>
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-white/10 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/20">
                  <span className="material-symbols-outlined text-xl">task_alt</span>
                  <span className="truncate">Validate</span>
                </button>
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-white/10 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/20">
                  <span className="material-symbols-outlined text-xl">delete</span>
                  <span className="truncate">Clear</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-white/10 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/20">
                  <span className="material-symbols-outlined text-xl">content_copy</span>
                  <span className="truncate">Copy</span>
                </button>
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-white/10 text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-white/20">
                  <span className="material-symbols-outlined text-xl">download</span>
                  <span className="truncate">Download</span>
                </button>
              </div>
            </div>
          </main>
        </div>
        {/* <!-- AI Assistant FAB --> */}
        <button className="absolute bottom-20 right-6 flex h-14 w-14 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary shadow-lg shadow-primary/30 hover:bg-primary/90">
          <span className="material-symbols-outlined text-2xl text-white">auto_fix_high</span>
        </button>
      </div>
    </div>
  );
}
