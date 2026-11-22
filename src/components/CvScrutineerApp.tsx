'use client';

import { useState } from 'react';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { LoadingSkeleton } from '@/components/dashboard/LoadingSkeleton';
import { ResultsDashboard } from '@/components/dashboard/ResultsDashboard';
import { InputWorkspace } from '@/components/InputWorkspace';
import { Navbar } from '@/components/Navbar';
import { useScrutinize } from '@/hooks/useScrutinize';
import { getSampleScenario, SAMPLE_SCENARIOS } from '@/lib/sampleData';

const DEFAULT_SAMPLE_ID = 'senior-frontend-vector-drift';

export function CvScrutineerApp() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const {
    status,
    analysis,
    error,
    stage,
    scrutinize,
    resetResults,
  } = useScrutinize();

  const isLoading = status === 'loading';

  function loadSample(id: string) {
    const sample = getSampleScenario(id);
    if (!sample) return;
    setResume(sample.resume);
    setJobDescription(sample.jobDescription);
    resetResults();
  }

  function handleClear() {
    setResume('');
    setJobDescription('');
    resetResults();
  }

  async function handleScrutinize() {
    await scrutinize(resume, jobDescription);
  }

  async function handleLoadAndScrutinize() {
    const sample =
      getSampleScenario(DEFAULT_SAMPLE_ID) ?? SAMPLE_SCENARIOS[0];
    if (!sample) return;
    setResume(sample.resume);
    setJobDescription(sample.jobDescription);
    await scrutinize(sample.resume, sample.jobDescription);
  }

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col bg-zinc-950 text-zinc-100">
      <Navbar />
      <div className="mx-auto flex w-full max-w-[1600px] min-h-0 min-w-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
        {/* Results first on small screens (higher); input stays left on desktop. */}
        <section
          className="order-1 flex w-full min-h-[18rem] min-w-0 shrink-0 flex-col border-b border-zinc-800 bg-[#09090b] lg:order-2 lg:min-h-0 lg:flex-1 lg:shrink lg:overflow-hidden lg:border-b-0"
          aria-label="Forensics dashboard"
        >
          {status === 'idle' || status === 'error' ? (
            <EmptyState
              onLoadAndScrutinize={() => {
                void handleLoadAndScrutinize();
              }}
              disabled={isLoading}
            />
          ) : null}
          {status === 'loading' ? <LoadingSkeleton /> : null}
          {status === 'success' && analysis ? (
            <ResultsDashboard analysis={analysis} />
          ) : null}
        </section>
        <div className="order-2 flex w-full min-w-0 shrink-0 flex-col overflow-x-hidden lg:order-1 lg:h-full lg:w-[42%] lg:min-h-0 lg:shrink lg:overflow-hidden lg:border-r lg:border-zinc-800">
          <InputWorkspace
            resume={resume}
            jobDescription={jobDescription}
            onResumeChange={setResume}
            onJobDescriptionChange={setJobDescription}
            onLoadSample={loadSample}
            onClear={handleClear}
            onScrutinize={() => {
              void handleScrutinize();
            }}
            isLoading={isLoading}
            stage={stage}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
