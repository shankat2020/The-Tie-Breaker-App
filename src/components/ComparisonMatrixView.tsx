import React, { useState, useMemo } from 'react';
import {
  Sliders,
  RotateCcw,
  Plus,
  Trophy,
  Info,
  TrendingUp,
  Percent,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { ComparisonMatrix, DecisionAnalysis, MatrixCriterion } from '../types';

interface ComparisonMatrixViewProps {
  decision: DecisionAnalysis;
  onUpdateMatrix: (matrix: ComparisonMatrix) => void;
}

export const ComparisonMatrixView: React.FC<ComparisonMatrixViewProps> = ({
  decision,
  onUpdateMatrix,
}) => {
  const { comparisonMatrix, options } = decision;

  // Local weights state to allow instant real-time slider manipulation
  const [weights, setWeights] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    comparisonMatrix.criteria.forEach((c) => {
      map[c.id] = c.weight;
    });
    return map;
  });

  // State to add a custom criterion
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCriterionName, setNewCriterionName] = useState('');
  const [newCriterionCategory, setNewCriterionCategory] = useState('Personal');
  const [newCriterionScores, setNewCriterionScores] = useState<Record<string, number>>(() => {
    const s: Record<string, number> = {};
    options.forEach((o) => (s[o.id] = 5));
    return s;
  });

  const handleWeightChange = (criterionId: string, newWeight: number) => {
    setWeights((prev) => ({ ...prev, [criterionId]: newWeight }));
  };

  const handleResetWeights = () => {
    const map: Record<string, number> = {};
    comparisonMatrix.criteria.forEach((c) => {
      map[c.id] = c.weight;
    });
    setWeights(map);
  };

  // Calculate dynamic weighted scores for all options
  const scoresByOption = useMemo(() => {
    const totals: Record<string, { totalPoints: number; maxPoints: number; percentage: number }> = {};

    options.forEach((opt) => {
      totals[opt.id] = { totalPoints: 0, maxPoints: 0, percentage: 0 };
    });

    comparisonMatrix.criteria.forEach((criterion) => {
      const weight = weights[criterion.id] ?? criterion.weight;

      options.forEach((opt) => {
        const scoreObj = criterion.scores.find((s) => s.optionId === opt.id);
        const scoreVal = scoreObj ? scoreObj.score : 5;
        totals[opt.id].totalPoints += scoreVal * weight;
        totals[opt.id].maxPoints += 10 * weight;
      });
    });

    options.forEach((opt) => {
      const { totalPoints, maxPoints } = totals[opt.id];
      totals[opt.id].percentage = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;
    });

    return totals;
  }, [options, comparisonMatrix.criteria, weights]);

  // Find the dynamically leading option
  const sortedLeaderboard = useMemo(() => {
    return [...options].sort((a, b) => {
      return (scoresByOption[b.id]?.percentage || 0) - (scoresByOption[a.id]?.percentage || 0);
    });
  }, [options, scoresByOption]);

  const leaderOptionId = sortedLeaderboard[0]?.id;

  const handleAddCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCriterionName.trim()) return;

    const newCrit: MatrixCriterion = {
      id: 'custom_crit_' + Date.now(),
      name: newCriterionName.trim(),
      category: newCriterionCategory,
      description: 'Custom evaluation metric added by you.',
      weight: 3,
      scores: options.map((opt) => ({
        optionId: opt.id,
        score: newCriterionScores[opt.id] || 5,
        reasoning: 'User defined score based on personal judgment.',
      })),
    };

    const updatedCriteria = [...comparisonMatrix.criteria, newCrit];
    setWeights((prev) => ({ ...prev, [newCrit.id]: 3 }));
    onUpdateMatrix({ criteria: updatedCriteria });
    setShowAddModal(false);
    setNewCriterionName('');
  };

  const handleDeleteCriterion = (id: string) => {
    const updatedCriteria = comparisonMatrix.criteria.filter((c) => c.id !== id);
    onUpdateMatrix({ criteria: updatedCriteria });
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (score >= 6) return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    if (score >= 4) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-rose-100 text-rose-800 border-rose-300';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Dynamic Leaderboard */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span className="text-xs uppercase tracking-wider font-bold text-amber-300">
                Real-Time Weighted Scoring
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              Decision Priority Matrix
            </h3>
            <p className="text-xs text-indigo-200">
              Adjust the weight sliders below to test how different priorities impact the final recommendation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetWeights}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-indigo-100 border border-white/10 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Weights</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Metric</span>
            </button>
          </div>
        </div>

        {/* Option Composite Score Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sortedLeaderboard.map((opt, rankIdx) => {
            const isRank1 = rankIdx === 0;
            const stats = scoresByOption[opt.id] || { totalPoints: 0, percentage: 0 };
            return (
              <div
                key={opt.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isRank1
                    ? 'bg-indigo-600/30 border-amber-400/60 ring-1 ring-amber-400/40'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isRank1 ? 'bg-amber-400 text-slate-900' : 'bg-white/20 text-white'
                      }`}
                    >
                      #{rankIdx + 1}
                    </span>
                    <span className="font-bold text-sm text-white truncate">{opt.name}</span>
                  </div>
                  {isRank1 && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full">
                      Top Weighted Match
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl font-black text-white">{stats.percentage}%</span>
                  <span className="text-xs text-indigo-200">
                    {stats.totalPoints} weighted pts
                  </span>
                </div>

                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mt-1.5">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isRank1
                        ? 'bg-gradient-to-r from-amber-400 to-emerald-400'
                        : 'bg-indigo-400'
                    }`}
                    style={{ width: `${stats.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>Criteria Weighting & Qualitative Scoring (1-10)</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Slide weights 1 (Minor) to 5 (Dealbreaker)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] uppercase tracking-wider text-slate-600 font-bold">
                <th className="py-3 px-4 w-1/3">Evaluation Criterion & Importance Weight</th>
                {options.map((opt) => (
                  <th key={opt.id} className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span>{opt.name}</span>
                      {opt.id === leaderOptionId && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-bold">
                          Leading
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                <th className="py-3 px-2 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {comparisonMatrix.criteria.map((criterion) => {
                const currentWeight = weights[criterion.id] ?? criterion.weight;

                return (
                  <tr key={criterion.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Criterion info + slider */}
                    <td className="py-4 px-4 align-top">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">
                            {criterion.name}
                          </span>
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {criterion.category}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px] leading-relaxed">
                          {criterion.description}
                        </p>

                        {/* Interactive Weight Slider */}
                        <div className="pt-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
                            <span className="font-semibold text-indigo-700">
                              Weight: {currentWeight}x
                            </span>
                            <span className="text-slate-400">
                              {currentWeight === 5
                                ? 'Top Priority'
                                : currentWeight >= 3
                                ? 'Important'
                                : 'Low Priority'}
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            step="1"
                            value={currentWeight}
                            onChange={(e) =>
                              handleWeightChange(criterion.id, parseInt(e.target.value, 10))
                            }
                            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                          />
                        </div>
                      </div>
                    </td>

                    {/* Scores for each option */}
                    {options.map((opt) => {
                      const scoreData = criterion.scores.find((s) => s.optionId === opt.id) || {
                        score: 5,
                        reasoning: 'Neutral evaluation.',
                      };

                      return (
                        <td key={opt.id} className="py-4 px-4 align-top">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded-md font-bold text-xs border ${getScoreColor(
                                  scoreData.score
                                )}`}
                              >
                                {scoreData.score}/10
                              </span>
                              <span className="text-[10px] font-semibold text-slate-500">
                                ({scoreData.score * currentWeight} weighted pts)
                              </span>
                            </div>
                            <p className="text-slate-600 text-xs leading-relaxed">
                              {scoreData.reasoning}
                            </p>
                          </div>
                        </td>
                      );
                    })}

                    {/* Delete criterion if custom */}
                    <td className="py-4 px-2 align-top text-right">
                      {criterion.id.startsWith('custom_') && (
                        <button
                          onClick={() => handleDeleteCriterion(criterion.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete metric"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Custom Criterion Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h4 className="font-extrabold text-slate-900 text-base mb-1">
              Add Custom Evaluation Metric
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Add a metric specific to your life or situation (e.g. Commute Stress, Family Buy-in).
            </p>

            <form onSubmit={handleAddCriterion} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Metric Name</label>
                <input
                  type="text"
                  required
                  value={newCriterionName}
                  onChange={(e) => setNewCriterionName(e.target.value)}
                  placeholder="e.g. Commute Ease or Partner Agreement"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  value={newCriterionCategory}
                  onChange={(e) => setNewCriterionCategory(e.target.value)}
                  placeholder="e.g. Personal, Financial, Operations"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Initial Scores (1-10) for Options:
                </label>
                <div className="space-y-2">
                  {options.map((opt) => (
                    <div key={opt.id} className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700 truncate max-w-[200px]">
                        {opt.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={newCriterionScores[opt.id] ?? 5}
                          onChange={(e) =>
                            setNewCriterionScores((prev) => ({
                              ...prev,
                              [opt.id]: parseInt(e.target.value, 10),
                            }))
                          }
                          className="w-24 accent-indigo-600"
                        />
                        <span className="font-bold text-indigo-700 w-6 text-right">
                          {newCriterionScores[opt.id] ?? 5}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Add Metric
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
