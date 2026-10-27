import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Coins,
  BrainCircuit,
  Compass,
  ArrowRight,
  Flame,
  HelpCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { DecisionAnalysis, GutCheckQuestion } from '../types';

interface TieBreakerLabProps {
  decision: DecisionAnalysis;
}

export const TieBreakerLab: React.FC<TieBreakerLabProps> = ({ decision }) => {
  const { options } = decision;

  // Coin Flip State
  const [flipping, setFlipping] = useState(false);
  const [coinResult, setCoinResult] = useState<string | null>(null);
  const [coinStage, setCoinStage] = useState<'idle' | 'in_air' | 'landed'>('idle');

  // Gut Check Probe State
  const [probes, setProbes] = useState<GutCheckQuestion[]>([]);
  const [loadingProbes, setLoadingProbes] = useState(false);
  const [probeAnswers, setProbeAnswers] = useState<Record<string, string>>({});

  const handleCoinFlip = () => {
    if (flipping) return;
    setFlipping(true);
    setCoinStage('in_air');
    setCoinResult(null);

    // After 2.5s landing
    setTimeout(() => {
      const randomOption = options[Math.floor(Math.random() * options.length)];
      setCoinResult(randomOption.name);
      setCoinStage('landed');
      setFlipping(false);

      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // ignore
      }
    }, 2400);
  };

  const handleFetchGutCheckProbes = async () => {
    setLoadingProbes(true);
    try {
      const res = await fetch('/api/gut-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision: decision.title,
          options: options.map((o) => o.name),
        }),
      });
      const data = await res.json();
      if (data.questions) {
        setProbes(data.questions);
      }
    } catch (err) {
      console.error('Failed to load gut check probes:', err);
    } finally {
      setLoadingProbes(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <BrainCircuit className="w-5 h-5 text-indigo-400" />
          <span className="text-xs uppercase tracking-wider font-bold text-indigo-300">
            Cognitive Deadlock Breaker
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-white">
          The Intuition & Subconscious Laboratory
        </h3>
        <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-2xl leading-relaxed">
          When logic yields a 50/50 stalemate, cognitive scientists use specific psychological forcing
          functions to reveal what you subconsciously already know.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tool 1: The Freud Coin Toss Test */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">
                  The Intuition Coin Toss
                </h4>
                <span className="text-xs text-slate-500">
                  Sigmund Freud's Subconscious Preference Hack
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              The goal is <strong>not</strong> to let the coin decide your life. The goal is to
              observe your body's emotional response while the coin is in the air.
            </p>

            {/* Coin flip arena */}
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col items-center justify-center min-h-[180px] text-center">
              <div
                className={`w-20 h-20 rounded-full border-4 border-amber-300 bg-gradient-to-tr from-amber-400 to-amber-200 shadow-md flex items-center justify-center text-slate-900 font-black text-2xl transition-all ${
                  flipping ? 'animate-bounce scale-110 rotate-180' : ''
                }`}
              >
                ⚖️
              </div>

              {coinStage === 'in_air' && (
                <div className="mt-4 animate-pulse">
                  <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                    Coin is in the air...
                  </div>
                  <div className="text-sm font-semibold text-slate-800 mt-1">
                    Quick! What result are you secretly hoping for?
                  </div>
                </div>
              )}

              {coinStage === 'landed' && coinResult && (
                <div className="mt-4 animate-fade-in">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Landed on:
                  </span>
                  <div className="text-lg font-extrabold text-indigo-700">{coinResult}</div>
                  <p className="text-xs text-slate-600 mt-2 max-w-xs">
                    Did you feel a spark of relief? Or a twinge of disappointment and an urge to
                    flip again? <em>That feeling is your real answer.</em>
                  </p>
                </div>
              )}

              {coinStage === 'idle' && (
                <div className="mt-4 text-xs text-slate-500">
                  Flip between: {options.map((o) => o.name).join(' vs ')}
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Notice your gut reaction</span>
            <button
              onClick={handleCoinFlip}
              disabled={flipping}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all hover:scale-105 disabled:opacity-50"
            >
              <Coins className="w-3.5 h-3.5" />
              <span>{flipping ? 'Spinning in Air...' : 'Flip The Coin'}</span>
            </button>
          </div>
        </div>

        {/* Tool 2: Jeff Bezos Regret Minimization & 80-Year-Old Self Test */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">
                  Regret Minimization Framework
                </h4>
                <span className="text-xs text-slate-500">
                  Project yourself to age 80 looking backward
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Jeff Bezos used this exact mental model to leave his lucrative Wall Street hedge fund
              job and found Amazon in 1994:
            </p>

            <blockquote className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs sm:text-sm text-indigo-950 italic leading-relaxed mb-4">
              "I knew that when I was 80, I would not regret trying this and failing. But I knew the
              one thing I might regret forever was not having tried at all."
            </blockquote>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <strong className="text-slate-900">Which option has higher regret risk?</strong>
                <p className="text-slate-500 mt-0.5">
                  Failing at an ambitious experiment almost never produces lifelong regret. Inaction
                  and "what-ifs" produce 80% of deathbed regrets.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <strong className="text-slate-900">The 5-Year Erasure Test:</strong>
                <p className="text-slate-500 mt-0.5">
                  Five years from now, will the short-term discomfort or risk even be remembered?
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tool 3: AI Subconscious Probes */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">
                Deep Subconscious Probes (Tailored AI Diagnostic)
              </h4>
              <p className="text-xs text-slate-500">
                3 provocative scenarios designed specifically for "{decision.title}"
              </p>
            </div>
          </div>

          <button
            onClick={handleFetchGutCheckProbes}
            disabled={loadingProbes}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingProbes ? 'animate-spin' : ''}`} />
            <span>{probes.length > 0 ? 'Generate New Probes' : 'Reveal Gut-Check Probes'}</span>
          </button>
        </div>

        {probes.length === 0 && !loadingProbes && (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <BrainCircuit className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h5 className="font-bold text-slate-700 text-sm">
              Ready to challenge your subconscious?
            </h5>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
              Click below to generate 3 sharp, personalized questions that bypass your cognitive defenses.
            </p>
            <button
              onClick={handleFetchGutCheckProbes}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
            >
              Generate Tailored Probes
            </button>
          </div>
        )}

        {loadingProbes && (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span className="text-xs font-medium text-slate-600">
              Formulating psychological deadlock questions...
            </span>
          </div>
        )}

        {probes.length > 0 && !loadingProbes && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {probes.map((probe, idx) => (
              <div
                key={probe.id || idx}
                className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-5 h-5 rounded-full bg-violet-200 text-violet-800 font-bold text-[10px] flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700">
                      Scenario Test
                    </span>
                  </div>
                  <h5 className="font-bold text-slate-900 text-xs sm:text-sm mb-2 leading-snug">
                    "{probe.question}"
                  </h5>
                  <p className="text-xs text-slate-500 italic mb-3">{probe.scenario}</p>
                </div>
                <div className="pt-2 border-t border-slate-200/60 text-[11px] text-indigo-700 font-medium">
                  <strong>What it reveals:</strong> {probe.reveals}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
