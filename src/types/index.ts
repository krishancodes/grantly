export type EducationLevel = 'High School' | 'Undergraduate' | 'Graduate' | 'PhD' | 'Any';
export type ScholarshipCategory = 'Merit' | 'Need-based' | 'STEM' | 'Arts' | 'Sports' | 'Community Service' | 'Minority' | 'Women in STEM' | 'First Generation' | 'International';
export type ApplicationStatus = 'Saved' | 'Not Started' | 'In Progress' | 'Submitted' | 'Under Review' | 'Awarded' | 'Rejected';

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  amount: number;
  amountLabel: string;
  deadline: string;
  educationLevel: EducationLevel[];
  categories: ScholarshipCategory[];
  location: string;
  description: string;
  eligibilityCriteria: EligibilityCriterion[];
  requiredDocuments: string[];
  applicationProcess: string[];
  benefits: string[];
  minGPA?: number;
  maxFamilyIncome?: number;
  nationality?: string;
  applicationUrl: string;
  featured?: boolean;
}

export interface EligibilityCriterion {
  label: string;
  key: string;
  value: string | number;
}

export interface StudentProfile {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  state: string;
  educationLevel: EducationLevel;
  course: string;
  institution: string;
  gpa: number;
  graduationYear: number;
  annualFamilyIncome: number;
  firstGeneration: boolean;
  categories: ScholarshipCategory[];
  bio: string;
}

export interface SavedScholarship {
  scholarshipId: string;
  savedAt: string;
}

export interface Application {
  id: string;
  scholarshipId: string;
  status: ApplicationStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'deadline' | 'match' | 'status' | 'tip';
  read: boolean;
  createdAt: string;
}
