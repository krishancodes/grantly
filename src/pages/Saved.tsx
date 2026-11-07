import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { DEMO_SCHOLARSHIPS } from '../data/scholarships';
import { getSavedScholarships, toggleSave } from '../lib/storage';
import { getProfile } from '../lib/storage';
import { calculateMatchScore } from '../lib/matchEngine';
import { ScholarshipCard } from '../components/scholarships/ScholarshipCard';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';

export function Saved() {
  const navigate = useNavigate();
  const profile = getProfile();
  const [saved, setSaved] = useState(() => getSavedScholarships());
  const [query, setQuery] = useState('');

  const savedScholarships = DEMO_SCHOLARSHIPS
    .filter(s => saved.some(sv => sv.scholarshipId === s.id))
    .filter(s => !query || s.name.toLowerCase().includes(query.toLowerCase()) || s.provider.toLowerCase().includes(query.toLowerCase()));

  function handleToggleSave(id: string) {
    toggleSave(id);
    setSaved(getSavedScholarships());
  }

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-main-text">Saved Scholarships</h2>
        <p className="text-sm text-secondary-text mt-1">{saved.length} scholarship{saved.length !== 1 ? 's' : ''} bookmarked</p>
      </div>

      {saved.length > 0 && (
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search saved scholarships..."
            className="w-full h-10 rounded-xl border border-border bg-white pl-9 pr-4 text-sm text-main-text placeholder:text-secondary-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      )}

      {savedScholarships.length === 0 ? (
        <EmptyState
          icon={<Bookmark className="w-8 h-8" />}
          title={saved.length === 0 ? 'No saved scholarships' : 'No results found'}
          description={saved.length === 0 ? 'Bookmark scholarships while exploring to easily find them here later.' : 'Try a different search term.'}
          action={saved.length === 0 ? <Button onClick={() => navigate('/explore')}>Explore Scholarships</Button> : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {savedScholarships.map(scholarship => (
            <motion.div key={scholarship.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <ScholarshipCard
                scholarship={scholarship}
                match={calculateMatchScore(scholarship, profile)}
                isSaved={true}
                onToggleSave={handleToggleSave}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
