import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Archive,
  Copy,
  Edit,
  Eye,
  Plus,
  Search,
  RotateCcw,
} from "lucide-react";
import { teacherAssignments } from "../../data/teacher/teacherData";
import CustomSelect from "../../components/CustomSelect";

type NoteStatus = "Published" | "Draft" | "Archived";

type Note = {
  id: string;
  title: string;
  subject: string;
  topic: string;
  classId: string;
  className: string;
  description: string;
  createdAt: string;
  status: NoteStatus;
};

const initialNotes: Note[] = [
  {
    id: "N001",
    title: "Python Variables and Data Types",
    subject: "Python",
    topic: "Python Basics",
    classId: "1",
    className: "Batch 1",
    description:
      "Study notes covering variables, data types and basic Python syntax.",
    createdAt: "2026-09-05",
    status: "Published",
  },
  {
    id: "N002",
    title: "Python Conditional Statements",
    subject: "Python",
    topic: "Control Flow",
    classId: "1",
    className: "Batch 1",
    description:
      "Notes covering if, elif and else statements.",
    createdAt: "2026-09-06",
    status: "Draft",
  },
  {
    id: "N003",
    title: "Arrays Introduction",
    subject: "Data Structures",
    topic: "Arrays",
    classId: "1",
    className: "Batch 1",
    description:
      "Introduction to arrays and basic array operations.",
    createdAt: "2026-09-07",
    status: "Published",
  },
];

export default function Notes() {
  const [notes, setNotes] =
    useState<Note[]>(initialNotes);

  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("All");

  const [statusFilter, setStatusFilter] =
    useState<"All" | NoteStatus>("All");

  const [showArchived, setShowArchived] =
    useState(false);

  const authorizedClassIds = useMemo(
    () =>
      teacherAssignments
        .filter((assignment) => assignment.active)
        .map((assignment) => assignment.classId),
    []
  );

  const batchOptions = useMemo(() => [
    { value: "All", label: "All Batches" },
    { value: "1", label: "Batch 1" },
    { value: "2", label: "Batch 2" },
    { value: "3", label: "Batch 3" },
  ], []);

  const authorizedNotes = useMemo(
    () =>
      notes.filter((note) =>
        authorizedClassIds.includes(note.classId)
      ),
    [notes, authorizedClassIds]
  );

  const filteredNotes = authorizedNotes.filter(
    (note) => {
      const matchesSearch =
        note.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        note.subject
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        note.topic
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        note.className
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesBatch =
        batchFilter === "All" ||
        note.classId === batchFilter ||
        note.className.toLowerCase().includes(batchFilter.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        note.status === statusFilter;

      const matchesArchived =
        showArchived
          ? note.status === "Archived"
          : note.status !== "Archived";

      return (
        matchesSearch &&
        matchesBatch &&
        matchesStatus &&
        matchesArchived
      );
    }
  );

  const archiveNote = (id: string) => {
    const note = notes.find(
      (item) => item.id === id
    );

    if (!note) {
      return;
    }

    const authorized = teacherAssignments.some(
      (assignment) =>
        assignment.active &&
        assignment.classId === note.classId &&
        assignment.subject === note.subject
    );

    if (!authorized) {
      alert(
        "You are not authorized to modify this note."
      );
      return;
    }

    setNotes((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status: "Archived" }
          : item
      )
    );
  };

  const restoreNote = (id: string) => {
    const note = notes.find(
      (item) => item.id === id
    );

    if (!note) {
      return;
    }

    const authorized = teacherAssignments.some(
      (assignment) =>
        assignment.active &&
        assignment.classId === note.classId &&
        assignment.subject === note.subject
    );

    if (!authorized) {
      alert(
        "You are not authorized to modify this note."
      );
      return;
    }

    setNotes((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status: "Draft" }
          : item
      )
    );
  };

  const duplicateNote = (id: string) => {
    const note = notes.find(
      (item) => item.id === id
    );

    if (!note) {
      return;
    }

    const authorized = teacherAssignments.some(
      (assignment) =>
        assignment.active &&
        assignment.classId === note.classId &&
        assignment.subject === note.subject
    );

    if (!authorized) {
      alert(
        "You are not authorized to duplicate this note."
      );
      return;
    }

    const duplicate: Note = {
      ...note,
      id: `N${Date.now()}`,
      title: `${note.title} - Copy`,
      status: "Draft",
      createdAt: new Date()
        .toISOString()
        .slice(0, 10),
    };

    setNotes((current) => [
      duplicate,
      ...current,
    ]);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Notes
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create and manage study notes for your assigned batches.
          </p>
        </div>

        <Link
          to="/notes/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          <Plus size={18} />
          Create Note
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border border-gray-300 bg-[#fffdf9] py-2 pl-10 pr-3 text-xs sm:text-sm outline-none focus:border-gray-900 transition"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:items-center gap-3">
          {/* Batch Filter */}
          <div className="w-full md:w-44">
            <CustomSelect
              value={batchFilter}
              onChange={(val) => setBatchFilter(val)}
              options={batchOptions}
            />
          </div>

          <div className="w-full md:w-44">
            <CustomSelect
              value={statusFilter}
              onChange={(val) => setStatusFilter(val as "All" | NoteStatus)}
              options={[
                { value: "All", label: "All Status" },
                { value: "Published", label: "Published" },
                { value: "Draft", label: "Draft" },
                { value: "Archived", label: "Archived" },
              ]}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowArchived((current) => !current)
          }
          className={`rounded-lg border px-4 py-2 text-sm font-medium ${
            showArchived
              ? "border-gray-900 bg-gray-900 text-white"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {showArchived
            ? "Show Active"
            : "Show Archived"}
        </button>
      </div>

      {/* Notes Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                  Note
                </th>

                <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                  Subject
                </th>

                <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                  Topic
                </th>

                <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                  Batch
                </th>

                <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                  Created
                </th>

                <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>

                <th className="px-5 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <tr
                    key={note.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {note.title}
                        </p>

                        <p className="mt-1 max-w-xs text-xs text-gray-500">
                          {note.description}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {note.subject}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {note.topic}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {note.className}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {note.createdAt}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          note.status === "Published"
                            ? "bg-green-100 text-green-700"
                            : note.status === "Draft"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {note.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/notes/${note.id}`}
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                          title="View"
                        >
                          <Eye size={17} />
                        </Link>

                        {note.status !==
                          "Archived" && (
                          <Link
                            to={`/notes/${note.id}/edit`}
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            title="Edit"
                          >
                            <Edit size={17} />
                          </Link>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            duplicateNote(note.id)
                          }
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                          title="Duplicate"
                        >
                          <Copy size={17} />
                        </button>

                        {note.status ===
                        "Archived" ? (
                          <button
                            type="button"
                            onClick={() =>
                              restoreNote(note.id)
                            }
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            title="Restore"
                          >
                            <RotateCcw
                              size={17}
                            />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              archiveNote(note.id)
                            }
                            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            title="Archive"
                          >
                            <Archive size={17} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-sm text-gray-500"
                  >
                    No notes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}