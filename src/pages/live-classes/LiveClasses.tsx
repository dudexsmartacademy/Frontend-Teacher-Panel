import {
  Calendar,
  Clock,
  Edit,
  Eye,
  Link as LinkIcon,
  Plus,
  Search,
  Trash2,
  Video,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { teacherAssignments } from "../../data/teacher/teacherData";
import DeleteModal from "../../components/DeleteModal";
import CustomSelect from "../../components/CustomSelect";

type LiveClassStatus =
  | "Scheduled"
  | "Live"
  | "Completed"
  | "Cancelled";

type LiveClass = {
  id: string;
  title: string;
  description: string;
  classId: string;
  className: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  platform: string;
  meetingUrl: string;
  status: LiveClassStatus;
};

const initialLiveClasses: LiveClass[] = [
  {
    id: "LC001",
    title: "Python Basics",
    description: "Introduction to Python programming.",
    classId: "1",
    className: "AI & DS - Section B",
    subject: "Python",
    date: "2026-09-10",
    startTime: "10:00",
    endTime: "11:00",
    platform: "Google Meet",
    meetingUrl: "https://meet.google.com/example-python",
    status: "Scheduled",
  },
  {
    id: "LC002",
    title: "Data Structures - Arrays",
    description: "Arrays and basic array operations.",
    classId: "2",
    className: "AI & DS - Section A",
    subject: "Data Structures",
    date: "2026-09-11",
    startTime: "11:00",
    endTime: "12:00",
    platform: "Google Meet",
    meetingUrl: "https://meet.google.com/example-arrays",
    status: "Live",
  },
  {
    id: "LC003",
    title: "Python Functions",
    description: "Functions, parameters and return values.",
    classId: "1",
    className: "AI & DS - Section B",
    subject: "Python",
    date: "2026-09-12",
    startTime: "14:00",
    endTime: "15:00",
    platform: "Google Meet",
    meetingUrl: "https://meet.google.com/example-functions",
    status: "Completed",
  },
];

export default function LiveClasses() {
  const [liveClasses, setLiveClasses] =
    useState<LiveClass[]>(initialLiveClasses);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [liveClassToDelete, setLiveClassToDelete] = useState<LiveClass | null>(null);

  const authorizedClassIds = useMemo(
    () =>
      new Set(
        teacherAssignments
          .filter((assignment) => assignment.active)
          .map((assignment) => assignment.classId),
      ),
    [],
  );

  const authorizedLiveClasses = useMemo(
    () =>
      liveClasses.filter((liveClass) =>
        authorizedClassIds.has(liveClass.classId),
      ),
    [liveClasses, authorizedClassIds],
  );

  const filteredLiveClasses = useMemo(() => {
    return authorizedLiveClasses.filter((liveClass) => {
      const searchMatch =
        liveClass.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        liveClass.subject
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        liveClass.className
          .toLowerCase()
          .includes(search.toLowerCase());

      const statusMatch =
        statusFilter === "All" ||
        liveClass.status === statusFilter;

      return searchMatch && statusMatch;
    });
  }, [authorizedLiveClasses, search, statusFilter]);

  const handleConfirmDelete = () => {
    if (!liveClassToDelete) return;

    setLiveClasses((current) =>
      current.filter((liveClass) => liveClass.id !== liveClassToDelete.id),
    );
    setLiveClassToDelete(null);
  };

  const getStatusClass = (status: LiveClassStatus) => {
    if (status === "Live") {
      return "bg-blue-50 text-blue-700";
    }

    if (status === "Scheduled") {
      return "bg-yellow-50 text-yellow-700";
    }

    if (status === "Completed") {
      return "bg-green-50 text-green-700";
    }

    return "bg-red-50 text-red-700";
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Live Classes
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create and manage live classes for your assigned students
          </p>
        </div>

        <Link
          to="/live-classes/create"
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Create Live Class
        </Link>
      </div>

      {/* Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Live Now</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {
              authorizedLiveClasses.filter(
                (item) => item.status === "Live",
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Upcoming</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {
              authorizedLiveClasses.filter(
                (item) => item.status === "Scheduled",
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {
              authorizedLiveClasses.filter(
                (item) => item.status === "Completed",
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Classes</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {authorizedLiveClasses.length}
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
              placeholder="Search live classes..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="w-full md:w-48">
            <CustomSelect
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              options={[
                { value: "All", label: "All Status" },
                { value: "Scheduled", label: "Scheduled" },
                { value: "Live", label: "Live" },
                { value: "Completed", label: "Completed" },
                { value: "Cancelled", label: "Cancelled" },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Live Class Cards */}
      <div className="grid gap-5 lg:grid-cols-2">
        {filteredLiveClasses.map((liveClass) => (
          <div
            key={liveClass.id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            {/* Card Header */}
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
                  <Video size={21} />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    {liveClass.title}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {liveClass.subject} · {liveClass.className}
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                  liveClass.status,
                )}`}
              >
                {liveClass.status}
              </span>
            </div>

            {/* Description */}
            <p className="mb-4 text-sm text-gray-500">
              {liveClass.description}
            </p>

            {/* Information */}
            <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} />
                {liveClass.date}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} />
                {liveClass.startTime} - {liveClass.endTime}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Video size={16} />
                {liveClass.platform}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <LinkIcon size={16} />
                Meeting Link
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Link
                to={`/live-classes/${liveClass.id}`}
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Eye size={16} />
                View
              </Link>

              <Link
                to={`/live-classes/${liveClass.id}/edit`}
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <Edit size={16} />
                Edit
              </Link>

              {liveClass.status === "Live" ? (
                <a
                  href={liveClass.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <Video size={16} />
                  Join
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      liveClass.meetingUrl,
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                  className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <LinkIcon size={16} />
                  Link
                </button>
              )}

              <button
                type="button"
                onClick={() => setLiveClassToDelete(liveClass)}
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
      {filteredLiveClasses.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white py-12 text-center">
          <Video
            size={32}
            className="mx-auto mb-3 text-gray-300"
          />

          <p className="text-sm text-gray-500">
            No live classes found.
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!liveClassToDelete}
        onClose={() => setLiveClassToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Live Class"
        itemName={liveClassToDelete ? `${liveClassToDelete.title} (${liveClassToDelete.className})` : undefined}
        message="Are you sure you want to delete this live class session? Students will no longer be able to join via this link."
      />
    </div>
  );
}