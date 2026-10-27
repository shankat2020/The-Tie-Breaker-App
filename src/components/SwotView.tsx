import React, { useState } from 'react';
import {
  Grid2X2,
  TrendingUp,
  AlertOctagon,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { DecisionAnalysis, OptionSwot } from '../types';

interface SwotViewProps {
  decision: DecisionAnalysis;
}

export const SwotView: React.FC<SwotViewProps> = ({ decision }) => {
  const { swot, options } = decision;
  const [selectedOptionId, setSelectedOptionId] = useState<string>(options[0]?.id || '');

  const activeSwot = swot.find((s) => s.optionId === selectedOptionId) || swot[0];
  const activeOption = options.find((o) => o.id === selectedOptionId);
  const isWinner = selectedOptionId === decision.tieBreakerVerdict.winnerOptionId;

  if (!activeSwot) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
        No SWOT data available for this decision.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Option Switcher */}
      <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
            <Grid2X2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Strategic SWOT Analysis Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Internal capabilities (Strengths & Weaknesses) vs. External dynamics (Opportunities & Threats)
            </p>
          </div>
        </div>

        {/* Option Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
          {options.map((opt) => {
            const isOptWinner = opt.id === decision.tieBreakerVerdict.winnerOptionId;
            const isSelected = opt.id === selectedOptionId;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{opt.name}</span>
                {isOptWinner && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Verdict winner" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Option Summary Banner */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-slate-900 text-base">
              {activeSwot.optionName}
            </h4>
            {isWinner && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                Tie Breaker Recommended Path
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            {activeOption?.description}
          </p>
        </div>
        <div className="hidden sm:block text-right text-xs text-slate-400">
          <span className="font-semibold text-slate-700">Internal vs External</span>
          <br />Strategic Alignment
        </div>
      </div>

      {/* 2x2 SWOT Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* STRENGTHS (Internal / Helpful) */}
        <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-200/80">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-xs">
                S
              </div>
              <div>
                <h5 className="font-bold text-emerald-950 text-sm">Strengths</h5>
                <span className="text-[10px] font-medium text-emerald-700 uppercase tracking-wider">
                  Internal / Under Your Control
                </span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          </div>

          <ul className="space-y-2.5">
            {activeSwot.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-emerald-950">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* WEAKNESSES (Internal / Harmful) */}
        <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-rose-200/80">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-200 text-rose-800 flex items-center justify-center font-bold text-xs">
                W
              </div>
              <div>
                <h5 className="font-bold text-rose-950 text-sm">Weaknesses</h5>
                <span className="text-[10px] font-medium text-rose-700 uppercase tracking-wider">
                  Internal Limitations & Gaps
                </span>
              </div>
            </div>
            <AlertOctagon className="w-4 h-4 text-rose-600" />
          </div>

          <ul className="space-y-2.5">
            {activeSwot.weaknesses.map((weak, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-rose-950">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{weak}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* OPPORTUNITIES (External / Helpful) */}
        <div className="p-5 rounded-2xl bg-sky-50/50 border border-sky-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-sky-200/80">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-200 text-sky-800 flex items-center justify-center font-bold text-xs">
                O
              </div>
              <div>
                <h5 className="font-bold text-sky-950 text-sm">Opportunities</h5>
                <span className="text-[10px] font-medium text-sky-700 uppercase tracking-wider">
                  External Tailwinds & Upside
                </span>
              </div>
            </div>
            <TrendingUp className="w-4 h-4 text-sky-600" />
          </div>

          <ul className="space-y-2.5">
            {activeSwot.opportunities.map((opp, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-sky-950">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{opp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* THREATS (External / Harmful) */}
        <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200/80">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-xs">
                T
              </div>
              <div>
                <h5 className="font-bold text-amber-950 text-sm">Threats</h5>
                <span className="text-[10px] font-medium text-amber-700 uppercase tracking-wider">
                  External Risks & Vulnerabilities
                </span>
              </div>
            </div>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>

          <ul className="space-y-2.5">
            {activeSwot.threats.map((thr, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-amber-950">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{thr}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Strategic Takeaway Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
            Strategic Synthesis for {activeSwot.optionName}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-indigo-950 leading-relaxed font-medium">
          {activeSwot.keyTakeaway}
        </p>
      </div>
    </div>
  );
};
