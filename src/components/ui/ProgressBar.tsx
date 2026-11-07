import React from 'react';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ value, max = 100, className, color = '#6255E7', size = 'md' }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const heights = { sm: 'h-1', md: 'h-1.5', lg: 'h-2' };

  return (
    <div className={cn('w-full bg-gray-100 rounded-full overflow-hidden', heights[size], className)}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

interface MatchScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function MatchScore({ score, size = 'md', showLabel = true }: MatchScoreProps) {
  const color = score >= 75 ? '#16A36A' : score >= 50 ? '#6255E7' : '#E9A23B';
  const label = score >= 75 ? 'High match' : score >= 50 ? 'Good match' : 'Partial match';
  const bgColor = score >= 75 ? 'text-success bg-green-50' : score >= 50 ? 'text-primary bg-primary-light' : 'text-warning bg-orange-50';

  if (size === 'sm') {
    return (
      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium', bgColor)}>
        {score}% match
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-secondary-text">{showLabel ? label : 'Match score'}</span>
        <span className="font-semibold" style={{ color }}>{score}%</span>
      </div>
      <ProgressBar value={score} color={color} size="md" />
    </div>
  );
}
