import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ChevronDown, Trash2, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Application, ApplicationStatus } from '../types';
import { getApplications, saveApplication, deleteApplication, createApplication } from '../lib/storage';
import { DEMO_SCHOLARSHIPS } from '../data/scholarships';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Textarea } from '../components/ui/Input';
import { cn } from '../lib/utils';

const STATUSES: ApplicationStatus[] = ['Saved', 'Not Started', 'In Progress', 'Submitted', 'Under Review', 'Awarded', 'Rejected'];

const statusConfig: Record<ApplicationStatus, { label: string; color: string; bg: string; badgeVariant: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'outline' }> = {
  'Saved': { label: 'Saved', color: 'text-secondary-text', bg: 'bg-gray-50', badgeVariant: 'outline' },
  'Not Started': { label: 'Not Started', color: 'text-secondary-text', bg: 'bg-gray-50', badgeVariant: 'default' },
  'In Progress': { label: 'In Progress', color: 'text-primary', bg: 'bg-primary-light', badgeVariant: 'primary' },
  'Submitted': { label: 'Submitted', color: 'text-warning', bg: 'bg-orange-50', badgeVariant: 'warning' },
  'Under Review': { label: 'Under Review', color: 'text-purple-600', bg: 'bg-purple-50', badgeVariant: 'primary' },
  'Awarded': { label: 'Awarded', color: 'text-success', bg: 'bg-green-50', badgeVariant: 'success' },
  'Rejected': { label: 'Rejected', color: 'text-red-500', bg: 'bg-red-50', badgeVariant: 'danger' },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function Applications() {
  const navigate = useNavigate();
  const [apps, setApps] = useState<Application[]>(() => {
    // Add demo applications if none
    let existing = getApplications();
    if (existing.length === 0) {
      const demo: Application[] = [
        { id: 'demo-1', scholarshipId: 'sch-001', status: 'In Progress', notes: 'Need to finish personal essay. References requested.', createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString() },
        { id: 'demo-2', scholarshipId: 'sch-004', status: 'Submitted', notes: 'Submitted all documents. Awaiting confirmation email.', createdAt: new Date(Date.now() - 14 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(), submittedAt: new Date(Date.now() - 3 * 86400000).toISOString() },
        { id: 'demo-3', scholarshipId: 'sch-002', status: 'Saved', notes: '', createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
      ];
      demo.forEach(d => saveApplication(d));
      existing = demo;
    }
    return existing;
  });

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | ''>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});

  const filtered = apps.filter(app => {
    const scholarship = DEMO_SCHOLARSHIPS.find(s => s.id === app.scholarshipId);
    if (!scholarship) return false;
    if (statusFilter && app.status !== statusFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      return scholarship.name.toLowerCase().includes(q) || scholarship.provider.toLowerCase().includes(q);
    }
    return true;
  });

  function handleStatusChange(id: string, status: ApplicationStatus) {
    setApps(prev => prev.map(a => {
      if (a.id !== id) return a;
      const updated = { ...a, status, updatedAt: new Date().toISOString(), ...(status === 'Submitted' ? { submittedAt: new Date().toISOString() } : {}) };
      saveApplication(updated);
      return updated;
    }));
  }

  function handleNotesSave(id: string) {
    const notes = editingNotes[id] ?? apps.find(a => a.id === id)?.notes ?? '';
    setApps(prev => prev.map(a => {
      if (a.id !== id) return a;
      const updated = { ...a, notes, updatedAt: new Date().toISOString() };
      saveApplication(updated);
      return updated;
    }));
  }

  function handleDelete(id: string) {
    if (!confirm('Remove this application?')) return;
    deleteApplication(id);
    setApps(prev => prev.filter(a => a.id !== id));
  }

  const statusCounts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: apps.filter(a => a.status === s).length }), {} as Record<string, number>);

  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-main-text">My Applications</h2>
          <p className="text-sm text-secondary-text mt-1">Track and manage your scholarship applications</p>
        </div>
        <div className="sm:ml-auto">
          <Button size="sm" onClick={() => navigate('/explore')}>
            <Plus className="w-4 h-4" /> Add Application
          </Button>
        </div>
      </div>

      {/* Status pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={() => setStatusFilter('')}
          className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', !statusFilter ? 'bg-primary text-white' : 'bg-white border border-border text-secondary-text hover:border-primary/40')}
        >
          All ({apps.length})
        </button>
        {STATUSES.filter(s => statusCounts[s] > 0).map(s => {
          const cfg = statusConfig[s];
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s === statusFilter ? '' : s)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-colors', statusFilter === s ? 'bg-primary text-white' : `${cfg.bg} ${cfg.color} hover:opacity-80`)}
            >
              {s} ({statusCounts[s]})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search applications..."
          className="w-full h-10 rounded-xl border border-border bg-white pl-9 pr-4 text-sm text-main-text placeholder:text-secondary-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-8 h-8" />}
          title="No applications yet"
          description="Start by exploring scholarships and tracking your applications here."
          action={<Button onClick={() => navigate('/explore')}>Explore Scholarships</Button>}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map(app => {
            const scholarship = DEMO_SCHOLARSHIPS.find(s => s.id === app.scholarshipId);
            if (!scholarship) return null;
            const cfg = statusConfig[app.status];
            const isExpanded = expandedId === app.id;

            return (
              <Card key={app.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div
                    className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : app.id)}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">{scholarship.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-main-text truncate">{scholarship.name}</p>
                      <p className="text-xs text-secondary-text">{scholarship.provider} · {scholarship.amountLabel}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <Badge variant={cfg.badgeVariant}>{app.status}</Badge>
                      <ChevronDown className={cn('w-4 h-4 text-secondary-text transition-transform', isExpanded && 'rotate-180')} />
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-border p-4 space-y-4">
                          {/* Meta */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-secondary-text">
                            <div><span className="block font-medium text-main-text">Deadline</span>{formatDate(scholarship.deadline)}</div>
                            <div><span className="block font-medium text-main-text">Created</span>{formatDate(app.createdAt)}</div>
                            <div><span className="block font-medium text-main-text">Updated</span>{formatDate(app.updatedAt)}</div>
                            {app.submittedAt && <div><span className="block font-medium text-main-text">Submitted</span>{formatDate(app.submittedAt)}</div>}
                          </div>

                          {/* Status update */}
                          <div>
                            <label className="block text-xs font-medium text-secondary-text mb-1.5">Update Status</label>
                            <select
                              value={app.status}
                              onChange={e => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                              className="h-9 rounded-lg border border-border bg-white px-3 text-sm text-main-text focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>

                          {/* Notes */}
                          <div>
                            <label className="block text-xs font-medium text-secondary-text mb-1.5">Application Notes</label>
                            <textarea
                              value={editingNotes[app.id] ?? app.notes}
                              onChange={e => setEditingNotes(prev => ({ ...prev, [app.id]: e.target.value }))}
                              placeholder="Add notes about this application..."
                              rows={3}
                              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-main-text placeholder:text-secondary-text focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                            />
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2">
                            <Button size="sm" onClick={() => handleNotesSave(app.id)}>Save Notes</Button>
                            <Button variant="outline" size="sm" onClick={() => navigate(`/scholarship/${scholarship.id}`)}>View Details</Button>
                            <Button variant="danger" size="sm" onClick={() => handleDelete(app.id)}>
                              <Trash2 className="w-3.5 h-3.5" /> Remove
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
