import React, { useState } from 'react';
import { Bell, Shield, Palette, Database, ChevronRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-primary' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  );
}

export function Settings() {
  const [settings, setSettings] = useState({
    deadlineReminders: true,
    newMatches: true,
    applicationUpdates: true,
    weeklyDigest: false,
    emailNotifications: true,
    darkMode: false,
    compactView: false,
    showMatchScores: true,
  });
  const [saved, setSaved] = useState(false);

  function toggle(key: keyof typeof settings) {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleClearData() {
    if (!confirm('This will clear all saved scholarships, applications, and profile changes (demo data will be restored). Continue?')) return;
    localStorage.clear();
    window.location.reload();
  }

  const sections = [
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { key: 'deadlineReminders', label: 'Deadline Reminders', desc: 'Get notified 14 and 7 days before deadlines' },
        { key: 'newMatches', label: 'New Scholarship Matches', desc: 'Alerts when new scholarships match your profile' },
        { key: 'applicationUpdates', label: 'Application Updates', desc: 'Status changes on tracked applications' },
        { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly summary of opportunities and tips' },
        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
      ] as const,
    },
    {
      title: 'Display',
      icon: Palette,
      items: [
        { key: 'compactView', label: 'Compact Card View', desc: 'Show scholarship cards in a more compact layout' },
        { key: 'showMatchScores', label: 'Show Match Scores', desc: 'Display estimated match scores on scholarship cards' },
      ] as const,
    },
  ];

  return (
    <div className="p-5 lg:p-8 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-main-text">Settings</h2>
          <p className="text-sm text-secondary-text mt-1">Customize your Grantly experience</p>
        </div>
        <Button onClick={handleSave} size="sm">
          {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : 'Save Preferences'}
        </Button>
      </div>

      <div className="space-y-5">
        {sections.map(({ title, icon: Icon, items }) => (
          <motion.div key={title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent>
                <h3 className="text-sm font-semibold text-main-text mb-4 flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary" /> {title}
                </h3>
                <div className="space-y-4">
                  {items.map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-main-text">{label}</p>
                        <p className="text-xs text-secondary-text">{desc}</p>
                      </div>
                      <Toggle checked={settings[key]} onChange={() => toggle(key)} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Privacy */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent>
              <h3 className="text-sm font-semibold text-main-text mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" /> Privacy & Data
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-main-text">Data Storage</p>
                  <p className="text-xs text-secondary-text mt-1">All your data — profile, applications, saved scholarships — is stored locally in your browser. Nothing is sent to external servers.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-main-text">Scholarship Data</p>
                  <p className="text-xs text-secondary-text mt-1">All scholarship records are demo data for illustrative purposes. They do not represent actual scholarship availability, amounts, or deadlines.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Data management */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent>
              <h3 className="text-sm font-semibold text-main-text mb-4 flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" /> Data Management
              </h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" size="sm" onClick={handleClearData}>
                  Clear All Local Data
                </Button>
              </div>
              <p className="text-xs text-secondary-text mt-3">Clearing data will reset all applications, saved scholarships, and profile to defaults.</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* About */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent>
              <h3 className="text-sm font-semibold text-main-text mb-3">About Grantly</h3>
              <div className="space-y-2 text-sm text-secondary-text">
                <p>Grantly is a scholarship discovery and management platform demo.</p>
                <p><strong className="text-main-text">Version:</strong> 1.0.0 (Demo)</p>
                <p><strong className="text-main-text">Technology:</strong> React, TypeScript, Tailwind CSS, Vite</p>
                <p className="text-xs mt-3 italic">All scholarship data is for demonstration purposes only. Eligibility match scores are estimates and do not guarantee actual scholarship eligibility.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
