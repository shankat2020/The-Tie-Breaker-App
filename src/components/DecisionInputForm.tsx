import React, { useState } from 'react';
import { Sparkles, SlidersHorizontal, ArrowRight, Lightbulb, Compass, Plus, Trash2, ShieldCheck, Zap } from 'lucide-react';
import { SAMPLE_DILEMMAS, SamplePreset } from '../data/samples';

interface DecisionInputFormProps {
  onAnalyze: (payload: {
    decision: string;
    options: string[];
    context: string;
    userPriorities: string;
  }) => void;
  isLoading: boolean;
  loadingStep: string;
}

export const DecisionInputForm: React.FC<DecisionInputFormProps> = ({
  onAnalyze,
  isLoading,
  loadingStep,
}) => {
  const [decision, setDecision] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [options, setOptions] = useState<string[]>(['', '']);
  const [context, setContext] = useState('');
  const [userPriorities, setUserPriorities] = useState('');

  const handleSelectPreset = (preset: SamplePreset) => {
    setDecision(preset.dilemma);
    setOptions(preset.options);
    setContext(preset.context);
    setUserPriorities(preset.priorities);
    setShowAdvanced(true);
  };

  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decision.trim()) return;

    onAnalyze({
      decision: decision.trim(),
      options: options.filter((o) => o.trim().length > 0),
      context: context.trim(),
      userPriorities: userPriorities.trim(),
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Hero Header */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-4 shadow-xs">
          <Zap className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
          <span>Multi-Perspective Decision Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Stuck between two paths? <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800">
            Let's break the tie.
          </span>
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
          Input any tough decision. We’ll analyze the trade-offs via detailed{' '}
          <strong className="text-slate-800 font-semibold">Pros & Cons</strong>, an interactive{' '}
          <strong className="text-slate-800 font-semibold">Comparison Matrix</strong>, a rigorous{' '}
          <strong className="text-slate-800 font-semibold">SWOT Analysis</strong>, and an objective{' '}
          <strong className="text-slate-800 font-semibold">Tie Breaker Verdict</strong>.
        </p>
      </div>

      {/* Preset Quick Chips */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-2.5 px-1">
          <span className="flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            Try a real-world dilemma:
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {SAMPLE_DILEMMAS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="text-left p-3 rounded-xl bg-white border border-slate-200/90 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all text-xs group shadow-2xs hover:shadow-sm"
            >
              <div className="flex items-center justify-between font-semibold text-slate-800 group-hover:text-indigo-600 mb-1">
                <span>{preset.title}</span>
                <span className="text-[10px] uppercase font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  {preset.category}
                </span>
              </div>
              <p className="text-slate-500 line-clamp-1 text-[11px]">{preset.dilemma}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7">
        <div className="space-y-4">
          <div>
            <label htmlFor="decision-input" className="block text-sm font-bold text-slate-800 mb-1.5">
              What decision are you facing? <span className="text-indigo-600">*</span>
            </label>
            <textarea
              id="decision-input"
              rows={3}
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              placeholder="e.g. Should I leave my corporate tech job to join an early-stage AI startup with 1.5% equity, or accept a promotion to Director?"
              className="w-full px-4 py-3 text-slate-900 placeholder-slate-400 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base leading-relaxed transition-all resize-y"
              required
            />
          </div>

          {/* Toggle Advanced Precision Options */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showAdvanced ? 'Hide Custom Options & Constraints' : 'Customize Options & Personal Priorities (Optional)'}</span>
            </button>
          </div>

          {/* Advanced Fields Container */}
          {showAdvanced && (
            <div className="pt-4 border-t border-slate-100 space-y-4 bg-slate-50/60 p-4 rounded-xl border">
              {/* Explicit Options */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Specific Options to Compare
                  </label>
                  {options.length < 4 && (
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      <Plus className="w-3 h-3" /> Add Option
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + idx)} (e.g. ${idx === 0 ? 'Accept the new offer' : 'Stay at current company'})`}
                        className="flex-1 px-3 py-1.5 text-xs sm:text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOption(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                          title="Remove option"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Tip: Leave blank to let AI automatically isolate the most logical alternatives.
                </p>
              </div>

              {/* Context / Constraints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Constraints & Context
                  </label>
                  <textarea
                    rows={2}
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="e.g. Budget limit of $5k, 6 months runway, hybrid schedule mandatory, young family..."
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Core Priorities & Values
                  </label>
                  <textarea
                    rows={2}
                    value={userPriorities}
                    onChange={(e) => setUserPriorities(e.target.value)}
                    placeholder="e.g. Peace of mind, high financial upside, low risk, geographic freedom..."
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Full multi-lens analysis: Pros/Cons + Matrix + SWOT + Verdict</span>
            </div>

            <button
              type="submit"
              disabled={isLoading || !decision.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-200 transition-all disabled:opacity-50 disabled:pointer-events-none hover:scale-[1.01]"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{loadingStep || 'Analyzing Decision Matrix...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze & Break The Tie</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Feature Value Props footer */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3 rounded-xl bg-white/70 border border-slate-200/60">
          <div className="font-bold text-xs text-slate-800">Balanced Pros & Cons</div>
          <div className="text-[11px] text-slate-500">Weighted by impact & domain</div>
        </div>
        <div className="p-3 rounded-xl bg-white/70 border border-slate-200/60">
          <div className="font-bold text-xs text-slate-800">Dynamic Matrix</div>
          <div className="text-[11px] text-slate-500">Adjust custom criteria weights</div>
        </div>
        <div className="p-3 rounded-xl bg-white/70 border border-slate-200/60">
          <div className="font-bold text-xs text-slate-800">SWOT Framework</div>
          <div className="text-[11px] text-slate-500">Internal & external risk factors</div>
        </div>
        <div className="p-3 rounded-xl bg-white/70 border border-slate-200/60">
          <div className="font-bold text-xs text-slate-800">The Verdict</div>
          <div className="text-[11px] text-slate-500">10/10/10 & Reversibility</div>
        </div>
      </div>
    </div>
  );
};
