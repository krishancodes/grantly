import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEMO_SCHOLARSHIPS } from '../data/scholarships';
import { ScholarshipCard } from '../components/scholarships/ScholarshipCard';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { getProfile, getSavedScholarships, toggleSave } from '../lib/storage';
import { calculateMatchScore } from '../lib/matchEngine';
import { EducationLevel, ScholarshipCategory } from '../types';
import { cn } from '../lib/utils';

const CATEGORIES: ScholarshipCategory[] = ['Merit', 'Need-based', 'STEM', 'Arts', 'Sports', 'Community Service', 'Minority', 'Women in STEM', 'First Generation', 'International'];
const EDUCATION_LEVELS: EducationLevel[] = ['High School', 'Undergraduate', 'Graduate', 'PhD'];

export function Explore() {
  const profile = getProfile();
  const [saved, setSaved] = useState(() => getSavedScholarships());
  const [query, setQuery] = useState('');
  const [eduLevel, setEduLevel] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [maxIncome, setMaxIncome] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [sortBy, setSortBy] = useState<'relevance' | 'amount' | 'deadline'>('relevance');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const matches = useMemo(() =>
    DEMO_SCHOLARSHIPS.map(s => ({ scholarship: s, match: calculateMatchScore(s, profile) })),
    [profile]
  );

  const filtered = useMemo(() => {
    let results = matches;

    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(({ scholarship: s }) =>
        s.name.toLowerCase().includes(q) ||
        s.provider.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.categories.some(c => c.toLowerCase().includes(q))
      );
    }

    if (eduLevel) results = results.filter(({ scholarship: s }) => s.educationLevel.includes(eduLevel as EducationLevel));
    if (category) results = results.filter(({ scholarship: s }) => s.categories.includes(category as ScholarshipCategory));
    if (location) results = results.filter(({ scholarship: s }) => s.location.toLowerCase().includes(location.toLowerCase()));
    if (minAmount) results = results.filter(({ scholarship: s }) => s.amount >= parseInt(minAmount));
    if (maxIncome) results = results.filter(({ scholarship: s }) => !s.maxFamilyIncome || s.maxFamilyIncome >= parseInt(maxIncome));

    switch (sortBy) {
      case 'relevance': return results.sort((a, b) => b.match.score - a.match.score);
      case 'amount': return results.sort((a, b) => b.scholarship.amount - a.scholarship.amount);
      case 'deadline': return results.sort((a, b) => new Date(a.scholarship.deadline).getTime() - new Date(b.scholarship.deadline).getTime());
    }
    return results;
  }, [query, eduLevel, category, location, minAmount, maxIncome, sortBy, matches]);

  const hasFilters = !!(query || eduLevel || category || location || minAmount || maxIncome);

  function clearFilters() {
    setQuery(''); setEduLevel(''); setCategory(''); setLocation(''); setMinAmount(''); setMaxIncome('');
  }

  function handleToggleSave(id: string) {
    toggleSave(id);
    setSaved(getSavedScholarships());
  }

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-main-text">Explore Scholarships</h2>
        <p className="text-sm text-secondary-text mt-1">Discover opportunities tailored to your profile</p>
      </div>

      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-text" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, provider, or keyword..."
            className="w-full h-10 rounded-xl border border-border bg-white pl-9 pr-4 text-sm text-main-text placeholder:text-secondary-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text hover:text-main-text">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="h-10 rounded-xl border border-border bg-white px-3 text-sm text-main-text focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
          <option value="relevance">Sort: Relevance</option>
          <option value="amount">Sort: Amount (High–Low)</option>
          <option value="deadline">Sort: Deadline (Soonest)</option>
        </select>

        <Button
          variant={filtersOpen ? 'secondary' : 'outline'}
          onClick={() => setFiltersOpen(o => !o)}
          className="h-10 gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasFilters && <span className="ml-1 w-2 h-2 rounded-full bg-primary" />}
        </Button>
      </div>

      {/* Filters panel */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mb-4"
          >
            <div className="bg-white rounded-xl border border-border p-5">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-xs font-medium text-secondary-text mb-1.5 uppercase tracking-wide">Education Level</label>
                  <select value={eduLevel} onChange={e => setEduLevel(e.target.value)} className="w-full h-9 rounded-lg border border-border bg-white px-2.5 text-sm text-main-text focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Any level</option>
                    {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-secondary-text mb-1.5 uppercase tracking-wide">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full h-9 rounded-lg border border-border bg-white px-2.5 text-sm text-main-text focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">All categories</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-secondary-text mb-1.5 uppercase tracking-wide">Location</label>
                  <input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. California, US" className="w-full h-9 rounded-lg border border-border bg-white px-2.5 text-sm text-main-text placeholder:text-secondary-text focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-secondary-text mb-1.5 uppercase tracking-wide">Min Award ($)</label>
                  <input type="number" value={minAmount} onChange={e => setMinAmount(e.target.value)} placeholder="e.g. 5000" className="w-full h-9 rounded-lg border border-border bg-white px-2.5 text-sm text-main-text placeholder:text-secondary-text focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-secondary-text mb-1.5 uppercase tracking-wide">Family Income (max)</label>
                  <input type="number" value={maxIncome} onChange={e => setMaxIncome(e.target.value)} placeholder="e.g. 60000" className="w-full h-9 rounded-lg border border-border bg-white px-2.5 text-sm text-main-text placeholder:text-secondary-text focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
              {hasFilters && (
                <div className="mt-4 pt-4 border-t border-border flex justify-end">
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4" /> Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result count */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-secondary-text">
          <span className="font-semibold text-main-text">{filtered.length}</span> scholarship{filtered.length !== 1 ? 's' : ''} found
        </p>
        {hasFilters && (
          <button onClick={clearFilters} className="text-xs text-primary hover:underline flex items-center gap-1">
            <X className="w-3 h-3" /> Clear filters
          </button>
        )}
      </div>

      {/* Results grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="w-8 h-8" />}
          title="No scholarships found"
          description="Try adjusting your search terms or clearing your filters to discover more opportunities."
          action={<Button variant="secondary" onClick={clearFilters}>Clear filters</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(({ scholarship, match }) => (
            <motion.div
              key={scholarship.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ScholarshipCard
                scholarship={scholarship}
                match={match}
                isSaved={saved.some(s => s.scholarshipId === scholarship.id)}
                onToggleSave={handleToggleSave}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
