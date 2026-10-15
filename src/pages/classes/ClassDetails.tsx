import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  ExternalLink,
  Users,
} from "lucide-react";
import { teacherAssignments } from "../../data/teacher/teacherData";

type LiveClass = {
  id: string;
  title: string;
  classId: string;
  className: string;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  meetingLink: string;
  description: string;
  status: "Scheduled" | "Live" | "Completed" | "Cancelled";
};

const liveClasses: LiveClass[] = [
  {
    id: "LC001",
    title: "Python Basics",
    classId: "1",
    className: "AI & DS - Section B",
    subject: "Python",
    date: "2026-09-09",
    startTime: "10:00",
    endTime: "11:00",
    meetingLink: "https://meet.google.com/example-python",
    description:
      "Introduction to Python programming, variables, data types and basic syntax.",
    status: "Scheduled",
  },
  {
    id: "LC002",
    title: "Data Structures - Arrays",
    classId: "2",
    className: "AI & DS - Section A",
    subject: "Data Structures",
    date: "2026-09-10",
    startTime: "11:00",
    endTime: "12:00",
    meetingLink: "https://meet.google.com/example-arrays",
    description:
      "Understanding arrays and common array operations.",
    status: "Live",
  },
  {
    id: "LC003",
    title: "Python Functions",
    classId: "1",
    className: "AI & DS - Section B",
    subject: "Python",
    date: "2026-09-06",
    startTime: "09:00",
    endTime: "10:00",
    meetingLink: "https://meet.google.com/example-functions",
    description:
      "Understanding functions, parameters and return values.",
    status: "Completed",
  },
];

export default function ClassDetails() {
  const { id } = useParams();

  const liveClass = liveClasses.find(
    (item) => item.id === id || item.classId === id
  );

  if (!liveClass) {
    return (
      <div className="p-6">
        <Link
          to="/classes"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Live Classes
        </Link>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-8 text-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Live Class Not Found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            The requested live class does not exist.
          </p>
        </div>
      </div>
    );
  }

  const authorized = teacherAssignments.some(
    (assignment) =>
      assignment.active &&
      assignment.classId === liveClass.classId &&
      assignment.subject === liveClass.subject
  );

  if (!authorized) {
    return (
      <div className="p-6">
        <Link
          to="/classes"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Live Classes
        </Link>

        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-xl font-semibold text-red-700">
            Access Denied
          </h1>

          <p className="mt-2 text-sm text-red-600">
            You are not authorized to view this live class.
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
          to="/classes"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Live Classes
        </Link>

        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {liveClass.title}
              </h1>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  liveClass.status === "Scheduled"
                    ? "bg-blue-100 text-blue-700"
                    : liveClass.status === "Live"
                      ? "bg-green-100 text-green-700"
                      : liveClass.status === "Completed"
                        ? "bg-gray-100 text-gray-700"
                        : "bg-red-100 text-red-700"
                }`}
              >
                {liveClass.status}
              </span>
            </div>

            <p className="mt-1 text-sm text-gray-500">
              {liveClass.className} · {liveClass.subject}
            </p>
          </div>

          {liveClass.status === "Scheduled" && (
            <Link
              to={`/classes/${liveClass.id}/edit`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Edit size={17} />
              Edit Live Class
            </Link>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Live Class Information
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <Calendar
                  size={20}
                  className="mt-0.5 text-gray-500"
                />

                <div>
                  <p className="text-xs text-gray-500">
                    Date
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {liveClass.date}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock
                  size={20}
                  className="mt-0.5 text-gray-500"
                />

                <div>
                  <p className="text-xs text-gray-500">
                    Time
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {liveClass.startTime} -{" "}
                    {liveClass.endTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users
                  size={20}
                  className="mt-0.5 text-gray-500"
                />

                <div>
                  <p className="text-xs text-gray-500">
                    Class
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {liveClass.className}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Subject
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {liveClass.subject}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900">
                Description
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {liveClass.description}
              </p>
            </div>
          </div>
        </div>

        {/* Meeting */}
        <div>
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Meeting
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Use the meeting link to join the live class.
            </p>

            <a
              href={liveClass.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800"
            >
              <ExternalLink size={17} />
              Open Meeting
            </a>

            <div className="mt-4 rounded-lg bg-gray-50 p-3">
              <p className="break-all text-xs text-gray-600">
                {liveClass.meetingLink}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
