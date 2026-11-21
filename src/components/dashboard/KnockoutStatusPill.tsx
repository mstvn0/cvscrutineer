import type { AnalysisResult } from '@/lib/schemas/analysis';

const STYLES: Record<
  AnalysisResult['knockoutStatus'],
  { label: string; className: string }
> = {
  PASS: {
    label: 'PASS',
    className:
      'border-emerald-500/40 bg-emerald-500/15 text-emerald-300 ring-emerald-500/20',
  },
  AT_RISK: {
    label: 'AT_RISK',
    className:
      'border-amber-500/40 bg-amber-500/15 text-amber-300 ring-amber-500/20',
  },
  LIKELY_REJECTED: {
    label: 'LIKELY_REJECTED',
    className:
      'border-rose-500/40 bg-rose-500/15 text-rose-300 ring-rose-500/20',
  },
};

export function KnockoutStatusPill({
  status,
}: {
  status: AnalysisResult['knockoutStatus'];
}) {
  const style = STYLES[status];
  return (
    <span
      className={`inline-flex max-w-full items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-wide ring-1 break-words ${style.className}`}
    >
      <span className="truncate">{style.label}</span>
    </span>
  );
}
