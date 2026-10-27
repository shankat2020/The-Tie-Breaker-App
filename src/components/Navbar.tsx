import React from 'react';
import { Scale, Sparkles, Bookmark, Printer, Share2, PlusCircle, Check } from 'lucide-react';
import { DecisionAnalysis } from '../types';

interface NavbarProps {
  currentDecision: DecisionAnalysis | null;
  onNewDecision: () => void;
  onOpenSaved: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentDecision,
  onNewDecision,
  onOpenSaved,
  savedCount,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopySummary = () => {
    if (!currentDecision) return;
    const text = `⚖️ THE TIE BREAKER ANALYSIS: ${currentDecision.title}
Dilemma: ${currentDecision.summary}

🏆 THE VERDICT:
${currentDecision.tieBreakerVerdict.verdictHeadline}
Confidence: ${currentDecision.tieBreakerVerdict.confidenceScore}%
Rationale: ${currentDecision.tieBreakerVerdict.verdictRationale}

🔑 DECISION TRIGGERS:
${currentDecision.tieBreakerVerdict.triggers.map((t) => `• ${t.optionName}: Choose if "${t.condition}" -> Action: ${t.recommendedAction}`).join('\n')}

💡 10/10/10 RULE:
• In 10 Minutes: ${currentDecision.tieBreakerVerdict.tenTenTen.tenMinutes}
• In 10 Months: ${currentDecision.tieBreakerVerdict.tenTenTen.tenMonths}
• In 10 Years: ${currentDecision.tieBreakerVerdict.tenTenTen.tenYears}

Generated with The Tie Breaker.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={onNewDecision}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-slate-900 tracking-tight">The Tie Breaker</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Sparkles className="w-3 h-3 text-indigo-600" /> AI
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Cognitive Clarity & Multi-Angle Decision Intelligence</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentDecision && (
            <>
              <button
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                title="Copy Decision Summary"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Summary'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                title="Print or Save as PDF Report"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export PDF</span>
              </button>
            </>
          )}

          <button
            onClick={onOpenSaved}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-500" />
            <span>Saved</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold">
                {savedCount}
              </span>
            )}
          </button>

          {currentDecision && (
            <button
              onClick={onNewDecision}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm shadow-indigo-200 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Decision</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
