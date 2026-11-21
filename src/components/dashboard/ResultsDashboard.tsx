'use client';

import { useCallback, useRef, useState } from 'react';
import type { DashboardTabId } from '@/lib/constants';
import {
  activeFocusLabel,
  defaultDashboardTab,
  navigationFromGate,
  type DriftFocus,
  type GateMetricKey,
  type KnockoutFocus,
  type RecruiterFocus,
} from '@/lib/dashboardNavigation';
import type { AnalysisResult } from '@/lib/schemas/analysis';
import { FocusFilterBanner } from './FocusFilterBanner';
import { Scoreboard } from './Scoreboard';
import { ScrollHintPanel } from './ScrollHintPanel';
import { TabBar } from './TabBar';
import { DriftTab } from './tabs/DriftTab';
import { KnockoutTab } from './tabs/KnockoutTab';
import { RecruiterTab } from './tabs/RecruiterTab';

type ResultsDashboardProps = {
  analysis: AnalysisResult;
};

export function ResultsDashboard({ analysis }: ResultsDashboardProps) {
  const [tab, setTab] = useState<DashboardTabId>(() =>
    defaultDashboardTab(analysis),
  );
  const [knockoutFocus, setKnockoutFocus] = useState<KnockoutFocus>('all');
  const [driftFocus, setDriftFocus] = useState<DriftFocus>('all');
  const [recruiterFocus, setRecruiterFocus] = useState<RecruiterFocus>('all');
  const scrollToTopRef = useRef<(() => void) | null>(null);

  const handleScrollTopReady = useCallback((fn: () => void) => {
    scrollToTopRef.current = fn;
  }, []);

  function focusPanel() {
    scrollToTopRef.current?.();
  }

  function clearFocus() {
    setKnockoutFocus('all');
    setDriftFocus('all');
    setRecruiterFocus('all');
    focusPanel();
  }

  function handleGateNavigate(key: GateMetricKey) {
    const next = navigationFromGate(key);
    setTab(next.tab);
    setKnockoutFocus(next.knockoutFocus);
    setDriftFocus(next.driftFocus);
    setRecruiterFocus(next.recruiterFocus);
    focusPanel();
  }

  function handleTabChange(id: DashboardTabId) {
    setTab(id);
    setKnockoutFocus('all');
    setDriftFocus('all');
    setRecruiterFocus('all');
    focusPanel();
  }

  const filterLabel = activeFocusLabel({
    tab,
    knockoutFocus,
    driftFocus,
    recruiterFocus,
  });

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col gap-2 overflow-hidden p-3 lg:gap-2.5 lg:p-4">
      <div className="min-w-0 shrink-0">
        <Scoreboard analysis={analysis} onGateNavigate={handleGateNavigate} />
      </div>

      <div className="flex min-h-[14rem] min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-zinc-800 bg-[#09090b]">
        <div className="min-w-0 shrink-0 border-b border-zinc-800 px-2.5 pt-2 pb-1.5">
          <TabBar active={tab} onChange={handleTabChange} analysis={analysis} />
        </div>

        <ScrollHintPanel
          aria-label={tab}
          onScrollTopReady={handleScrollTopReady}
          className="p-2.5 pt-2"
        >
          {filterLabel ? (
            <FocusFilterBanner label={filterLabel} onClear={clearFocus} />
          ) : null}
          {tab === 'knockouts' ? (
            <KnockoutTab
              rules={analysis.knockoutRules}
              focus={knockoutFocus}
            />
          ) : null}
          {tab === 'drift' ? (
            <DriftTab rows={analysis.semanticDriftAudit} focus={driftFocus} />
          ) : null}
          {tab === 'recruiter' ? (
            <RecruiterTab
              queries={analysis.recruiterSearchQueries}
              focus={recruiterFocus}
            />
          ) : null}
        </ScrollHintPanel>
      </div>
    </div>
  );
}
