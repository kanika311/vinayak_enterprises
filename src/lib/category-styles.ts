const STYLES: Record<string, { icon: string; color: string }> = {
  'chemistry-lab-instrument': { icon: '🧪', color: 'bg-blue-50 border-blue-200 hover:border-blue-400' },
  'laboratory-equipment': { icon: '⚗️', color: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400' },
  'physics-scientific-equipment': { icon: '⚡', color: 'bg-amber-50 border-amber-200 hover:border-amber-400' },
  'scientific-instrument': { icon: '🔬', color: 'bg-violet-50 border-violet-200 hover:border-violet-400' },
  'biological-model': { icon: '🫀', color: 'bg-rose-50 border-rose-200 hover:border-rose-400' },
  'laboratory-dishes': { icon: '🧫', color: 'bg-cyan-50 border-cyan-200 hover:border-cyan-400' },
  'educational-teaching-aid': { icon: '📚', color: 'bg-orange-50 border-orange-200 hover:border-orange-400' },
  'laboratory-instruments': { icon: '🔭', color: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400' },
  microscopes: { icon: '🔬', color: 'bg-violet-50 border-violet-200 hover:border-violet-400' },
  'digital-microscopes': { icon: '📷', color: 'bg-blue-50 border-blue-200 hover:border-blue-400' },
};

const FALLBACK_COLORS = [
  'bg-blue-50 border-blue-200 hover:border-blue-400',
  'bg-emerald-50 border-emerald-200 hover:border-emerald-400',
  'bg-amber-50 border-amber-200 hover:border-amber-400',
  'bg-violet-50 border-violet-200 hover:border-violet-400',
];

export function getCategoryStyle(slug: string, index = 0) {
  return STYLES[slug] || {
    icon: '🔬',
    color: FALLBACK_COLORS[index % FALLBACK_COLORS.length],
  };
}
