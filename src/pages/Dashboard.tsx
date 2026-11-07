import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, FileText, CheckCircle, DollarSign, ArrowRight, Clock, Zap, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { MatchScore, ProgressBar } from '../components/ui/ProgressBar';
import { DEMO_SCHOLARSHIPS } from '../data/scholarships';
import { getProfile, getApplications, getSavedScholarships } from '../lib/storage';
import { getTopMatches } from '../lib/matchEngine';
import { Application, Scholarship } from '../types';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function getHour() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

const statusColors: Record<string, string> = {
  'Not Started': '#E9EAF0',
  'In Progress': '#6255E7',
  'Submitted': '#E9A23B',
  'Under Review': '#7C3AED',
  'Awarded': '#16A36A',
  'Rejected': '#EF4444',
  'Saved': '#94A3B8',
};

export function Dashboard() {
  const navigate = useNavigate();
  const profile = getProfile();
  const applications = getApplications();
  const saved = getSavedScholarships();
  const topMatches = getTopMatches(DEMO_SCHOLARSHIPS, profile, 4);

  const inProgress = applications.filter(a => a.status === 'In Progress').length;
  const submitted = applications.filter(a => a.status === 'Submitted' || a.status === 'Under Review').length;
  const totalFunding = topMatches.slice(0, 3).reduce((sum, m) => sum + m.scholarship.amount, 0);

  const upcomingDeadlines = DEMO_SCHOLARSHIPS
    .filter(s => daysUntil(s.deadline) > 0 && daysUntil(s.deadline) <= 90)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 4);

  const chartData = [
    { status: 'Saved', count: saved.length || 2 },
    { status: 'In Progress', count: inProgress || 1 },
    { status: 'Submitted', count: submitted || 1 },
    { status: 'Awarded', count: applications.filter(a => a.status === 'Awarded').length || 0 },
  ];

  const recentActivity = [
    { text: 'Saved National Merit Excellence Award', time: '2 hours ago', icon: '🔖' },
    { text: 'Profile updated — GPA and course information', time: '1 day ago', icon: '✏️' },
    { text: 'Applied to STEM Innovation Fellowship', time: '3 days ago', icon: '📋' },
    { text: 'Discovered 5 new scholarship matches', time: '5 days ago', icon: '✨' },
  ];

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

        {/* Welcome */}
        <motion.div variants={item}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-main-text">Good {getHour()}, {profile.name.split(' ')[0]} 👋</h2>
              <p className="text-secondary-text mt-1 text-sm">Let's find the right opportunities for your future.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/explore')}>
                <Zap className="w-4 h-4" /> Explore
              </Button>
              <Button size="sm" onClick={() => navigate('/assistant')}>
                <BookOpen className="w-4 h-4" /> AI Assistant
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Scholarships Matched', value: topMatches.length, sub: `of ${DEMO_SCHOLARSHIPS.length} available`, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary-light' },
            { label: 'In Progress', value: inProgress || 1, sub: 'applications active', icon: FileText, color: 'text-warning', bg: 'bg-orange-50' },
            { label: 'Submitted', value: submitted || 1, sub: 'awaiting review', icon: CheckCircle, color: 'text-success', bg: 'bg-green-50' },
            { label: 'Potential Funding', value: `$${(totalFunding).toLocaleString()}`, sub: 'from top 3 matches', icon: DollarSign, color: 'text-primary', bg: 'bg-primary-light' },
          ].map(({ label, value, sub, icon: Icon, color, bg }) => (
            <Card key={label} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-secondary-text font-medium">{label}</p>
                  <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
                  <p className="text-xs text-secondary-text mt-1">{sub}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${bg}`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
              </div>
            </Card>
          ))}
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Top Matches */}
          <motion.div variants={item} className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-main-text">Personalized Recommendations</h3>
                    <p className="text-xs text-secondary-text mt-0.5">Based on your profile — not a guarantee of eligibility</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/explore')}>
                    View all <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {topMatches.map(({ scholarship, match }) => (
                  <div
                    key={scholarship.id}
                    onClick={() => navigate(`/scholarship/${scholarship.id}`)}
                    className="flex items-center gap-4 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary-light/20 transition-all duration-150 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">{scholarship.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-main-text truncate">{scholarship.name}</p>
                      <p className="text-xs text-secondary-text">{scholarship.provider}</p>
                      <div className="mt-1.5 flex items-center gap-3">
                        <span className="text-xs font-semibold text-success">{scholarship.amountLabel}</span>
                        <span className="text-xs text-secondary-text">·</span>
                        <span className="text-xs text-secondary-text">Due {formatDate(scholarship.deadline)}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <MatchScore score={match.score} size="sm" showLabel={false} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming deadlines */}
          <motion.div variants={item}>
            <Card className="h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-warning" />
                  <h3 className="text-sm font-semibold text-main-text">Upcoming Deadlines</h3>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {upcomingDeadlines.map(s => {
                  const days = daysUntil(s.deadline);
                  return (
                    <div
                      key={s.id}
                      onClick={() => navigate(`/scholarship/${s.id}`)}
                      className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary-light/20 transition-all cursor-pointer"
                    >
                      <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${days <= 14 ? 'bg-orange-50' : 'bg-gray-50'}`}>
                        <span className={`text-sm font-bold ${days <= 14 ? 'text-warning' : 'text-main-text'}`}>{days}</span>
                        <span className={`text-xs ${days <= 14 ? 'text-warning' : 'text-secondary-text'}`}>days</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-main-text leading-tight line-clamp-1">{s.name}</p>
                        <p className="text-xs text-secondary-text mt-0.5">{formatDate(s.deadline)}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Application progress chart */}
          <motion.div variants={item}>
            <Card>
              <CardHeader className="pb-4">
                <h3 className="text-sm font-semibold text-main-text">Application Progress</h3>
                <p className="text-xs text-secondary-text mt-0.5">Your applications by status</p>
              </CardHeader>
              <CardContent className="pt-0 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barSize={28}>
                    <XAxis dataKey="status" tick={{ fontSize: 11, fill: '#777B89' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#777B89' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      cursor={{ fill: '#F0EDFF' }}
                      contentStyle={{ border: '1px solid #E9EAF0', borderRadius: 8, fontSize: 12 }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={index} fill={statusColors[entry.status] || '#6255E7'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent activity */}
          <motion.div variants={item}>
            <Card>
              <CardHeader className="pb-4">
                <h3 className="text-sm font-semibold text-main-text">Recent Activity</h3>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {recentActivity.map((act, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-lg flex-shrink-0">{act.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-main-text leading-tight">{act.text}</p>
                      <p className="text-xs text-secondary-text mt-0.5">{act.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Profile completion */}
        <motion.div variants={item}>
          <Card>
            <CardContent className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-main-text">Profile Completion</h3>
                <p className="text-xs text-secondary-text mt-0.5 mb-3">A complete profile helps us find your best scholarship matches</p>
                <ProgressBar value={82} color="#6255E7" size="md" />
                <p className="text-xs text-secondary-text mt-1">82% complete</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => navigate('/profile')}>
                Complete Profile <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

      </motion.div>
    </div>
  );
}
