import React from 'react';
import {
  X,
  Bookmark,
  Trash2,
  Calendar,
  ArrowRight,
  Trophy,
  Scale
} from 'lucide-react';
import { DecisionAnalysis } from '../types';

interface SavedDecisionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedDecisions: DecisionAnalysis[];
  onSelectDecision: (decision: DecisionAnalysis) => void;
  onDeleteDecision: (id: string) => void;
}

export const SavedDecisionsModal: React.FC<SavedDecisionsModalProps> = ({
  isOpen,
  onClose,
  savedDecisions,
  onSelectDecision,
  onDeleteDecision,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Saved Decisions</h3>
              <p className="text-xs text-slate-500">
                {savedDecisions.length} decision{savedDecisions.length === 1 ? '' : 's'} stored in your browser
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {savedDecisions.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Scale className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-slate-700 text-base">No saved decisions yet</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                Whenever you analyze a dilemma with The Tie Breaker, it is automatically preserved here.
              </p>
            </div>
          ) : (
            savedDecisions.map((dec) => {
              const formattedDate = dec.createdAt
                ? new Date(dec.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recent';

              const winningOpt = dec.options.find(
                (o) => o.id === dec.tieBreakerVerdict.winnerOptionId
              );

              return (
                <div
                  key={dec.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 bg-white hover:bg-slate-50/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group shadow-2xs"
                >
                  <div className="space-y-1.5 flex-1 cursor-pointer" onClick={() => onSelectDecision(dec)}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {dec.category || 'Dilemma'}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formattedDate}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                      {dec.title}
                    </h4>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>Options:</span>
                      <span className="font-medium text-slate-700">
                        {dec.options.map((o) => o.name).join(' vs ')}
                      </span>
                    </div>

                    {winningOpt && (
                      <div className="inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                        <Trophy className="w-3 h-3 text-amber-500" />
                        <span>Verdict: {winningOpt.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => onSelectDecision(dec)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDecision(dec.id);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete saved decision"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 px-5">
          <span>Saved locally in your browser storage</span>
          <button
            onClick={onClose}
            className="px-3 py-1 text-slate-700 hover:text-slate-900 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
