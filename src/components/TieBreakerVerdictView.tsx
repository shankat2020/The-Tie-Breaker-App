import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Compass,
  ArrowRight,
  HeartHandshake,
  ShieldAlert,
  DoorOpen,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { DecisionAnalysis } from '../types';

interface TieBreakerVerdictViewProps {
  decision: DecisionAnalysis;
  onNavigateTab: (tabId: string) => void;
}

export const TieBreakerVerdictView: React.FC<TieBreakerVerdictViewProps> = ({
  decision,
  onNavigateTab,
}) => {
  const { tieBreakerVerdict, options } = decision;

  useEffect(() => {
    // Subtle, elegant celebratory burst
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#8b5cf6', '#10b981', '#f59e0b'],
      });
    } catch {
      // ignore
    }
  }, [decision.id]);

  const winningOption =
    options.find((o) => o.id === tieBreakerVerdict.winnerOptionId) || options[0];

  const isType1 =
    tieBreakerVerdict.decisionType.toLowerCase().includes('type 1') ||
    tieBreakerVerdict.decisionType.toLowerCase().includes('irreversible') ||
    tieBreakerVerdict.decisionType.toLowerCase().includes('one-way');

  return (
    <div className="space-y-6">
      {/* Primary Winner Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold backdrop-blur-xs">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>THE TIE BREAKER VERDICT</span>
            </div>

            {/* Confidence Score */}
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/10">
              <span className="text-xs text-indigo-200 font-medium">Confidence:</span>
              <span className="text-xs font-bold text-emerald-300">
                {tieBreakerVerdict.confidenceScore}%
              </span>
              <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full"
                  style={{ width: `${tieBreakerVerdict.confidenceScore}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mb-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-indigo-300">
              Recommended Choice
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-0.5">
              {winningOption?.name}
            </h2>
            {winningOption?.description && (
              <p className="text-indigo-200/80 text-sm mt-1 max-w-3xl">
                {winningOption.description}
              </p>
            )}
          </div>

          <div className="mt-5 p-4 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs">
            <div className="font-bold text-base sm:text-lg text-amber-200 mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>"{tieBreakerVerdict.verdictHeadline}"</span>
            </div>
            <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
              {tieBreakerVerdict.verdictRationale}
            </p>
          </div>
        </div>
      </div>

      {/* Decision Architecture & Reversibility */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Reversibility Diagnosis (Jeff Bezos Type 1 vs Type 2) */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2 mb-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isType1 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              <DoorOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Decision Topology
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                {tieBreakerVerdict.decisionType}
              </h3>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {tieBreakerVerdict.reversibilityAdvice}
          </p>
          <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-500 flex items-center gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              {isType1
                ? 'High stakes: Once walked through, it is costly or impossible to walk back.'
                : 'Two-way door: Can be reversed or adjusted quickly if early assumptions prove incorrect.'}
            </span>
          </div>
        </div>

        {/* Pre-Mortem & Safeguard */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Worst-Case Pre-Mortem & Hedge
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Preventing The Primary Failure Mode
              </h3>
            </div>
          </div>
          <div className="space-y-2 text-xs sm:text-sm">
            <div>
              <span className="font-semibold text-rose-700">Risk Scenario: </span>
              <span className="text-slate-600">
                {tieBreakerVerdict.worstCasePreMortem.scenario}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100/80">
              <span className="font-semibold text-emerald-800">Concrete Safeguard: </span>
              <span className="text-emerald-900">
                {tieBreakerVerdict.worstCasePreMortem.safeguard}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Triggers: "When to choose which" */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Conditional Decision Triggers
              </h3>
              <p className="text-xs text-slate-500">
                Clear test cases to know definitively which path fits your specific reality
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {tieBreakerVerdict.triggers.map((trigger, idx) => {
            const isWinner = trigger.optionId === tieBreakerVerdict.winnerOptionId;
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  isWinner
                    ? 'bg-indigo-50/60 border-indigo-200'
                    : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    {isWinner && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    )}
                    {trigger.optionName}
                  </span>
                  {isWinner && (
                    <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                      Primary Path
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-slate-600">
                  <p>
                    <strong className="text-slate-800">Choose this if:</strong>{' '}
                    {trigger.condition}
                  </p>
                  <p className="text-indigo-900/90 font-medium bg-white/70 p-2 rounded-lg border border-slate-200/60">
                    <strong className="text-indigo-700">Immediate Action:</strong>{' '}
                    {trigger.recommendedAction}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* The 10/10/10 Perspective Rule & Best Friend Advice */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 10/10/10 Rule */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Suzy Welch's 10/10/10 Rule
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Emotional Distance Across Time
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="font-bold text-indigo-600 text-xs uppercase mb-1">
                In 10 Minutes
              </div>
              <p className="text-slate-600 leading-relaxed">
                {tieBreakerVerdict.tenTenTen.tenMinutes}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="font-bold text-violet-600 text-xs uppercase mb-1">
                In 10 Months
              </div>
              <p className="text-slate-600 leading-relaxed">
                {tieBreakerVerdict.tenTenTen.tenMonths}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="font-bold text-teal-600 text-xs uppercase mb-1">
                In 10 Years
              </div>
              <p className="text-slate-600 leading-relaxed">
                {tieBreakerVerdict.tenTenTen.tenYears}
              </p>
            </div>
          </div>
        </div>

        {/* Best Friend Advice */}
        <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  The Coffee Test
                </span>
                <h3 className="text-sm font-bold text-amber-950">
                  Best Friend Advice
                </h3>
              </div>
            </div>
            <blockquote className="text-xs sm:text-sm text-amber-900 italic leading-relaxed">
              "{tieBreakerVerdict.bestFriendAdvice}"
            </blockquote>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-200/60 text-[11px] text-amber-700">
            When you advise someone you love, clarity replaces self-doubt.
          </div>
        </div>
      </div>

      {/* Navigation Quick Jump Footer */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 no-print">
        <span className="font-medium">Want to inspect the detailed analytical foundations?</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('pros-cons')}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold transition-colors"
          >
            Pros & Cons
          </button>
          <button
            onClick={() => onNavigateTab('matrix')}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold transition-colors"
          >
            Comparison Matrix
          </button>
          <button
            onClick={() => onNavigateTab('swot')}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold transition-colors"
          >
            SWOT Analysis
          </button>
          <button
            onClick={() => onNavigateTab('lab')}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs transition-colors flex items-center gap-1"
          >
            <span>Intuition Lab</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
