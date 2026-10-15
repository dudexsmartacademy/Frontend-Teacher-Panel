import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Edit,
  FileText,
  Image,
} from "lucide-react";
import { teacherAssignments } from "../../data/teacher/teacherData";

type Attachment = {
  name: string;
  type: "pdf" | "image";
};

type Note = {
  id: string;
  noteDate: string;
  title: string;
  description: string;
  classId: string;
  className: string;
  subject: string;
  teacher: string;
  createdAt: string;
  updatedAt: string;
  attachments: Attachment[];
  status: "Published" | "Draft" | "Archived";
};

const notes: Note[] = [
  {
    id: "N001",
    noteDate: "2026-09-05",
    title: "Python Variables and Data Types",
    description:
      "Study notes covering variables, data types and basic Python syntax.",
    classId: "1",
    className: "Batch 1",
    subject: "Python",
    teacher: "Pranay Rebeyro",
    createdAt: "2026-09-05 09:30",
    updatedAt: "2026-09-05 09:30",
    attachments: [
      {
        name: "python-variables.pdf",
        type: "pdf",
      },
    ],
    status: "Published",
  },
  {
    id: "N002",
    noteDate: "2026-09-06",
    title: "Python Conditional Statements",
    description:
      "Notes covering if, elif and else statements.",
    classId: "1",
    className: "Batch 1",
    subject: "Python",
    teacher: "Pranay Rebeyro",
    createdAt: "2026-09-06 10:00",
    updatedAt: "2026-09-06 10:00",
    attachments: [
      {
        name: "conditional-statements.pdf",
        type: "pdf",
      },
    ],
    status: "Draft",
  },
  {
    id: "N003",
    noteDate: "2026-09-07",
    title: "Arrays Introduction",
    description:
      "Introduction to arrays and basic array operations.",
    classId: "1",
    className: "Batch 1",
    subject: "Data Structures",
    teacher: "Pranay Rebeyro",
    createdAt: "2026-09-07 11:00",
    updatedAt: "2026-09-07 11:00",
    attachments: [
      {
        name: "array-example-1.png",
        type: "image",
      },
      {
        name: "array-example-2.png",
        type: "image",
      },
    ],
    status: "Published",
  },
];

export default function NoteDetails() {
  const { id } = useParams();

  const note = notes.find(
    (item) => item.id === id
  );

  if (!note) {
    return (
      <div className="p-6">
        <Link
          to="/notes"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Notes
        </Link>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-8 text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Note Not Found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            The requested note does not exist.
          </p>
        </div>
      </div>
    );
  }

  const authorized = teacherAssignments.some(
    (assignment) =>
      assignment.active &&
      assignment.classId === note.classId &&
      assignment.subject === note.subject
  );

  if (!authorized) {
    return (
      <div className="p-6">
        <Link
          to="/notes"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Notes
        </Link>

        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-xl font-semibold text-red-700">
            Access Denied
          </h1>

          <p className="mt-2 text-sm text-red-600">
            You are not authorized to view this note.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/notes"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Notes
        </Link>

        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {note.title}
              </h1>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  note.status === "Published"
                    ? "bg-green-100 text-green-700"
                    : note.status === "Draft"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                }`}
              >
                {note.status}
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              {note.className} · {note.subject}
            </p>
          </div>

          {note.status !== "Archived" && (
            <Link
              to={`/notes/${note.id}/edit`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Edit size={17} />
              Edit Note
            </Link>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Note Information
            </h2>

            <div className="mt-5 space-y-5">
              <div className="flex items-start gap-3">
                <Calendar
                  size={19}
                  className="mt-0.5 text-gray-500"
                />

                <div>
                  <p className="text-xs text-gray-500">
                    Note Date
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {note.noteDate}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Description
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-700">
                  {note.description}
                </p>
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Attachments
            </h2>

            <div className="mt-4 space-y-3">
              {note.attachments.map(
                (attachment, index) => (
                  <div
                    key={`${attachment.name}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 sm:p-4 min-w-0 max-w-full"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      {attachment.type === "pdf" ? (
                        <FileText
                          size={22}
                          className="shrink-0 text-gray-500"
                        />
                      ) : (
                        <Image
                          size={22}
                          className="shrink-0 text-gray-500"
                        />
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs sm:text-sm font-medium text-gray-900" title={attachment.name}>
                          {attachment.name}
                        </p>

                        <p className="mt-0.5 text-[11px] sm:text-xs text-gray-500">
                          {attachment.type === "pdf"
                            ? "PDF"
                            : "Image"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="shrink-0 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() =>
                        console.log(
                          "Open attachment:",
                          attachment.name
                        )
                      }
                    >
                      View
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Note Details
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs text-gray-500">
                  Teacher
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {note.teacher}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Batch
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {note.className}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Subject / Topic
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {note.subject}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Created At
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {note.createdAt}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Updated At
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {note.updatedAt}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}