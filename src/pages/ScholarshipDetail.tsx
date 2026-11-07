import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark, ExternalLink, CheckCircle2, XCircle, DollarSign, Calendar, GraduationCap, MapPin, FileText, List, Award, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { DEMO_SCHOLARSHIPS } from '../data/scholarships';
import { getProfile, getSavedScholarships, toggleSave, getApplications, createApplication } from '../lib/storage';
import { calculateMatchScore } from '../lib/matchEngine';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';
import { MatchScore } from '../components/ui/ProgressBar';
import { cn } from '../lib/utils';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

export function ScholarshipDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const scholarship = DEMO_SCHOLARSHIPS.find(s => s.id === id);
  const profile = getProfile();
  const [saved, setSaved] = useState(() => getSavedScholarships().some(s => s.scholarshipId === id));
  const [applied, setApplied] = useState(() => getApplications().some(a => a.scholarshipId === id));
  const [toast, setToast] = useState('');

  if (!scholarship) {
    return (
      <div className="p-8 text-center">
        <p className="text-secondary-text">Scholarship not found.</p>
        <Button variant="ghost" onClick={() => navigate('/explore')} className="mt-4">← Back to Explore</Button>
      </div>
    );
  }

  const match = calculateMatchScore(scholarship, profile);
  const days = daysUntil(scholarship.deadline);

  function handleSave() {
    const nowSaved = toggleSave(scholarship!.id);
    setSaved(nowSaved);
    showToast(nowSaved ? 'Scholarship saved!' : 'Removed from saved');
  }

  function handleApply() {
    if (!applied) {
      createApplication(scholarship!.id);
      setApplied(true);
      showToast('Application started! Track it in My Applications.');
    } else {
      navigate('/applications');
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-secondary-text hover:text-main-text mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-20 right-6 z-50 bg-primary text-white px-4 py-2.5 rounded-xl shadow-dropdown text-sm font-medium"
        >
          {toast}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                  {scholarship.categories.map(c => <Badge key={c} variant="primary">{c}</Badge>)}
                  {scholarship.featured && <Badge variant="success">Featured</Badge>}
                </div>
                <h1 className="text-xl font-bold text-main-text">{scholarship.name}</h1>
                <p className="text-secondary-text mt-1">{scholarship.provider}</p>
                <p className="text-sm text-secondary-text mt-4 leading-relaxed">{scholarship.description}</p>
                <p className="text-xs text-secondary-text mt-3 italic opacity-70">⚠ Demo record — illustrative purposes only. Not an actual scholarship listing.</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Eligibility criteria */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card>
              <CardContent>
                <h2 className="text-sm font-semibold text-main-text mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Eligibility Assessment
                </h2>
                <p className="text-xs text-secondary-text mb-4 p-3 bg-primary-light rounded-lg">
                  <strong>Important:</strong> This is an estimated match based on your profile. It does not guarantee eligibility. Always verify requirements directly with the scholarship provider.
                </p>
                <div className="space-y-3">
                  {match.matchedCriteria.map((c, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-main-text">{c}</span>
                    </div>
                  ))}
                  {match.missingCriteria.map((c, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-main-text">{c}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-secondary-text mt-4 italic">{match.explanation}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Required documents */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent>
                <h2 className="text-sm font-semibold text-main-text mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Required Documents
                </h2>
                <ul className="space-y-2">
                  {scholarship.requiredDocuments.map((doc, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-main-text">
                      <div className="w-5 h-5 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                        <span className="text-primary text-xs font-semibold">{i + 1}</span>
                      </div>
                      {doc}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Application process */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card>
              <CardContent>
                <h2 className="text-sm font-semibold text-main-text mb-4 flex items-center gap-2">
                  <List className="w-4 h-4 text-primary" /> Application Process
                </h2>
                <ol className="space-y-3">
                  {scholarship.applicationProcess.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-xs font-semibold mt-0.5">{i + 1}</div>
                      <span className="text-sm text-main-text leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </motion.div>

          {/* Benefits */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent>
                <h2 className="text-sm font-semibold text-main-text mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" /> Benefits
                </h2>
                <ul className="space-y-2">
                  {scholarship.benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-main-text">
                      <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">

          {/* Key info */}
          <Card className="sticky top-20">
            <CardContent className="space-y-4">
              <div className="p-4 bg-primary-light rounded-xl text-center">
                <p className="text-xs text-primary font-medium">Award Amount</p>
                <p className="text-2xl font-bold text-primary mt-1">{scholarship.amountLabel}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-warning" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-text">Deadline</p>
                    <p className="text-sm font-medium text-main-text">{formatDate(scholarship.deadline)}</p>
                    <p className={cn('text-xs', days <= 14 ? 'text-warning font-medium' : 'text-secondary-text')}>
                      {days > 0 ? `${days} days remaining` : 'Deadline passed'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-text">Education Level</p>
                    <p className="text-sm font-medium text-main-text">{scholarship.educationLevel.join(', ')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-secondary-text" />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-text">Location</p>
                    <p className="text-sm font-medium text-main-text">{scholarship.location}</p>
                  </div>
                </div>
              </div>

              {/* Match score */}
              <div className="border-t border-border pt-4">
                <p className="text-xs text-secondary-text mb-2">Your estimated match</p>
                <MatchScore score={match.score} size="md" />
              </div>

              {/* CTA buttons */}
              <div className="space-y-2 pt-2">
                <Button size="lg" className="w-full" onClick={handleApply}>
                  {applied ? 'View Application →' : 'Start Application'}
                </Button>
                <Button variant="outline" size="lg" className="w-full" onClick={handleSave}>
                  <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
                  {saved ? 'Saved' : 'Save Scholarship'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-secondary-text"
                  onClick={() => alert('In a real app this would open the official scholarship portal. This is a demo record.')}
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Official Application Link (Demo)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
