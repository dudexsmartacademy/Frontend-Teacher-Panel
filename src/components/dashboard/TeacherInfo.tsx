import { useState, useEffect } from "react";
import {
  getStoredTeacherProfile,
  PROFILE_UPDATED_EVENT,
  getTeacherInitials,
} from "../../lib/profileUtils";

export default function TeacherInfo() {
  const [profile, setProfile] = useState(getStoredTeacherProfile);

  useEffect(() => {
    const handleProfileSync = () => {
      setProfile(getStoredTeacherProfile());
    };

    window.addEventListener(PROFILE_UPDATED_EVENT, handleProfileSync);
    window.addEventListener("storage", handleProfileSync);

    return () => {
      window.removeEventListener(PROFILE_UPDATED_EVENT, handleProfileSync);
      window.removeEventListener("storage", handleProfileSync);
    };
  }, []);

  const initials = getTeacherInitials(profile.name);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-900 text-lg font-semibold text-white shadow-xs ring-2 ring-[#e9ded0]">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="select-none tracking-wider font-bold">
              {initials}
            </span>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {profile.name}
          </h2>

          <p className="mt-0.5 text-xs font-semibold text-[#9c7449]">
            Faculty ID: {profile.facultyId}
          </p>

          <p className="text-xs text-gray-500 mt-0.5">
            Department: {profile.department}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2">
        <div>
          <p className="text-xs text-gray-500">
            Assigned Classes
          </p>

          <p className="mt-1 text-sm font-medium text-gray-900">
            AI &amp; DS - B
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">
            Assigned Subjects
          </p>

          <p className="mt-1 text-sm font-medium text-gray-900">
            Python, Data Structures
          </p>
        </div>
      </div>
    </div>
  );
}