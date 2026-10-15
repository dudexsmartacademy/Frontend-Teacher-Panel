import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { teacherAssignments } from "../../data/teacher/teacherData";
import { CustomSelect } from "../../components/CustomSelect";
import ResponsiveDatePicker from "../../components/ResponsiveDatePicker";

type AnnouncementPriority = "Low" | "Normal" | "High";

type Announcement = {
  id: string;
  title: string;
  content: string;
  priority: AnnouncementPriority;
  publishDate: string;
  expiryDate: string;
  classId: string;
  className: string;
  subject: string;
  status: "Published" | "Draft" | "Archived";
};

const announcements: Announcement[] = [
  {
    id: "A001",
    title: "Python Assignment Submission",
    content: "Submit the Python assignment before the deadline.",
    priority: "High",
    publishDate: "2026-09-08",
    expiryDate: "2026-09-15",
    classId: "1",
    className: "Batch 1",
    subject: "Python",
    status: "Published",
  },
  {
    id: "A002",
    title: "Data Structures Revision",
    content:
      "Students are requested to revise arrays and linked lists.",
    priority: "Normal",
    publishDate: "2026-09-07",
    expiryDate: "2026-09-20",
    classId: "2",
    className: "Batch 2",
    subject: "Data Structures",
    status: "Published",
  },
  {
    id: "A003",
    title: "Upcoming Internal Assessment",
    content: "Details regarding the upcoming internal assessment.",
    priority: "High",
    publishDate: "2026-09-10",
    expiryDate: "2026-09-25",
    classId: "1",
    className: "Batch 1",
    subject: "Python",
    status: "Draft",
  },
];

export default function EditAnnouncement() {
  const { id } = useParams();
  const navigate = useNavigate();

  const announcement = announcements.find(
    (item) => item.id === id
  );

  const authorized = announcement
    ? teacherAssignments.some(
        (assignment) =>
          assignment.active &&
          assignment.classId === announcement.classId &&
          assignment.subject === announcement.subject
      )
    : false;

  const [title, setTitle] = useState(
    announcement?.title ?? ""
  );

  const [content, setContent] = useState(
    announcement?.content ?? ""
  );

  const [priority, setPriority] =
    useState<AnnouncementPriority>(
      announcement?.priority ?? "Normal"
    );

  const [publishDate, setPublishDate] = useState(
    announcement?.publishDate ?? ""
  );

  const [expiryDate, setExpiryDate] = useState(
    announcement?.expiryDate ?? ""
  );

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!announcement) {
      return;
    }

    if (!authorized) {
      alert(
        "You are not authorized to edit this announcement."
      );
      return;
    }

    if (announcement.status === "Archived") {
      alert(
        "Archived announcement cannot be edited."
      );
      return;
    }

    if (!publishDate) {
      alert("Please select a publish date.");
      return;
    }

    if (expiryDate && expiryDate < publishDate) {
      alert(
        "Expiry date cannot be earlier than the publish date."
      );
      return;
    }

    const updatedAnnouncement = {
      ...announcement,
      title,
      content,
      priority,
      publishDate,
      expiryDate,
    };

    console.log(
      "Announcement updated:",
      updatedAnnouncement
    );

    navigate(`/announcements/${announcement.id}`);
  };

  if (!announcement) {
    return (
      <div className="w-full min-w-0 p-4 sm:p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center sm:p-8">
          <h1 className="text-xl font-semibold text-gray-900">
            Announcement Not Found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            The requested announcement does not exist.
          </p>

          <Link
            to="/announcements"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
          >
            <ArrowLeft size={16} />
            Back to Announcements
          </Link>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="w-full min-w-0 p-4 sm:p-6">
        <div className="rounded-xl border border-red-200 bg-white p-6 text-center sm:p-8">
          <h1 className="text-xl font-semibold text-red-700">
            Access Denied
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            You are not authorized to edit this announcement.
          </p>

          <Link
            to="/announcements"
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
          >
            <ArrowLeft size={16} />
            Back to Announcements
          </Link>
        </div>
      </div>
    );
  }

  if (announcement.status === "Archived") {
    return (
      <div className="w-full min-w-0 p-4 sm:p-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-center sm:p-8">
          <h1 className="text-xl font-semibold text-gray-900">
            Announcement Archived
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Archived announcements cannot be edited.
          </p>

          <Link
            to={`/announcements/${announcement.id}`}
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
          >
            <ArrowLeft size={16} />
            Back to Announcement
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          to={`/announcements/${announcement.id}`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Announcement
        </Link>

        <h1 className="mt-4 text-xl font-bold text-gray-900 sm:text-2xl">
          Edit Announcement
        </h1>

        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Update the announcement details.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full min-w-0 max-w-4xl rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
      >
        <div className="grid min-w-0 gap-5 md:grid-cols-2">
          {/* Title */}
          <div className="min-w-0 md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              required
              className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
            />
          </div>

          {/* Batch */}
          <div className="min-w-0">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Batch
            </label>

            <input
              type="text"
              value={announcement.className}
              disabled
              className="w-full min-w-0 rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-600"
            />

            <p className="mt-1 text-xs text-gray-500">
              Batch assignment cannot be changed.
            </p>
          </div>

          {/* Subject */}
          <div className="min-w-0">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Subject
            </label>

            <input
              type="text"
              value={announcement.subject}
              disabled
              className="w-full min-w-0 rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-600"
            />

            <p className="mt-1 text-xs text-gray-500">
              Subject assignment cannot be changed.
            </p>
          </div>

          {/* Priority */}
          <div className="min-w-0">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Priority
            </label>

            <CustomSelect
              value={priority}
              onChange={(value) =>
                setPriority(value as AnnouncementPriority)
              }
              options={[
                { value: "Low", label: "Low" },
                { value: "Normal", label: "Normal" },
                { value: "High", label: "High" },
              ]}
              placeholder="Select Priority"
            />
          </div>

          {/* Publish Date */}
          <div className="min-w-0">
            <ResponsiveDatePicker
              label="Publish Date"
              value={publishDate}
              onChange={(value) => {
                setPublishDate(value);

                if (expiryDate && expiryDate < value) {
                  setExpiryDate("");
                }
              }}
              required
            />
          </div>

          {/* Expiry Date */}
          <div className="min-w-0">
            <ResponsiveDatePicker
              label="Expiry Date"
              value={expiryDate}
              onChange={setExpiryDate}
              minDate={publishDate || undefined}
            />
          </div>

          {/* Content */}
          <div className="min-w-0 md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Content
            </label>

            <textarea
              value={content}
              onChange={(event) =>
                setContent(event.target.value)
              }
              rows={7}
              required
              className="w-full min-w-0 resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-5">
          <Link
            to={`/announcements/${announcement.id}`}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}