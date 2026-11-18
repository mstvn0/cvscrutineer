'use client';

import { useState } from 'react';
import type { DashboardTabId } from '@/lib/constants';
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
  const [tab, setTab] = useState<DashboardTabId>('knockouts');

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 p-4 lg:p-5">
      <Scoreboard analysis={analysis} />
      <TabBar active={tab} onChange={setTab} analysis={analysis} />
      <div
        className="min-h-0 flex-1 overflow-y-auto pr-1"
        role="tabpanel"
        aria-label={tab}
      >
        {tab === 'knockouts' ? (
          <KnockoutTab rules={analysis.knockoutRules} />
        ) : null}
        {tab === 'drift' ? (
          <DriftTab rows={analysis.semanticDriftAudit} />
        ) : null}
        {tab === 'recruiter' ? (
          <RecruiterTab queries={analysis.recruiterSearchQueries} />
        ) : null}
      </div>
    </div>
  );
}
