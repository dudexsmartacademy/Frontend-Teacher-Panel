import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { teacherAssignments } from "../../data/teacher/teacherData";
import CustomSelect from "../../components/CustomSelect";
import ResponsiveDatePicker from "../../components/ResponsiveDatePicker";

type AnnouncementPriority = "Low" | "Normal" | "High";

export default function CreateAnnouncement() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [classId, setClassId] = useState("");
  const [subject, setSubject] = useState("");
  const [priority, setPriority] =
    useState<AnnouncementPriority>("Normal");
  const [publishDate, setPublishDate] = useState("2026-09-08");
  const [expiryDate, setExpiryDate] = useState("");

  const authorizedAssignments = useMemo(
    () => teacherAssignments.filter((assignment) => assignment.active),
    []
  );

  const classOptions = useMemo(
    () =>
      [
        ...new Map(
          authorizedAssignments.map((assignment) => [
            assignment.classId,
            assignment,
          ])
        ).values(),
      ],
    [authorizedAssignments]
  );

  const subjects = useMemo(() => {
    if (classId === "all") {
      return [
        ...new Set(
          authorizedAssignments.map(
            (assignment) => assignment.subject
          )
        ),
      ];
    }

    return [
      ...new Set(
        authorizedAssignments
          .filter((assignment) => assignment.classId === classId)
          .map((assignment) => assignment.subject)
      ),
    ];
  }, [authorizedAssignments, classId]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const authorized =
      classId === "all"
        ? authorizedAssignments.some(
            (assignment) => assignment.subject === subject
          )
        : authorizedAssignments.some(
            (assignment) =>
              assignment.classId === classId &&
              assignment.subject === subject
          );

    if (!authorized) {
      alert(
        "You are not authorized to create an announcement for this batch and subject."
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

    const selectedClass = classOptions.find(
      (item) => item.classId === classId
    );

    const announcement = {
      id: `A${Date.now()}`,
      title,
      content,
      priority,
      publishDate,
      expiryDate,
      classId,
      className:
        classId === "all"
          ? "All Batches"
          : selectedClass?.className ?? "",
      subject,
      status: "Published",
    };

    console.log("Announcement created:", announcement);

    navigate("/announcements");
  };

  return (
    <div className="w-full min-w-0 max-w-full p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/announcements"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Announcements
        </Link>

        <h1 className="mt-4 text-xl font-bold text-gray-900 sm:text-2xl">
          Create Announcement
        </h1>

        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Create an announcement for an authorized batch or subject.
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
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter announcement title"
              required
              className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
            />
          </div>

          {/* Batch */}
          <div className="min-w-0">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Batch
            </label>

            <CustomSelect
              value={classId}
              onChange={(value) => {
                setClassId(value);
                setSubject("");
              }}
              placeholder="Select Batch"
              options={[
                { value: "all", label: "All Batches" },
                ...classOptions.map((assignment) => ({
                  value: assignment.classId,
                  label: assignment.className,
                })),
              ]}
            />
          </div>

          {/* Subject */}
          <div className="min-w-0">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Subject
            </label>

            <CustomSelect
              value={subject}
              onChange={setSubject}
              placeholder="Select Subject"
              disabled={!classId}
              options={subjects.map((item) => ({
                value: item,
                label: item,
              }))}
            />
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
              onChange={(event) => setContent(event.target.value)}
              placeholder="Enter announcement content"
              rows={6}
              required
              className="w-full min-w-0 resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-5">
          <Link
            to="/announcements"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Publish Announcement
          </button>
        </div>
      </form>
    </div>
  );
}