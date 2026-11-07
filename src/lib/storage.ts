import { Application, ApplicationStatus, SavedScholarship, StudentProfile, Notification } from '../types';
import { DEFAULT_PROFILE, DEFAULT_NOTIFICATIONS } from '../data/scholarships';

const KEYS = {
  applications: 'grantly_applications',
  saved: 'grantly_saved',
  profile: 'grantly_profile',
  notifications: 'grantly_notifications',
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
}

// Applications
export function getApplications(): Application[] {
  return load<Application[]>(KEYS.applications, []);
}

export function saveApplication(app: Application): void {
  const apps = getApplications();
  const idx = apps.findIndex(a => a.id === app.id);
  if (idx >= 0) apps[idx] = app;
  else apps.push(app);
  save(KEYS.applications, apps);
}

export function deleteApplication(id: string): void {
  const apps = getApplications().filter(a => a.id !== id);
  save(KEYS.applications, apps);
}

export function createApplication(scholarshipId: string): Application {
  const app: Application = {
    id: `app-${Date.now()}`,
    scholarshipId,
    status: 'Not Started',
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveApplication(app);
  return app;
}

// Saved / Bookmarks
export function getSavedScholarships(): SavedScholarship[] {
  return load<SavedScholarship[]>(KEYS.saved, []);
}

export function toggleSave(scholarshipId: string): boolean {
  const saved = getSavedScholarships();
  const idx = saved.findIndex(s => s.scholarshipId === scholarshipId);
  if (idx >= 0) {
    saved.splice(idx, 1);
    save(KEYS.saved, saved);
    return false;
  } else {
    saved.push({ scholarshipId, savedAt: new Date().toISOString() });
    save(KEYS.saved, saved);
    return true;
  }
}

export function isSaved(scholarshipId: string): boolean {
  return getSavedScholarships().some(s => s.scholarshipId === scholarshipId);
}

// Profile
export function getProfile(): StudentProfile {
  return load<StudentProfile>(KEYS.profile, DEFAULT_PROFILE);
}

export function saveProfile(profile: StudentProfile): void {
  save(KEYS.profile, profile);
}

// Notifications
export function getNotifications(): Notification[] {
  return load<Notification[]>(KEYS.notifications, DEFAULT_NOTIFICATIONS);
}

export function markNotificationRead(id: string): void {
  const notifs = getNotifications();
  const n = notifs.find(n => n.id === id);
  if (n) n.read = true;
  save(KEYS.notifications, notifs);
}

export function markAllRead(): void {
  const notifs = getNotifications().map(n => ({ ...n, read: true }));
  save(KEYS.notifications, notifs);
}
