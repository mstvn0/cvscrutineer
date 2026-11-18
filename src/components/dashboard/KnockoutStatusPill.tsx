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
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ring-1 ${style.className}`}
    >
      Knockout: {style.label}
    </span>
  );
}
