import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const port = process.env.PORT || 3000;

// Initialize Google GenAI client
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Clean JSON helper
function extractJson(raw: string): any {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return JSON.parse(cleaned);
}

// Resilient Gemini generateContent with retries and fallback
async function generateWithFallback(
  ai: GoogleGenAI,
  options: {
    contents: any;
    config?: any;
    systemInstruction?: string;
  }
) {
  const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: options.contents,
          config: options.config,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} attempt ${attempt + 1} failed:`, err?.message || err);
        const isTransient =
          err?.status === 503 ||
          err?.status === 429 ||
          err?.message?.includes('503') ||
          err?.message?.includes('high demand') ||
          err?.message?.includes('UNAVAILABLE');

        if (isTransient && attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 800));
        } else {
          break; // try next model
        }
      }
    }
  }

  throw lastError || new Error('Failed to generate content from AI models.');
}

// API: Comprehensive Decision Analysis
app.post('/api/analyze', async (req, res) => {
  try {
    const { decision, options, context, userPriorities } = req.body;

    if (!decision || typeof decision !== 'string' || !decision.trim()) {
      return res.status(400).json({ error: 'Please provide a decision dilemma to analyze.' });
    }

    const ai = getAiClient();

    const prompt = `You are "The Tie Breaker", an executive-level decision strategist and cognitive bias consultant.
Analyze this dilemma with precision, empathy, and rigorous analytical frameworks:
Decision Dilemma: "${decision.trim()}"
${options && Array.isArray(options) && options.filter(Boolean).length > 0 ? `Specific Options Identified by User: ${options.filter(Boolean).join(', ')}` : 'Auto-detect the most viable, realistic 2-3 options.'}
${context ? `User Context & Constraints: "${context.trim()}"` : ''}
${userPriorities ? `Key User Priorities & Values: "${userPriorities.trim()}"` : ''}

Generate a comprehensive decision package in JSON matching this exact structure:
1. Identify 2 to 3 distinct, well-defined options (with id 'opt_1', 'opt_2', etc., catchy name, concise description, and quick badge tag).
2. For each option, provide balanced Pros and Cons:
   - 3 to 5 Pros with clear impact ('high'|'medium'|'low'), category ('Financial', 'Growth', 'Wellbeing', 'Feasibility', 'Time', or 'Strategic'), title, and concrete explanation.
   - 3 to 5 Cons with clear impact ('high'|'medium'|'low'), category, title, and concrete explanation.
   - A net assessment summarizing the core tradeoff of this option.
3. A Comparison Matrix with 4 to 6 relevant evaluation criteria (e.g., Financial ROI, Work-Life Balance / Stress, Long-term Upside, Execution Risk, Flexibility, Speed to Value).
   - Default weight from 1 to 5.
   - Score for each option from 1 to 10 with a 1-sentence reasoning.
4. A SWOT Analysis matrix for each option:
   - Strengths (2-3 items)
   - Weaknesses (2-3 items)
   - Opportunities (2-3 items)
   - Threats (2-3 items)
   - Key strategic takeaway
5. The Tie Breaker Verdict:
   - Recommended option ID (choose the most compelling path while acknowledging the key nuance).
   - Verdict headline (bold, memorable statement).
   - In-depth verdict rationale (clear, objective, synthesized logic).
   - Confidence score (number between 65 and 95).
   - Decision type: either "Type 1 (Irreversible / One-Way Door)" or "Type 2 (Reversible / Two-Way Door)".
   - Reversibility advice: how easy it is to undo or pivot if things go wrong.
   - Decision triggers: "If X is true for you, choose Option A; If Y is true, choose Option B".
   - 10/10/10 analysis: how this choice feels in 10 minutes, 10 months, and 10 years.
   - Pre-mortem worst case & safeguard: what's the worst failure mode and how to hedge against it.
   - Best friend advice: the unfiltered, warm, practical advice you'd give over coffee to your closest friend.`;

    const response = await generateWithFallback(ai, {
      contents: prompt,
      config: {
        systemInstruction:
          'You are The Tie Breaker, a world-class decision theorist who breaks complex dilemmas into rigorous, actionable, beautifully clear pros/cons, comparison matrices, SWOT analysis, and definitive tie-breaking verdicts. Return only valid JSON.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING, description: 'Refined, punchy decision title' },
            summary: { type: Type.STRING, description: '1-2 sentence overview of the dilemma and stakes' },
            category: { type: Type.STRING, description: 'E.g. Career, Finance, Lifestyle, Tech, Relationship, Business' },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  tag: { type: Type.STRING },
                },
                required: ['id', 'name', 'description', 'tag'],
              },
            },
            prosCons: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  optionId: { type: Type.STRING },
                  optionName: { type: Type.STRING },
                  netAssessment: { type: Type.STRING },
                  pros: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                        impact: { type: Type.STRING },
                        category: { type: Type.STRING },
                      },
                      required: ['id', 'title', 'explanation', 'impact', 'category'],
                    },
                  },
                  cons: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        explanation: { type: Type.STRING },
                        impact: { type: Type.STRING },
                        category: { type: Type.STRING },
                      },
                      required: ['id', 'title', 'explanation', 'impact', 'category'],
                    },
                  },
                },
                required: ['optionId', 'optionName', 'netAssessment', 'pros', 'cons'],
              },
            },
            comparisonMatrix: {
              type: Type.OBJECT,
              properties: {
                criteria: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      category: { type: Type.STRING },
                      description: { type: Type.STRING },
                      weight: { type: Type.INTEGER },
                      scores: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            optionId: { type: Type.STRING },
                            score: { type: Type.INTEGER },
                            reasoning: { type: Type.STRING },
                          },
                          required: ['optionId', 'score', 'reasoning'],
                        },
                      },
                    },
                    required: ['id', 'name', 'category', 'description', 'weight', 'scores'],
                  },
                },
              },
              required: ['criteria'],
            },
            swot: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  optionId: { type: Type.STRING },
                  optionName: { type: Type.STRING },
                  strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                  weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                  opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                  threats: { type: Type.ARRAY, items: { type: Type.STRING } },
                  keyTakeaway: { type: Type.STRING },
                },
                required: ['optionId', 'optionName', 'strengths', 'weaknesses', 'opportunities', 'threats', 'keyTakeaway'],
              },
            },
            tieBreakerVerdict: {
              type: Type.OBJECT,
              properties: {
                winnerOptionId: { type: Type.STRING },
                verdictHeadline: { type: Type.STRING },
                verdictRationale: { type: Type.STRING },
                confidenceScore: { type: Type.INTEGER },
                decisionType: { type: Type.STRING },
                reversibilityAdvice: { type: Type.STRING },
                triggers: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      optionId: { type: Type.STRING },
                      optionName: { type: Type.STRING },
                      condition: { type: Type.STRING },
                      recommendedAction: { type: Type.STRING },
                    },
                    required: ['optionId', 'optionName', 'condition', 'recommendedAction'],
                  },
                },
                tenTenTen: {
                  type: Type.OBJECT,
                  properties: {
                    tenMinutes: { type: Type.STRING },
                    tenMonths: { type: Type.STRING },
                    tenYears: { type: Type.STRING },
                  },
                  required: ['tenMinutes', 'tenMonths', 'tenYears'],
                },
                worstCasePreMortem: {
                  type: Type.OBJECT,
                  properties: {
                    scenario: { type: Type.STRING },
                    safeguard: { type: Type.STRING },
                  },
                  required: ['scenario', 'safeguard'],
                },
                bestFriendAdvice: { type: Type.STRING },
              },
              required: [
                'winnerOptionId',
                'verdictHeadline',
                'verdictRationale',
                'confidenceScore',
                'decisionType',
                'reversibilityAdvice',
                'triggers',
                'tenTenTen',
                'worstCasePreMortem',
                'bestFriendAdvice',
              ],
            },
          },
          required: ['title', 'summary', 'category', 'options', 'prosCons', 'comparisonMatrix', 'swot', 'tieBreakerVerdict'],
        },
      },
    });

    const parsed = extractJson(response.text || '{}');
    if (!parsed.id) {
      parsed.id = 'dec_' + Date.now();
    }
    parsed.createdAt = new Date().toISOString();
    parsed.rawDecision = decision;

    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/analyze:', error);
    res.status(500).json({
      error: error.message || 'Failed to analyze decision. Please try again.',
    });
  }
});

// API: Intuition Stress-Test / Blind Gut Check Challenge
app.post('/api/gut-check', async (req, res) => {
  try {
    const { decision, options } = req.body;
    if (!decision) {
      return res.status(400).json({ error: 'Decision title required.' });
    }

    const ai = getAiClient();
    const prompt = `For the dilemma "${decision}" between options: ${JSON.stringify(options)}, generate 3 provocative, deep gut-check questions designed to short-circuit analytical paralysis and reveal what the person's subconscious truly wants.
Return JSON with an array 'questions', each with 'id', 'question', 'reveals', and 'scenario'.`;

    const response = await generateWithFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  reveals: { type: Type.STRING },
                  scenario: { type: Type.STRING },
                },
                required: ['id', 'question', 'reveals', 'scenario'],
              },
            },
          },
          required: ['questions'],
        },
      },
    });

    res.json(extractJson(response.text || '{"questions":[]}'));
  } catch (err: any) {
    console.error('Error in /api/gut-check:', err);
    res.status(500).json({ error: err.message || 'Failed to generate gut-check questions.' });
  }
});

// API: Ask Follow-up / Refine Decision
app.post('/api/ask-advisor', async (req, res) => {
  try {
    const { decisionContext, userQuestion } = req.body;
    if (!userQuestion) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const ai = getAiClient();
    const prompt = `You are The Tie Breaker Advisor. Here is the decision context:
Decision: ${JSON.stringify(decisionContext?.title || '')}
Summary: ${JSON.stringify(decisionContext?.summary || '')}
Options: ${JSON.stringify(decisionContext?.options || [])}
Current Recommendation: ${JSON.stringify(decisionContext?.tieBreakerVerdict?.verdictHeadline || '')}

User's follow-up or what-if scenario:
"${userQuestion}"

Provide a crisp, actionable advisory response (2-3 concise paragraphs with bullet points where appropriate). Focus on:
1. Direct answer to the what-if
2. Impact on the current balance of tradeoffs
3. Concrete action step to test or de-risk the situation`;

    const response = await generateWithFallback(ai, {
      contents: prompt,
    });

    res.json({ answer: response.text || 'No response generated.' });
  } catch (err: any) {
    console.error('Error in /api/ask-advisor:', err);
    res.status(500).json({ error: err.message || 'Failed to get advisory answer.' });
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, () => {
    console.log(`The Tie Breaker server running on port ${port}`);
  });
}

startServer();
