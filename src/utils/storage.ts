import { DecisionAnalysis } from '../types';

const STORAGE_KEY = 'the_tie_breaker_decisions_v1';

export function getSavedDecisions(): DecisionAnalysis[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to load saved decisions:', err);
    return [];
  }
}

export function saveDecision(decision: DecisionAnalysis): void {
  try {
    const existing = getSavedDecisions();
    const index = existing.findIndex((d) => d.id === decision.id);
    if (index >= 0) {
      existing[index] = decision;
    } else {
      existing.unshift(decision);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (err) {
    console.error('Failed to save decision:', err);
  }
}

export function deleteSavedDecision(id: string): void {
  try {
    const existing = getSavedDecisions();
    const filtered = existing.filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to delete decision:', err);
  }
}
