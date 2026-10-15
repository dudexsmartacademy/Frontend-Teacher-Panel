import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { teacherAssignments } from "../../data/teacher/teacherData";
import { CustomSelect } from "../../components/CustomSelect";

export default function CreateLiveClass() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [classId, setClassId] = useState("");
  const [subject, setSubject] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [description, setDescription] = useState("");

  const authorizedAssignments = useMemo(
    () =>
      teacherAssignments.filter(
        (assignment) => assignment.active
      ),
    []
  );

  const selectedClassAssignments = useMemo(
    () =>
      authorizedAssignments.filter(
        (assignment) => assignment.classId === classId
      ),
    [authorizedAssignments, classId]
  );

  const subjects = useMemo(
    () => [
      ...new Set(
        selectedClassAssignments.map(
          (assignment) => assignment.subject
        )
      ),
    ],
    [selectedClassAssignments]
  );

  const handleClassChange = (
    value: string
  ) => {
    setClassId(value);
    setSubject("");
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const authorized = authorizedAssignments.some(
      (assignment) =>
        assignment.classId === classId &&
        assignment.subject === subject
    );

    if (!authorized) {
      alert(
        "You are not authorized to create a live class for this class and subject."
      );
      return;
    }

    if (startTime >= endTime) {
      alert("End time must be after start time.");
      return;
    }

    const liveClass = {
      title,
      classId,
      subject,
      date,
      startTime,
      endTime,
      meetingLink,
      description,
      status: "Scheduled",
    };

    console.log("Live class created:", liveClass);

    navigate("/live-classes");
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          to="/live-classes"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Live Classes
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Create Live Class
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Schedule a live class for an assigned class and subject.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-4xl rounded-xl border border-gray-200 bg-white p-6"
      >
        <div className="grid gap-5 md:grid-cols-2">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Class Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter live class title"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
            />
          </div>

          {/* Class */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Class
            </label>

            <CustomSelect
              value={classId}
              onChange={(val) => handleClassChange(String(val))}
              options={[
                { value: "", label: "Select Class" },
                ...[
                  ...new Map(
                    authorizedAssignments.map(
                      (assignment) => [
                        assignment.classId,
                        assignment,
                      ]
                    )
                  ).values(),
                ].map((assignment) => ({
                  value: assignment.classId,
                  label: assignment.className,
                })),
              ]}
              placeholder="Select Class"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Subject
            </label>

            <CustomSelect
              value={subject}
              onChange={(val) => setSubject(String(val))}
              disabled={!classId}
              options={[
                { value: "", label: "Select Subject" },
                ...subjects.map((item) => ({ value: item, label: item })),
              ]}
              placeholder="Select Subject"
            />
          </div>

          {/* Date */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
            />
          </div>

          {/* Start Time */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Start Time
            </label>

            <input
              type="time"
              value={startTime}
              onChange={(e) =>
                setStartTime(e.target.value)
              }
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
            />
          </div>

          {/* End Time */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              End Time
            </label>

            <input
              type="time"
              value={endTime}
              onChange={(e) =>
                setEndTime(e.target.value)
              }
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
            />
          </div>

          {/* Meeting Link */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Meeting Link
            </label>

            <input
              type="url"
              value={meetingLink}
              onChange={(e) =>
                setMeetingLink(e.target.value)
              }
              placeholder="https://meet.example.com/..."
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Enter class description"
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5">
          <Link
            to="/live-classes"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Create Live Class
          </button>
        </div>
      </form>
    </div>
  );
}