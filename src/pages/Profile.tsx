import React, { useState } from 'react';
import { Save, User, GraduationCap, Building2, DollarSign, Tag, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { StudentProfile, EducationLevel, ScholarshipCategory } from '../types';
import { getProfile, saveProfile } from '../lib/storage';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { cn } from '../lib/utils';

const CATEGORIES: ScholarshipCategory[] = ['Merit', 'Need-based', 'STEM', 'Arts', 'Sports', 'Community Service', 'Minority', 'Women in STEM', 'First Generation', 'International'];
const EDUCATION_LEVELS: EducationLevel[] = ['High School', 'Undergraduate', 'Graduate', 'PhD'];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export function Profile() {
  const [profile, setProfile] = useState<StudentProfile>(getProfile());
  const [saved, setSaved] = useState(false);

  function handleChange(field: keyof StudentProfile, value: unknown) {
    setProfile(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function handleSave() {
    saveProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function toggleCategory(cat: ScholarshipCategory) {
    const cats = profile.categories.includes(cat)
      ? profile.categories.filter(c => c !== cat)
      : [...profile.categories, cat];
    handleChange('categories', cats);
  }

  return (
    <div className="p-5 lg:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-main-text">My Profile</h2>
          <p className="text-sm text-secondary-text mt-1">Keep your profile accurate for better scholarship matches</p>
        </div>
        <Button onClick={handleSave} className="gap-2 self-start">
          {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </Button>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-5">

        {/* Personal Info */}
        <motion.div variants={item}>
          <Card>
            <CardContent>
              <h3 className="text-sm font-semibold text-main-text mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name" value={profile.name} onChange={e => handleChange('name', e.target.value)} />
                <Input label="Email Address" type="email" value={profile.email} onChange={e => handleChange('email', e.target.value)} />
                <Input label="Phone Number" value={profile.phone} onChange={e => handleChange('phone', e.target.value)} />
                <Input label="Date of Birth" type="date" value={profile.dateOfBirth} onChange={e => handleChange('dateOfBirth', e.target.value)} />
                <div>
                  <label className="block text-sm font-medium text-main-text mb-1.5">Gender</label>
                  <select value={profile.gender} onChange={e => handleChange('gender', e.target.value)} className="w-full h-9 rounded-lg border border-border bg-white px-3 text-sm text-main-text focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Non-binary</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
                <Input label="Nationality" value={profile.nationality} onChange={e => handleChange('nationality', e.target.value)} />
                <Input label="State / Province" value={profile.state} onChange={e => handleChange('state', e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Academic Info */}
        <motion.div variants={item}>
          <Card>
            <CardContent>
              <h3 className="text-sm font-semibold text-main-text mb-4 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" /> Academic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-main-text mb-1.5">Education Level</label>
                  <select value={profile.educationLevel} onChange={e => handleChange('educationLevel', e.target.value as EducationLevel)} className="w-full h-9 rounded-lg border border-border bg-white px-3 text-sm text-main-text focus:outline-none focus:ring-2 focus:ring-primary/20">
                    {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <Input label="Field of Study / Major" value={profile.course} onChange={e => handleChange('course', e.target.value)} />
                <div>
                  <label className="block text-sm font-medium text-main-text mb-1.5">GPA (out of 4.0)</label>
                  <input
                    type="number"
                    min="0" max="4" step="0.1"
                    value={profile.gpa}
                    onChange={e => handleChange('gpa', parseFloat(e.target.value))}
                    className="w-full h-9 rounded-lg border border-border bg-white px-3 text-sm text-main-text focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-main-text mb-1.5">Expected Graduation Year</label>
                  <input
                    type="number"
                    min="2024" max="2035"
                    value={profile.graduationYear}
                    onChange={e => handleChange('graduationYear', parseInt(e.target.value))}
                    className="w-full h-9 rounded-lg border border-border bg-white px-3 text-sm text-main-text focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Institution */}
        <motion.div variants={item}>
          <Card>
            <CardContent>
              <h3 className="text-sm font-semibold text-main-text mb-4 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" /> Institution Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input label="Institution Name" value={profile.institution} onChange={e => handleChange('institution', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-main-text mb-1.5">First-Generation College Student?</label>
                  <div className="flex items-center gap-6 mt-2">
                    {[true, false].map(val => (
                      <label key={String(val)} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" checked={profile.firstGeneration === val} onChange={() => handleChange('firstGeneration', val)} className="accent-primary" />
                        <span className="text-sm text-main-text">{val ? 'Yes' : 'No'}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-secondary-text mt-1">Neither parent holds a 4-year college degree</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Financial */}
        <motion.div variants={item}>
          <Card>
            <CardContent>
              <h3 className="text-sm font-semibold text-main-text mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" /> Financial Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-main-text mb-1.5">Annual Family Income (USD)</label>
                  <input
                    type="number"
                    value={profile.annualFamilyIncome}
                    onChange={e => handleChange('annualFamilyIncome', parseInt(e.target.value))}
                    className="w-full h-9 rounded-lg border border-border bg-white px-3 text-sm text-main-text focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <p className="text-xs text-secondary-text mt-3">This information is stored locally and used only for calculating scholarship match scores. It is never transmitted or shared.</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Categories */}
        <motion.div variants={item}>
          <Card>
            <CardContent>
              <h3 className="text-sm font-semibold text-main-text mb-1 flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" /> Scholarship Interests
              </h3>
              <p className="text-xs text-secondary-text mb-4">Select the categories that best represent your interests and eligibility</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
                      profile.categories.includes(cat)
                        ? 'bg-primary text-white'
                        : 'bg-gray-50 text-secondary-text border border-border hover:border-primary/40 hover:text-primary'
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bio */}
        <motion.div variants={item}>
          <Card>
            <CardContent>
              <h3 className="text-sm font-semibold text-main-text mb-4">About Me</h3>
              <textarea
                value={profile.bio}
                onChange={e => handleChange('bio', e.target.value)}
                placeholder="Write a brief bio about your academic journey, goals, and interests..."
                rows={4}
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-main-text placeholder:text-secondary-text focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="flex justify-end pb-4">
          <Button onClick={handleSave} size="lg">
            {saved ? <><CheckCircle className="w-4 h-4" /> Changes Saved!</> : <><Save className="w-4 h-4" /> Save Profile</>}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
