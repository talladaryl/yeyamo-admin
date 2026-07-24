"use client";

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <circle cx="7" cy="7" r="3.75" stroke="#667085" strokeWidth="1.4" />
      <path d="M10.2 10.2L13 13" stroke="#667085" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
      <path
        d="M9 3.5C6.9 3.5 5.2 5.2 5.2 7.3V9.1C5.2 9.5 5 9.9 4.7 10.2L3.8 11.1C3.3 11.6 3.7 12.5 4.5 12.5H13.5C14.3 12.5 14.7 11.6 14.2 11.1L13.3 10.2C13 9.9 12.8 9.5 12.8 9.1V7.3C12.8 5.2 11.1 3.5 9 3.5Z"
        stroke="#344054"
        strokeWidth="1.4"
      />
      <path d="M7.4 14.2C7.8 14.8 8.3 15 9 15C9.7 15 10.2 14.8 10.6 14.2" stroke="#344054" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4.5 6.5L8 10L11.5 6.5" stroke="#667085" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Topbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="flex items-center justify-end gap-4 px-6 py-4">
        <div className="flex min-w-[380px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
          <SearchIcon />
          <input
            aria-label="Recherche globale"
            placeholder="Rechercher (utilisateurs, lieux, contenus...)"
            className="w-full border-0 bg-transparent px-0 py-0 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-500">
            Ctrl + K
          </span>
        </div>

        <button type="button" className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700">
          <BellIcon />
          <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e30613] px-1 text-[9px] font-bold text-white">
            12
          </span>
        </button>

        <button type="button" className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <img
            src="https://i.pravatar.cc/80?img=68"
            alt="Photo du Super Admin"
            className="h-10 w-10 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="text-left">
            <div className="text-sm font-semibold text-slate-900">Admin Super</div>
            <div className="text-xs text-slate-500">Super Admin</div>
          </div>
          <ChevronDownIcon />
        </button>
      </div>
    </header>
  );
}
