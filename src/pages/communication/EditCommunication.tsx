import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
} from "lucide-react";

import { teacherAssignments } from "../../data/teacher/teacherData";
import { CustomSelect } from "../../components/CustomSelect";

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
    content:
      "Discussion related to stacks and queues.",
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

export default function EditCommunication() {
  const { id } = useParams();
  const navigate = useNavigate();

  const communication = communications.find(
    (item) => item.id === Number(id)
  );

  const [title, setTitle] = useState(
    communication?.title ?? ""
  );

  const [content, setContent] = useState(
    communication?.content ?? ""
  );

  const [status, setStatus] = useState(
    communication?.status ?? ""
  );

  const [error, setError] = useState("");

  const assignment = useMemo(() => {
    if (!communication) {
      return undefined;
    }

    return teacherAssignments.find(
      (item) =>
        item.active &&
        item.classId === communication.classId &&
        item.subject === communication.subject
    );
  }, [communication]);

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

          <Link
            to="/communication"
            className="mt-5 inline-flex rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Back to Communication
          </Link>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-red-700">
            Access Denied
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            You are not authorized to edit this communication.
          </p>

          <Link
            to="/communication"
            className="mt-5 inline-flex rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Back to Communication
          </Link>
        </div>
      </div>
    );
  }

  if (communication.type === "Teacher Notes") {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">
            Editing Not Available
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Teacher Notes cannot be edited from this page.
          </p>

          <Link
            to={`/communication/${communication.id}`}
            className="mt-5 inline-flex rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Back to Details
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!content.trim()) {
      setError("Content is required.");
      return;
    }

    if (!status) {
      setError("Status is required.");
      return;
    }

    const updatedCommunication: CommunicationItem = {
      ...communication,
      title: title.trim(),
      content: content.trim(),
      status,
    };

    console.log(
      "Communication updated:",
      updatedCommunication
    );

    navigate(`/communication/${communication.id}`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          to={`/communication/${communication.id}`}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
        >
          <ArrowLeft size={18} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Communication
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Update the selected communication.
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-200 bg-white shadow-sm"
      >
        {/* Communication Information */}
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Communication Information
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {/* Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Communication Type
              </label>

              <input
                type="text"
                value={communication.type}
                disabled
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2.5 text-sm text-gray-600"
              />
            </div>

            {/* Class */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Class
              </label>

              <input
                type="text"
                value={communication.className}
                disabled
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2.5 text-sm text-gray-600"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Subject
              </label>

              <input
                type="text"
                value={communication.subject}
                disabled
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2.5 text-sm text-gray-600"
              />
            </div>

            {/* Student */}
            {communication.student && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Student
                </label>

                <input
                  type="text"
                  value={communication.student}
                  disabled
                  className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2.5 text-sm text-gray-600"
                />
              </div>
            )}
          </div>
        </div>

        {/* Editable Fields */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Edit Details
          </h2>

          <div className="mt-6 space-y-6">
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Enter communication title"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500"
              />
            </div>

            {/* Content */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Content
              </label>

              <textarea
                rows={7}
                value={content}
                onChange={(event) =>
                  setContent(event.target.value)
                }
                placeholder="Enter communication content"
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500"
              />
            </div>

            {/* Status */}
            <div className="max-w-md">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Status
              </label>

              <CustomSelect
                value={status}
                onChange={(val) => setStatus(String(val))}
                options={
                  communication.type === "Announcements"
                    ? ["Published", "Draft", "Archived"]
                    : communication.type === "Support Requests"
                    ? ["Open", "Resolved"]
                    : ["Active", "Closed"]
                }
                placeholder="Select Status"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 p-6 sm:flex-row sm:justify-end">
          <Link
            to={`/communication/${communication.id}`}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            <Save size={17} />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}