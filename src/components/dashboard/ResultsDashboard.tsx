'use client';

import { useRef, useState } from 'react';
import type { DashboardTabId } from '@/lib/constants';
import {
  defaultDashboardTab,
  navigationFromGate,
  type DriftFocus,
  type GateMetricKey,
  type KnockoutFocus,
  type RecruiterFocus,
} from '@/lib/dashboardNavigation';
import type { AnalysisResult } from '@/lib/schemas/analysis';
import { Scoreboard } from './Scoreboard';
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
  const panelRef = useRef<HTMLDivElement>(null);

  function focusPanel() {
    // Scroll only inside the results pane — avoid document scrollIntoView,
    // which reflows the shared split-pane height and shrinks the input textareas.
    if (panelRef.current) {
      panelRef.current.scrollTop = 0;
    }
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
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 p-4 lg:p-5">
      <Scoreboard analysis={analysis} onGateNavigate={handleGateNavigate} />
      <TabBar active={tab} onChange={handleTabChange} analysis={analysis} />
      <div
        ref={panelRef}
        className="min-h-0 flex-1 overflow-y-auto pr-1"
        role="tabpanel"
        aria-label={tab}
      >
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
      </div>
    </div>
  );
}
