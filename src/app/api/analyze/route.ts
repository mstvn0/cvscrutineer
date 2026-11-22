import { generateObject, APICallError, NoObjectGeneratedError } from 'ai';
import { xai } from '@ai-sdk/xai';
import { ANALYZE_SYSTEM_PROMPT } from '@/lib/analyzeSystemPrompt';
import { withDerivedVerdict } from '@/lib/deriveVerdict';
import { AnalysisFindingsSchema } from '@/lib/schemas/analysis';
import { validateAnalyzeRequest } from '@/lib/validateAnalyzeRequest';

function jsonError(status: number, error: string) {
  return Response.json({ error }, { status });
}

export async function POST(request: Request) {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return jsonError(400, 'Invalid JSON body.');
  }

  const validated = validateAnalyzeRequest(rawBody);
  if (!validated.ok) {
    return jsonError(400, validated.error);
  }

  if (!process.env.XAI_API_KEY) {
    return jsonError(500, 'Server missing XAI_API_KEY configuration.');
  }

  const { resume, jobDescription } = validated.data;

  try {
    const { object } = await generateObject({
      model: xai('grok-3-mini'),
      schema: AnalysisFindingsSchema,
      schemaName: 'CVScrutineerFindings',
      schemaDescription:
        'ATS findings: knockouts, semantic drift labels, and recruiter Boolean coverage. No numeric scores.',
      system: ANALYZE_SYSTEM_PROMPT,
      prompt: `Analyze this candidate against the job description.

=== JOB DESCRIPTION ===
${jobDescription}

=== RESUME ===
${resume}

Return structured findings only (no probabilities or numeric scores).`,
    });

    return Response.json(withDerivedVerdict(object, resume));
  } catch (error) {
    if (APICallError.isInstance(error) && error.statusCode === 429) {
      return jsonError(
        429,
        'Rate limit exceeded. Please wait a moment and try again.',
      );
    }

    if (NoObjectGeneratedError.isInstance(error)) {
      return jsonError(
        400,
        'Could not produce a valid analysis from the model output. Try shortening or clarifying the inputs.',
      );
    }

    if (APICallError.isInstance(error) && error.statusCode === 400) {
      return jsonError(
        400,
        error.message || 'The model rejected this request as invalid.',
      );
    }

    console.error('[api/analyze]', error);
    return jsonError(
      500,
      'Unexpected failure while analyzing resume. Please try again.',
    );
  }
}
