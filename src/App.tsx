import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Scale,
  SlidersHorizontal,
  Grid2X2,
  BrainCircuit,
  MessageSquare,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Share2,
  Calendar,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { DecisionAnalysis, OptionProsCons, ComparisonMatrix } from './types';
import { Navbar } from './components/Navbar';
import { DecisionInputForm } from './components/DecisionInputForm';
import { TieBreakerVerdictView } from './components/TieBreakerVerdictView';
import { ProsConsView } from './components/ProsConsView';
import { ComparisonMatrixView } from './components/ComparisonMatrixView';
import { SwotView } from './components/SwotView';
import { TieBreakerLab } from './components/TieBreakerLab';
import { AdvisorChat } from './components/AdvisorChat';
import { SavedDecisionsModal } from './components/SavedDecisionsModal';
import { getSavedDecisions, saveDecision, deleteSavedDecision } from './utils/storage';

export default function App() {
  const [currentDecision, setCurrentDecision] = useState<DecisionAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<'verdict' | 'pros-cons' | 'matrix' | 'swot' | 'lab' | 'advisor'>('verdict');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [savedDecisions, setSavedDecisions] = useState<DecisionAnalysis[]>([]);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  // Load saved decisions on mount
  useEffect(() => {
    const saved = getSavedDecisions();
    setSavedDecisions(saved);
  }, []);

  const handleAnalyze = async (payload: {
    decision: string;
    options: string[];
    context: string;
    userPriorities: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setLoadingStep('Structuring decision options & stakes...');

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev.includes('Structuring')) return 'Constructing balanced Pros & Cons lists...';
        if (prev.includes('Pros & Cons')) return 'Computing criteria weights and comparison matrix...';
        if (prev.includes('matrix')) return 'Mapping Strategic SWOT dimensions...';
        if (prev.includes('SWOT')) return 'Evaluating 10/10/10 timeline & synthesizing Verdict...';
        return 'Finalizing Tie Breaker analysis...';
      });
    }, 1200);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with status ${response.status}`);
      }

      const data: DecisionAnalysis = await response.json();
      setCurrentDecision(data);
      setActiveTab('verdict');

      // Persist in localStorage
      saveDecision(data);
      setSavedDecisions(getSavedDecisions());
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('Failed to analyze decision:', err);
      setError(err.message || 'Unable to connect to AI engine. Please verify the server is running.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleUpdateProsCons = (updatedProsCons: OptionProsCons[]) => {
    if (!currentDecision) return;
    const updated = { ...currentDecision, prosCons: updatedProsCons };
    setCurrentDecision(updated);
    saveDecision(updated);
    setSavedDecisions(getSavedDecisions());
  };

  const handleUpdateMatrix = (updatedMatrix: ComparisonMatrix) => {
    if (!currentDecision) return;
    const updated = { ...currentDecision, comparisonMatrix: updatedMatrix };
    setCurrentDecision(updated);
    saveDecision(updated);
    setSavedDecisions(getSavedDecisions());
  };

  const handleSelectSavedDecision = (decision: DecisionAnalysis) => {
    setCurrentDecision(decision);
    setActiveTab('verdict');
    setIsSavedModalOpen(false);
  };

  const handleDeleteSavedDecision = (id: string) => {
    deleteSavedDecision(id);
    const refreshed = getSavedDecisions();
    setSavedDecisions(refreshed);
    if (currentDecision?.id === id) {
      // keep current view or reset
    }
  };

  const tabs = [
    { id: 'verdict', label: 'Verdict & Rationale', icon: Trophy },
    { id: 'pros-cons', label: 'Pros & Cons', icon: Scale },
    { id: 'matrix', label: 'Comparison Matrix', icon: SlidersHorizontal },
    { id: 'swot', label: 'SWOT Analysis', icon: Grid2X2 },
    { id: 'lab', label: 'Intuition Lab', icon: BrainCircuit },
    { id: 'advisor', label: 'Ask Advisor', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <Navbar
        currentDecision={currentDecision}
        onNewDecision={() => {
          setCurrentDecision(null);
          setError(null);
        }}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        savedCount={savedDecisions.length}
      />

      <main className="flex-1">
        {error && (
          <div className="max-w-4xl mx-auto px-4 mt-6">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 shadow-xs">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <span className="font-bold">Error analyzing decision: </span>
                <span>{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {!currentDecision ? (
          <DecisionInputForm
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            loadingStep={loadingStep}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
            {/* Decision Header Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentDecision(null)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors mr-2 no-print"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Input</span>
                  </button>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {currentDecision.category}
                  </span>
                  {currentDecision.createdAt && (
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(currentDecision.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {/* Option summary pill badges */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {currentDecision.options.map((opt) => {
                    const isWinner = opt.id === currentDecision.tieBreakerVerdict.winnerOptionId;
                    return (
                      <span
                        key={opt.id}
                        className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                          isWinner
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {isWinner && <Trophy className="w-3 h-3 text-amber-600" />}
                        <span>{opt.name}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {currentDecision.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-4xl leading-relaxed">
                {currentDecision.summary}
              </p>
            </div>

            {/* Framework Navigation Tabs */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-1 shadow-2xs no-print overflow-x-auto">
              <div className="flex items-center gap-1 min-w-[600px] sm:min-w-0">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Contents */}
            <div className="transition-all">
              {activeTab === 'verdict' && (
                <TieBreakerVerdictView
                  decision={currentDecision}
                  onNavigateTab={(tab) => setActiveTab(tab as any)}
                />
              )}

              {activeTab === 'pros-cons' && (
                <ProsConsView
                  decision={currentDecision}
                  onUpdateProsCons={handleUpdateProsCons}
                />
              )}

              {activeTab === 'matrix' && (
                <ComparisonMatrixView
                  decision={currentDecision}
                  onUpdateMatrix={handleUpdateMatrix}
                />
              )}

              {activeTab === 'swot' && <SwotView decision={currentDecision} />}

              {activeTab === 'lab' && <TieBreakerLab decision={currentDecision} />}

              {activeTab === 'advisor' && <AdvisorChat decision={currentDecision} />}
            </div>
          </div>
        )}
      </main>

      {/* Saved Decisions Modal / Drawer */}
      <SavedDecisionsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedDecisions={savedDecisions}
        onSelectDecision={handleSelectSavedDecision}
        onDeleteDecision={handleDeleteSavedDecision}
      />
    </div>
  );
}
