import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Megaphone,
  MessageCircle,
  LifeBuoy,
  StickyNote,
  Edit,
} from "lucide-react";

import { teacherAssignments } from "../../data/teacher/teacherData";

type CommunicationType =
  | "Announcements"
  | "Support Requests"
  | "Class Discussion"
  | "Teacher Notes";

type CommunicationItem = {
  id: number;
  title: string;
  content: string;
  className: string;
  classId: string;
  subject: string;
  student?: string;
  status: string;
  date: string;
  type: CommunicationType;
};

const communications: CommunicationItem[] = [
  {
    id: 1,
    title: "Python Assessment Reminder",
    content:
      "Python Fundamentals Assessment is scheduled for 10 September.",
    className: "AI & DS - Section B",
    classId: "1",
    subject: "Python",
    status: "Published",
    date: "2026-09-08",
    type: "Announcements",
  },
  {
    id: 2,
    title: "Data Structures Class Update",
    content:
      "Unit 1 revision will be covered in the upcoming class.",
    className: "AI & DS - Section A",
    classId: "2",
    subject: "Data Structures",
    status: "Published",
    date: "2026-09-08",
    type: "Announcements",
  },
  {
    id: 3,
    title: "Assessment Access Issue",
    content:
      "Student is unable to access the assigned assessment.",
    className: "AI & DS - Section B",
    classId: "1",
    subject: "Python",
    student: "Arun Kumar",
    status: "Open",
    date: "2026-09-08",
    type: "Support Requests",
  },
  {
    id: 4,
    title: "Material Access Request",
    content:
      "Student requested access to the Python study material.",
    className: "AI & DS - Section B",
    classId: "1",
    subject: "Python",
    student: "Priya Sharma",
    status: "Resolved",
    date: "2026-09-07",
    type: "Support Requests",
  },
  {
    id: 5,
    title: "Python Functions Discussion",
    content:
      "Students are discussing function arguments and return values.",
    className: "AI & DS - Section B",
    classId: "1",
    subject: "Python",
    status: "Active",
    date: "2026-09-08",
    type: "Class Discussion",
  },
  {
    id: 6,
    title: "Data Structures Questions",
    content: "Discussion related to stacks and queues.",
    className: "AI & DS - Section A",
    classId: "2",
    subject: "Data Structures",
    status: "Active",
    date: "2026-09-07",
    type: "Class Discussion",
  },
  {
    id: 7,
    title: "Follow-up Required",
    content:
      "Follow up with students having incomplete assessments.",
    className: "AI & DS - Section B",
    classId: "1",
    subject: "Python",
    status: "Private",
    date: "2026-09-08",
    type: "Teacher Notes",
  },
  {
    id: 8,
    title: "Attendance Follow-up",
    content:
      "Review students with pending attendance corrections.",
    className: "CSE - Section A",
    classId: "3",
    subject: "Programming",
    status: "Private",
    date: "2026-09-07",
    type: "Teacher Notes",
  },
];

export default function CommunicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const communication = communications.find(
    (item) => item.id === Number(id)
  );

  if (!communication) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">
            Communication Not Found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            The requested communication could not be found.
          </p>

          <button
            type="button"
            onClick={() => navigate("/communication")}
            className="mt-5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Back to Communication
          </button>
        </div>
      </div>
    );
  }

  const isAuthorized = teacherAssignments.some(
    (assignment) =>
      assignment.active &&
      assignment.classId === communication.classId &&
      assignment.subject === communication.subject
  );

  if (!isAuthorized) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-red-700">
            Access Denied
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            You are not authorized to view this communication.
          </p>

          <button
            type="button"
            onClick={() => navigate("/communication")}
            className="mt-5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Back to Communication
          </button>
        </div>
      </div>
    );
  }

  const getIcon = () => {
    switch (communication.type) {
      case "Announcements":
        return <Megaphone size={22} />;

      case "Support Requests":
        return <LifeBuoy size={22} />;

      case "Class Discussion":
        return <MessageCircle size={22} />;

      case "Teacher Notes":
        return <StickyNote size={22} />;

      default:
        return <MessageCircle size={22} />;
    }
  };

  const getStatusClass = () => {
    switch (communication.status) {
      case "Open":
        return "bg-yellow-50 text-yellow-700";

      case "Resolved":
        return "bg-green-50 text-green-700";

      case "Active":
        return "bg-blue-50 text-blue-700";

      case "Private":
        return "bg-gray-100 text-gray-700";

      case "Published":
        return "bg-green-50 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/communication"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Communication Details
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              View communication information.
            </p>
          </div>
        </div>

        {communication.type !== "Teacher Notes" && (
          <Link
            to={`/communication/${communication.id}/edit`}
            className="flex w-fit items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            <Edit size={17} />
            Edit
          </Link>
        )}
      </div>

      {/* Main Card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Title Section */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                {getIcon()}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">
                  {communication.type}
                </p>

                <h2 className="mt-1 text-xl font-semibold text-gray-900">
                  {communication.title}
                </h2>
              </div>
            </div>

            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${getStatusClass()}`}
            >
              {communication.status}
            </span>
          </div>
        </div>

        {/* Information */}
        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Class
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {communication.className}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Subject
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {communication.subject}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Date
            </p>

            <p className="mt-1 text-sm font-medium text-gray-900">
              {communication.date}
            </p>
          </div>

          {communication.student && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Student
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {communication.student}
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="border-t border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">
            Content
          </h3>

          <div className="mt-3 rounded-lg bg-gray-50 p-4">
            <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700">
              {communication.content}
            </p>
          </div>
        </div>

        {/* Access Information */}
        <div className="border-t border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">
            Communication Information
          </h3>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500">
                Communication Type
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {communication.type}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-500">
                Current Status
              </p>

              <p className="mt-1 text-sm font-medium text-gray-900">
                {communication.status}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}