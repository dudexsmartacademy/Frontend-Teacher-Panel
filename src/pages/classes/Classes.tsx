import {
  Calendar,
  Clock,
  Edit,
  Plus,
  School,
  Search,
  Trash2,
  Users,
  Video,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DeleteModal from "../../components/DeleteModal";
import CustomSelect from "../../components/CustomSelect";

export type ClassStatus = "Active" | "Scheduled" | "Completed" | "Archived";

export type ClassItem = {
  id: string;
  name: string;
  department: string;
  section: string;
  subject: string;
  batch: string;
  academicYear: string;
  studentsCount: number;
  classDate?: string;
  schedule: string;
  meetLink?: string;
  room?: string;
  description: string;
  status: ClassStatus;
};

export const defaultClasses: ClassItem[] = [
  {
    id: "1",
    name: "Python Basics",
    department: "AI & DS",
    section: "Section B",
    subject: "Python",
    batch: "2024–2028",
    academicYear: "2024–2028",
    studentsCount: 64,
    schedule: "10:00 - 11:00",
    meetLink: "https://meet.google.com/pyt-bsc-2026",
    description: "Introduction to Python programming, data structures and algorithms.",
    status: "Active",
  },
  {
    id: "2",
    name: "Data Structures - Arrays",
    department: "AI & DS",
    section: "Section A",
    subject: "Data Structures",
    batch: "2024–2028",
    academicYear: "2024–2028",
    studentsCount: 62,
    schedule: "11:00 - 12:00",
    meetLink: "https://meet.google.com/dsa-arr-2026",
    description: "Arrays, linked lists, stacks, queues and basic array operations.",
    status: "Active",
  },
  {
    id: "3",
    name: "Python Functions & OOP",
    department: "CSE",
    section: "Section A",
    subject: "Programming",
    batch: "2023–2027",
    academicYear: "2023–2027",
    studentsCount: 58,
    schedule: "14:00 - 15:00",
    meetLink: "https://meet.google.com/pyt-oop-2026",
    description: "Functions, parameters, scope, object-oriented concepts and return values.",
    status: "Completed",
  },
];

const LOCAL_STORAGE_KEY = "dudex_teacher_classes";

export function loadClassesFromStorage(): ClassItem[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to load classes from localStorage", e);
  }
  return defaultClasses;
}

export function saveClassesToStorage(classesList: ClassItem[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(classesList));
  } catch (e) {
    console.error("Failed to save classes to localStorage", e);
  }
}

export default function Classes() {
  const [classesList, setClassesList] = useState<ClassItem[]>(() =>
    loadClassesFromStorage()
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [classToDelete, setClassToDelete] = useState<ClassItem | null>(null);

  const filteredClasses = useMemo(() => {
    return classesList.filter((item) => {
      const searchMatch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.subject.toLowerCase().includes(search.toLowerCase()) ||
        item.department.toLowerCase().includes(search.toLowerCase()) ||
        item.section.toLowerCase().includes(search.toLowerCase());

      const statusMatch =
        statusFilter === "All" || item.status === statusFilter;

      return searchMatch && statusMatch;
    });
  }, [classesList, search, statusFilter]);

  const handleConfirmDelete = () => {
    if (!classToDelete) return;

    setClassesList((current) => {
      const updated = current.filter((item) => item.id !== classToDelete.id);
      saveClassesToStorage(updated);
      return updated;
    });

    setClassToDelete(null);
  };

  const getStatusClass = (status: ClassStatus) => {
    if (status === "Active") {
      return "bg-blue-50 text-blue-700";
    }
    if (status === "Scheduled") {
      return "bg-yellow-50 text-yellow-700";
    }
    if (status === "Completed") {
      return "bg-green-50 text-green-700";
    }
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage classes for your assigned students
          </p>
        </div>

        <Link
          to="/classes/create"
          className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          <Plus size={18} />
          Create Class
        </Link>
      </div>

      {/* Summary Stat Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Active Classes</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {classesList.filter((item) => item.status === "Active").length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Upcoming</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {classesList.filter((item) => item.status === "Scheduled").length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {classesList.filter((item) => item.status === "Completed").length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Classes</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {classesList.length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search classes..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="w-full md:w-48">
            <CustomSelect
              value={statusFilter}
              onChange={(val) => setStatusFilter(val as "All" | ClassStatus)}
              options={[
                { value: "All", label: "All Status" },
                { value: "Active", label: "Active" },
                { value: "Scheduled", label: "Scheduled" },
                { value: "Completed", label: "Completed" },
                { value: "Archived", label: "Archived" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Class Cards Grid */}
      <div className="grid gap-5 lg:grid-cols-2">
        {filteredClasses.map((classItem) => (
          <div
            key={classItem.id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            {/* Card Header */}
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
                  <School size={21} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    {classItem.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {classItem.subject}
                    {(classItem.batch || classItem.department) && (
                      <> · {classItem.batch || classItem.department}</>
                    )}
                    {classItem.section ? ` - ${classItem.section}` : ""}
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                  classItem.status
                )}`}
              >
                {classItem.status}
              </span>
            </div>

            {/* Description */}
            <p className="mb-4 text-sm text-gray-500">
              {classItem.description}
            </p>

            {/* Information Grid */}
            <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
              {(classItem.batch || classItem.academicYear) && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>{classItem.batch || classItem.academicYear}</span>
                </div>
              )}

              {classItem.schedule && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} />
                  <span>{classItem.schedule}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users size={16} />
                <span>{classItem.studentsCount} Students</span>
              </div>

              {classItem.meetLink && (
                <a
                  href={classItem.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline truncate"
                  title={classItem.meetLink}
                >
                  <Video size={16} className="shrink-0" />
                  <span className="truncate">Meet Link</span>
                </a>
              )}
            </div>

            {/* Actions */}
            <div className="mt-5 grid grid-cols-3 gap-2">
              <Link
                to={`/classes/${classItem.id}/edit`}
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                <Edit size={16} />
                Edit
              </Link>

              <Link
                to={`/classes/${classItem.id}`}
                className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 transition"
              >
                <School size={16} />
                Dashboard
              </Link>

              <button
                type="button"
                onClick={() => setClassToDelete(classItem)}
                className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredClasses.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white py-12 text-center">
          <School size={32} className="mx-auto mb-3 text-gray-300" />
          <p className="text-sm text-gray-500">No classes found.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!classToDelete}
        onClose={() => setClassToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Class"
        itemName={classToDelete ? `${classToDelete.name} (${classToDelete.section})` : undefined}
        message="Are you sure you want to delete this class? All associated schedule and details will be removed."
      />
    </div>
  );
}