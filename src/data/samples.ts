export interface SamplePreset {
  id: string;
  title: string;
  category: string;
  dilemma: string;
  options: string[];
  context: string;
  priorities: string;
}

export const SAMPLE_DILEMMAS: SamplePreset[] = [
  {
    id: 'career-startup-vs-bigtech',
    title: 'Startup Founding Engineer vs Big Tech Staff Role',
    category: 'Career',
    dilemma: 'Should I join an early-stage Series A AI startup as employee #4 with 1.5% equity, or accept a Staff Engineer offer at Google with a $420k total comp package?',
    options: ['Join Early-Stage AI Startup (1.5% Equity)', 'Accept Google Staff Engineer Offer ($420k TC)'],
    context: 'I have 7 years of software engineering experience and about 12 months of living expenses saved. No dependents currently.',
    priorities: 'High career velocity and ownership vs financial safety net and predictable work hours.'
  },
  {
    id: 'finance-buy-vs-rent',
    title: 'Buy a Home vs Rent & Invest in Index Funds',
    category: 'Finance',
    dilemma: 'Should we buy a $750k suburban home at 6.8% mortgage rate with $150k down payment, or continue renting at $2,900/month and invest the $150k + monthly savings into broad index funds?',
    options: ['Buy Suburban Home ($750k, 6.8% rate)', 'Rent at $2.9k/mo & Aggressively Invest Surplus'],
    context: 'Both partners work hybrid jobs. Planning to start a family in the next 2-3 years.',
    priorities: 'Long-term wealth accumulation, stability for family vs liquidity and geographical flexibility.'
  },
  {
    id: 'lifestyle-relocate-abroad',
    title: 'Relocate to Amsterdam vs Stay in New York City',
    category: 'Lifestyle',
    dilemma: 'Should I relocate to Amsterdam with my company for a 3-year European assignment (25% lower net pay, 30 vacation days, bikeable lifestyle) or stay in New York City (current social circle, top earning potential)?',
    options: ['Relocate to Amsterdam (3-Yr Assignment)', 'Stay in NYC (Maintain Trajectory)'],
    context: 'Mid-30s, single, always dreamed of living in Europe, but worried about rebuilding community from scratch.',
    priorities: 'Life richness, exploration, mental well-being vs career acceleration and established friendships.'
  },
  {
    id: 'tech-architecture-rewrite',
    title: 'Full Next.js / Cloud Architecture Rewrite vs Incremental Refactor',
    category: 'Engineering',
    dilemma: 'Should our SaaS team pause feature delivery for 8 weeks to rewrite our legacy monolithic frontend into modern Next.js/Vite, or continue refactoring iteratively while shipping customer-requested features?',
    options: ['Dedicated 8-Week Architecture Modernization', 'Continuous Incremental Refactoring Alongside Features'],
    context: 'Team of 6 developers. Tech debt currently causes ~25% slower cycle times, but 3 enterprise prospects are waiting on pipeline features.',
    priorities: 'Developer productivity and system reliability vs immediate market traction and revenue milestones.'
  }
];
