import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Tag,
  Scale,
  Columns,
  Layers,
  Sparkles
} from 'lucide-react';
import { DecisionAnalysis, OptionProsCons, ProConItem } from '../types';

interface ProsConsViewProps {
  decision: DecisionAnalysis;
  onUpdateProsCons: (updatedList: OptionProsCons[]) => void;
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({
  decision,
  onUpdateProsCons,
}) => {
  const { prosCons, options } = decision;
  const [activeOptionId, setActiveOptionId] = useState<string>(options[0]?.id || '');
  const [viewMode, setViewMode] = useState<'side-by-side' | 'tabs'>('side-by-side');
  const [filterImpact, setFilterImpact] = useState<string>('all');
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Inline add state
  const [addingTo, setAddingTo] = useState<{ optionId: string; type: 'pro' | 'con' } | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newExplanation, setNewExplanation] = useState('');
  const [newImpact, setNewImpact] = useState<'high' | 'medium' | 'low'>('medium');
  const [newCategory, setNewCategory] = useState('Personal');

  const handleToggleChecked = (itemId: string) => {
    setCheckedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleAddItem = (optionId: string, type: 'pro' | 'con') => {
    if (!newTitle.trim()) return;

    const newItem: ProConItem = {
      id: 'custom_' + Date.now(),
      title: newTitle.trim(),
      explanation: newExplanation.trim() || 'Custom consideration added by you.',
      impact: newImpact,
      category: newCategory,
      userAdded: true,
    };

    const updated = prosCons.map((pc) => {
      if (pc.optionId !== optionId) return pc;
      return {
        ...pc,
        pros: type === 'pro' ? [...pc.pros, newItem] : pc.pros,
        cons: type === 'con' ? [...pc.cons, newItem] : pc.cons,
      };
    });

    onUpdateProsCons(updated);
    setNewTitle('');
    setNewExplanation('');
    setAddingTo(null);
  };

  const handleDeleteItem = (optionId: string, type: 'pro' | 'con', itemId: string) => {
    const updated = prosCons.map((pc) => {
      if (pc.optionId !== optionId) return pc;
      return {
        ...pc,
        pros: type === 'pro' ? pc.pros.filter((p) => p.id !== itemId) : pc.pros,
        cons: type === 'con' ? pc.cons.filter((c) => c.id !== itemId) : pc.cons,
      };
    });
    onUpdateProsCons(updated);
  };

  const renderImpactBadge = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> High Impact
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Medium Impact
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Low Impact
          </span>
        );
    }
  };

  const filterItems = (items: ProConItem[]) => {
    if (filterImpact === 'all') return items;
    return items.filter((item) => item.impact.toLowerCase() === filterImpact.toLowerCase());
  };

  const displayedOptions =
    viewMode === 'tabs'
      ? prosCons.filter((pc) => pc.optionId === activeOptionId)
      : prosCons;

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Pros & Cons Breakdown</h3>
            <p className="text-xs text-slate-500">
              Evaluated across financial, career, mental health, and operational dimensions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Impact filter */}
          <select
            value={filterImpact}
            onChange={(e) => setFilterImpact(e.target.value)}
            className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Impacts</option>
            <option value="high">High Impact Only</option>
            <option value="medium">Medium Impact</option>
            <option value="low">Low Impact</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'side-by-side'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Side-by-side view"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Side-by-Side</span>
            </button>
            <button
              onClick={() => setViewMode('tabs')}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                viewMode === 'tabs'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Tabbed option view"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tabs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs if viewMode === 'tabs' */}
      {viewMode === 'tabs' && (
        <div className="flex border-b border-slate-200 gap-2">
          {prosCons.map((pc) => {
            const isWinner = pc.optionId === decision.tieBreakerVerdict.winnerOptionId;
            return (
              <button
                key={pc.optionId}
                onClick={() => setActiveOptionId(pc.optionId)}
                className={`pb-2.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeOptionId === pc.optionId
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{pc.optionName}</span>
                {isWinner && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    Winner
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Options Cards */}
      <div
        className={`grid gap-6 ${
          viewMode === 'side-by-side' && displayedOptions.length > 1
            ? 'grid-cols-1 lg:grid-cols-2'
            : 'grid-cols-1'
        }`}
      >
        {displayedOptions.map((pc) => {
          const isWinner = pc.optionId === decision.tieBreakerVerdict.winnerOptionId;
          const filteredPros = filterItems(pc.pros);
          const filteredCons = filterItems(pc.cons);

          return (
            <div
              key={pc.optionId}
              className={`rounded-2xl bg-white border p-5 sm:p-6 shadow-2xs flex flex-col justify-between transition-all ${
                isWinner ? 'border-indigo-300 ring-1 ring-indigo-200' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-slate-900 text-base sm:text-lg">
                        {pc.optionName}
                      </h4>
                      {isWinner && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
                          Verdict Choice
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <span className="text-emerald-700 font-bold">+{pc.pros.length} Pros</span>
                    <span>/</span>
                    <span className="text-rose-700 font-bold">-{pc.cons.length} Cons</span>
                  </div>
                </div>

                {/* Net Assessment */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 mb-5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                    Net Tradeoff Synthesis
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {pc.netAssessment}
                  </p>
                </div>

                {/* Grid of Pros and Cons */}
                <div className="space-y-6">
                  {/* PROS */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-1.5 border-b border-emerald-100">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Pros & Advantages ({filteredPros.length})</span>
                      </div>
                      <button
                        onClick={() =>
                          setAddingTo(
                            addingTo?.optionId === pc.optionId && addingTo?.type === 'pro'
                              ? null
                              : { optionId: pc.optionId, type: 'pro' }
                          )
                        }
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900"
                      >
                        <Plus className="w-3 h-3" /> Add Pro
                      </button>
                    </div>

                    {/* Inline Add Pro Form */}
                    {addingTo?.optionId === pc.optionId && addingTo?.type === 'pro' && (
                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="Short title of this pro..."
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <textarea
                          rows={2}
                          value={newExplanation}
                          onChange={(e) => setNewExplanation(e.target.value)}
                          placeholder="Detailed explanation or why this matters..."
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <select
                              value={newImpact}
                              onChange={(e) => setNewImpact(e.target.value as any)}
                              className="text-xs px-2 py-1 bg-white border border-emerald-300 rounded-md"
                            >
                              <option value="high">High Impact</option>
                              <option value="medium">Medium Impact</option>
                              <option value="low">Low Impact</option>
                            </select>
                            <input
                              type="text"
                              value={newCategory}
                              onChange={(e) => setNewCategory(e.target.value)}
                              placeholder="Category"
                              className="text-xs px-2 py-1 bg-white border border-emerald-300 rounded-md w-24"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setAddingTo(null)}
                              className="text-xs px-2 py-1 text-slate-500 hover:text-slate-700"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleAddItem(pc.optionId, 'pro')}
                              className="text-xs font-semibold px-2.5 py-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                            >
                              Save Pro
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2.5">
                      {filteredPros.map((pro) => {
                        const isChecked = checkedItems[pro.id];
                        return (
                          <div
                            key={pro.id}
                            className={`p-3 rounded-xl border transition-all ${
                              isChecked
                                ? 'bg-slate-50/70 border-slate-200 opacity-60'
                                : 'bg-emerald-50/40 border-emerald-100 hover:border-emerald-200'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <input
                                  type="checkbox"
                                  checked={!!isChecked}
                                  onChange={() => handleToggleChecked(pro.id)}
                                  className="rounded border-emerald-400 text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5 cursor-pointer"
                                  title="Mark as factored in"
                                />
                                <span
                                  className={`text-xs sm:text-sm font-bold text-slate-900 ${
                                    isChecked ? 'line-through text-slate-500' : ''
                                  }`}
                                >
                                  {pro.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {renderImpactBadge(pro.impact)}
                                {pro.userAdded && (
                                  <button
                                    onClick={() => handleDeleteItem(pc.optionId, 'pro', pro.id)}
                                    className="text-slate-400 hover:text-rose-600"
                                    title="Delete custom item"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                            <p
                              className={`text-xs text-slate-600 leading-relaxed ml-5 ${
                                isChecked ? 'text-slate-400' : ''
                              }`}
                            >
                              {pro.explanation}
                            </p>
                            <div className="ml-5 mt-1.5 flex items-center gap-1 text-[10px] text-slate-400">
                              <Tag className="w-2.5 h-2.5" />
                              <span>{pro.category}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* CONS */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-1.5 border-b border-rose-100">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 uppercase tracking-wider">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Cons & Drawbacks ({filteredCons.length})</span>
                      </div>
                      <button
                        onClick={() =>
                          setAddingTo(
                            addingTo?.optionId === pc.optionId && addingTo?.type === 'con'
                              ? null
                              : { optionId: pc.optionId, type: 'con' }
                          )
                        }
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 hover:text-rose-900"
                      >
                        <Plus className="w-3 h-3" /> Add Con
                      </button>
                    </div>

                    {/* Inline Add Con Form */}
                    {addingTo?.optionId === pc.optionId && addingTo?.type === 'con' && (
                      <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 space-y-2">
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="Short title of this con/risk..."
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-rose-300 bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                        <textarea
                          rows={2}
                          value={newExplanation}
                          onChange={(e) => setNewExplanation(e.target.value)}
                          placeholder="Detailed explanation of the risk..."
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-rose-300 bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <select
                              value={newImpact}
                              onChange={(e) => setNewImpact(e.target.value as any)}
                              className="text-xs px-2 py-1 bg-white border border-rose-300 rounded-md"
                            >
                              <option value="high">High Impact</option>
                              <option value="medium">Medium Impact</option>
                              <option value="low">Low Impact</option>
                            </select>
                            <input
                              type="text"
                              value={newCategory}
                              onChange={(e) => setNewCategory(e.target.value)}
                              placeholder="Category"
                              className="text-xs px-2 py-1 bg-white border border-rose-300 rounded-md w-24"
                            />
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setAddingTo(null)}
                              className="text-xs px-2 py-1 text-slate-500 hover:text-slate-700"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleAddItem(pc.optionId, 'con')}
                              className="text-xs font-semibold px-2.5 py-1 bg-rose-600 text-white rounded-md hover:bg-rose-700"
                            >
                              Save Con
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2.5">
                      {filteredCons.map((con) => {
                        const isChecked = checkedItems[con.id];
                        return (
                          <div
                            key={con.id}
                            className={`p-3 rounded-xl border transition-all ${
                              isChecked
                                ? 'bg-slate-50/70 border-slate-200 opacity-60'
                                : 'bg-rose-50/40 border-rose-100 hover:border-rose-200'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <input
                                  type="checkbox"
                                  checked={!!isChecked}
                                  onChange={() => handleToggleChecked(con.id)}
                                  className="rounded border-rose-400 text-rose-600 focus:ring-rose-500 h-3.5 w-3.5 cursor-pointer"
                                  title="Mark as factored in"
                                />
                                <span
                                  className={`text-xs sm:text-sm font-bold text-slate-900 ${
                                    isChecked ? 'line-through text-slate-500' : ''
                                  }`}
                                >
                                  {con.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {renderImpactBadge(con.impact)}
                                {con.userAdded && (
                                  <button
                                    onClick={() => handleDeleteItem(pc.optionId, 'con', con.id)}
                                    className="text-slate-400 hover:text-rose-600"
                                    title="Delete custom item"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                            <p
                              className={`text-xs text-slate-600 leading-relaxed ml-5 ${
                                isChecked ? 'text-slate-400' : ''
                              }`}
                            >
                              {con.explanation}
                            </p>
                            <div className="ml-5 mt-1.5 flex items-center gap-1 text-[10px] text-slate-400">
                              <Tag className="w-2.5 h-2.5" />
                              <span>{con.category}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
