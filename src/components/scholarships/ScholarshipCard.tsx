import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Calendar, DollarSign, GraduationCap, ArrowRight } from 'lucide-react';
import { Scholarship } from '../../types';
import { MatchResult } from '../../lib/matchEngine';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { MatchScore } from '../ui/ProgressBar';
import { cn } from '../../lib/utils';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / 86400000);
}

interface ScholarshipCardProps {
  scholarship: Scholarship;
  match?: MatchResult;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

export function ScholarshipCard({ scholarship, match, isSaved, onToggleSave }: ScholarshipCardProps) {
  const navigate = useNavigate();
  const days = daysUntil(scholarship.deadline);

  return (
    <Card className="flex flex-col h-full hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
      <CardContent className="flex flex-col h-full gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {scholarship.categories.slice(0, 2).map(cat => (
                <Badge key={cat} variant="primary">{cat}</Badge>
              ))}
              {scholarship.featured && <Badge variant="success">Featured</Badge>}
            </div>
            <h3 className="text-sm font-semibold text-main-text leading-tight line-clamp-2">{scholarship.name}</h3>
            <p className="text-xs text-secondary-text mt-1">{scholarship.provider}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleSave(scholarship.id); }}
            className={cn(
              'p-1.5 rounded-lg transition-colors flex-shrink-0',
              isSaved ? 'text-primary bg-primary-light' : 'text-secondary-text hover:text-primary hover:bg-primary-light'
            )}
          >
            <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
            <DollarSign className="w-4 h-4 text-success flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-secondary-text">Award</p>
              <p className="text-sm font-semibold text-main-text truncate">{scholarship.amountLabel}</p>
            </div>
          </div>
          <div className={cn('flex items-center gap-2 rounded-lg px-3 py-2', days <= 14 ? 'bg-orange-50' : 'bg-gray-50')}>
            <Calendar className={cn('w-4 h-4 flex-shrink-0', days <= 14 ? 'text-warning' : 'text-secondary-text')} />
            <div className="min-w-0">
              <p className="text-xs text-secondary-text">Deadline</p>
              <p className={cn('text-sm font-semibold truncate', days <= 14 ? 'text-warning' : 'text-main-text')}>
                {days <= 0 ? 'Expired' : days <= 14 ? `${days}d left` : formatDate(scholarship.deadline)}
              </p>
            </div>
          </div>
        </div>

        {/* Education level */}
        <div className="flex items-center gap-2">
          <GraduationCap className="w-3.5 h-3.5 text-secondary-text flex-shrink-0" />
          <span className="text-xs text-secondary-text">{scholarship.educationLevel.join(', ')}</span>
        </div>

        {/* Match score */}
        {match && (
          <div className="border-t border-border pt-3">
            <MatchScore score={match.score} size="md" />
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto pt-2 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => navigate(`/scholarship/${scholarship.id}`)}
          >
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Demo notice */}
        <p className="text-xs text-secondary-text text-center opacity-60">Demo record — not an actual scholarship listing</p>
      </CardContent>
    </Card>
  );
}
