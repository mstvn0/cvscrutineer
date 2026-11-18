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
    <div className="flex min-h-full flex-1 flex-col bg-zinc-950 text-zinc-100">
      <Navbar />
      <div className="mx-auto grid w-full max-w-[1600px] flex-1 lg:grid-cols-[42%_58%] lg:overflow-hidden">
        <div className="min-h-[520px] lg:min-h-0 lg:overflow-y-auto">
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
        <section
          className="min-h-[520px] bg-[#09090b] lg:min-h-0 lg:overflow-hidden"
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
      </div>
    </div>
  );
}
