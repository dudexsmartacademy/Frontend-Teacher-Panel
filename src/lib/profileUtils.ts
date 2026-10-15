export interface ProfileData {
  name: string;
  facultyId: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  qualification: string;
  office: string;
  avatarUrl?: string;
}

export const PROFILE_STORAGE_KEY = "dudex_teacher_profile_data";
export const PROFILE_UPDATED_EVENT = "teacher-profile-updated";

/**
 * Calculates responsive initials from the teacher name.
 * e.g., "Prof. Alex Morgan" -> "PA", "Alex Morgan" -> "AM", "John" -> "JO"
 */
export function getTeacherInitials(name?: string): string {
  if (!name || !name.trim()) return "T";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "T";
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase().slice(0, 2);
}

/**
 * Loads stored profile data from localStorage with a default fallback.
 */
export function getStoredTeacherProfile(): ProfileData {
  try {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === "object") {
        return {
          name: parsed.name || "Prof. Alex Morgan",
          facultyId: parsed.facultyId || "FAC099",
          email: parsed.email || "faculty.google@dudex.edu",
          phone: parsed.phone || "+91 98765 43210",
          department: parsed.department || "Computer Science & Engineering",
          designation: parsed.designation || "Faculty / Assistant Professor",
          qualification: parsed.qualification || "M.Tech in Computer Science, Ph.D. in AI & Robotics",
          office: parsed.office || "Block B, Room 402, Technology Wing",
          avatarUrl: parsed.avatarUrl || "",
        };
      }
    }
  } catch (e) {
    console.error("Failed to load profile from storage", e);
  }

  return {
    name: "Prof. Alex Morgan",
    facultyId: "FAC099",
    email: "faculty.google@dudex.edu",
    phone: "+91 98765 43210",
    department: "Computer Science & Engineering",
    designation: "Faculty / Assistant Professor",
    qualification: "M.Tech in Computer Science, Ph.D. in AI & Robotics",
    office: "Block B, Room 402, Technology Wing",
    avatarUrl: "",
  };
}

/**
 * Saves profile data to localStorage and dispatches a sync event across the application.
 */
export function saveStoredTeacherProfile(data: ProfileData): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
  } catch (e) {
    console.error("Failed to save profile to storage", e);
  }
}
