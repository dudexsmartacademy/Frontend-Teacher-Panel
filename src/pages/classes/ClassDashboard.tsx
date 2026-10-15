import { ArrowLeft, Edit, School } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { loadClassesFromStorage } from "./Classes";

export default function ClassDashboard() {
  const { id } = useParams<{ id: string }>();
  const classesList = loadClassesFromStorage();
  const currentClass =
    classesList.find((item) => item.id === id) || classesList[0];

  return (
    <div className="space-y-6 p-6">
      {/* Back button */}
      <div>
        <Link
          to="/classes"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Classes
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <School size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentClass?.name || "AI & DS"}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span>{currentClass?.department}</span>
                <span>•</span>
                <span>{currentClass?.section}</span>
                <span>•</span>
                <span>{currentClass?.academicYear || "Batch 2024–2028"}</span>
                <span>•</span>
                <span className="font-medium text-gray-700">
                  {currentClass?.subject}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/classes/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Edit size={16} />
            Edit Class
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {currentClass?.studentsCount || 64}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Average Attendance</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">86%</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Average Marks</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">76%</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Average Grade</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">B+</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Assessment Completion</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">82%</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">At-Risk Students</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">6</p>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900">Class Sections & Actions</h2>
          <p className="mt-0.5 text-xs text-gray-500">Quickly jump into sections for this class</p>
        </div>

        <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
          <Link
            to="/students"
            className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <span>Students</span>
          </Link>

          <Link
            to="/attendance"
            className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <span>Attendance</span>
          </Link>

          <Link
            to="/mcq-assessments"
            className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <span>MCQ Assessments</span>
          </Link>

          <Link
            to="/results"
            className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <span>Results</span>
          </Link>

          <Link
            to="/performance"
            className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <span>Performance</span>
          </Link>

          <Link
            to="/live-classes"
            className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <span>Live Classes</span>
          </Link>

          <Link
            to="/materials"
            className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <span>Materials</span>
          </Link>

          <Link
            to="/announcements"
            className="flex flex-col items-center justify-center rounded-lg border border-gray-200 p-4 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <span>Announcements</span>
          </Link>
        </div>
      </div>
    </div>
  );
}