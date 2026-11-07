import { Scholarship, StudentProfile, ScholarshipCategory, EducationLevel } from '../types';

export interface MatchResult {
  score: number;
  matchedCriteria: string[];
  missingCriteria: string[];
  explanation: string;
}

export function calculateMatchScore(scholarship: Scholarship, profile: StudentProfile): MatchResult {
  const matchedCriteria: string[] = [];
  const missingCriteria: string[] = [];
  let totalPoints = 0;
  let earnedPoints = 0;

  // Education level match (25 points)
  totalPoints += 25;
  if (scholarship.educationLevel.includes('Any') || scholarship.educationLevel.includes(profile.educationLevel)) {
    matchedCriteria.push(`Education level (${profile.educationLevel})`);
    earnedPoints += 25;
  } else {
    missingCriteria.push(`Education level must be: ${scholarship.educationLevel.join(' or ')}`);
  }

  // GPA match (20 points)
  if (scholarship.minGPA !== undefined) {
    totalPoints += 20;
    if (profile.gpa >= scholarship.minGPA) {
      matchedCriteria.push(`GPA requirement (${profile.gpa.toFixed(1)} ≥ ${scholarship.minGPA.toFixed(1)})`);
      earnedPoints += 20;
    } else {
      missingCriteria.push(`Minimum GPA of ${scholarship.minGPA.toFixed(1)} required (you have ${profile.gpa.toFixed(1)})`);
    }
  }

  // Income match (15 points)
  if (scholarship.maxFamilyIncome !== undefined) {
    totalPoints += 15;
    if (profile.annualFamilyIncome <= scholarship.maxFamilyIncome) {
      matchedCriteria.push(`Income eligibility (under $${scholarship.maxFamilyIncome.toLocaleString()})`);
      earnedPoints += 15;
    } else {
      missingCriteria.push(`Family income must be under $${scholarship.maxFamilyIncome.toLocaleString()}`);
    }
  }

  // Category interest match (20 points)
  totalPoints += 20;
  const categoryOverlap = scholarship.categories.filter(cat =>
    profile.categories.includes(cat as ScholarshipCategory)
  );
  if (categoryOverlap.length > 0) {
    matchedCriteria.push(`Interest area match: ${categoryOverlap.join(', ')}`);
    earnedPoints += Math.min(20, (categoryOverlap.length / scholarship.categories.length) * 20);
  } else {
    missingCriteria.push(`No matching interest areas (scholarship focuses on: ${scholarship.categories.join(', ')})`);
  }

  // First generation match (10 points)
  const isFirstGenScholarship = scholarship.categories.includes('First Generation');
  if (isFirstGenScholarship) {
    totalPoints += 10;
    if (profile.firstGeneration) {
      matchedCriteria.push('First-generation college student status');
      earnedPoints += 10;
    } else {
      missingCriteria.push('First-generation student status required');
    }
  }

  // Location match (10 points)
  totalPoints += 10;
  if (scholarship.location === 'Any State' || scholarship.location === 'International' || scholarship.location === 'United States') {
    matchedCriteria.push('Open location eligibility');
    earnedPoints += 10;
  } else if (scholarship.location.includes(profile.state)) {
    matchedCriteria.push(`Location match (${profile.state})`);
    earnedPoints += 10;
  } else {
    missingCriteria.push(`Must be in ${scholarship.location}`);
  }

  const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

  let explanation = '';
  if (score >= 85) {
    explanation = `Excellent match! Your profile aligns strongly with this scholarship's requirements. ${matchedCriteria.length} out of ${matchedCriteria.length + missingCriteria.length} criteria satisfied.`;
  } else if (score >= 65) {
    explanation = `Good match. Your profile meets most requirements. Consider addressing ${missingCriteria.length} gap(s) to strengthen your application.`;
  } else if (score >= 40) {
    explanation = `Partial match. You meet some criteria, but ${missingCriteria.length} requirement(s) may be challenging to satisfy.`;
  } else {
    explanation = `Low match. This scholarship has specific requirements that differ significantly from your current profile.`;
  }

  return { score, matchedCriteria, missingCriteria, explanation };
}

export function getTopMatches(scholarships: Scholarship[], profile: StudentProfile, limit = 5) {
  return scholarships
    .map(s => ({ scholarship: s, match: calculateMatchScore(s, profile) }))
    .sort((a, b) => b.match.score - a.match.score)
    .slice(0, limit);
}
