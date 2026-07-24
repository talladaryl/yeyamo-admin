export function GenderDonutChart() {
  return (
    <div className="flex items-center justify-center gap-8 py-4">
      <div className="relative h-40 w-40 rounded-full bg-[conic-gradient(#e11d2e_0_52%,#d1d5db_52%_100%)]">
        <div className="absolute inset-[18px] rounded-full bg-white" />
      </div>
      <div className="space-y-8">
        <div>
          <div className="text-[34px] font-semibold tracking-tight text-slate-950">52%</div>
          <div className="text-sm text-slate-500">Femmes</div>
        </div>
        <div>
          <div className="text-[34px] font-semibold tracking-tight text-slate-950">48%</div>
          <div className="text-sm text-slate-500">Hommes</div>
        </div>
      </div>
    </div>
  );
}
