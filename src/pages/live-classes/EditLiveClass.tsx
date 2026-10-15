import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { teacherAssignments } from "../../data/teacher/teacherData";
import { CustomSelect } from "../../components/CustomSelect";

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
    meetingLink: "https://meet.example.com/python-basics",
    description:
      "Introduction to Python programming, variables, data types and basic syntax.",
    status: "Scheduled",
  },
  {
    id: "LC002",
    title: "Data Structures - Arrays",
    classId: "1",
    className: "AI & DS - Section B",
    subject: "Data Structures",
    date: "2026-09-10",
    startTime: "11:00",
    endTime: "12:00",
    meetingLink: "https://meet.example.com/data-structures",
    description:
      "Understanding arrays and common array operations.",
    status: "Scheduled",
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
    meetingLink: "https://meet.example.com/python-functions",
    description:
      "Understanding functions, parameters and return values.",
    status: "Completed",
  },
];

export default function EditLiveClass() {
  const { id } = useParams();
  const navigate = useNavigate();

  const liveClass = liveClasses.find(
    (item) => item.id === id
  );

  const authorized = liveClass
    ? teacherAssignments.some(
        (assignment) =>
          assignment.active &&
          assignment.classId === liveClass.classId &&
          assignment.subject === liveClass.subject
      )
    : false;

  const [title, setTitle] = useState(
    liveClass?.title ?? ""
  );

  const [date, setDate] = useState(
    liveClass?.date ?? ""
  );

  const [startTime, setStartTime] = useState(
    liveClass?.startTime ?? ""
  );

  const [endTime, setEndTime] = useState(
    liveClass?.endTime ?? ""
  );

  const [meetingLink, setMeetingLink] = useState(
    liveClass?.meetingLink ?? ""
  );

  const [description, setDescription] = useState(
    liveClass?.description ?? ""
  );

  const authorizedSubjects = useMemo(
    () =>
      teacherAssignments
        .filter(
          (assignment) =>
            assignment.active &&
            assignment.classId === liveClass?.classId
        )
        .map((assignment) => assignment.subject),
    [liveClass]
  );

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!liveClass) {
      return;
    }

    if (!authorized) {
      alert(
        "You are not authorized to edit this live class."
      );
      return;
    }

    if (liveClass.status !== "Scheduled") {
      alert(
        "Only scheduled live classes can be edited."
      );
      return;
    }

    if (startTime >= endTime) {
      alert("End time must be after start time.");
      return;
    }

    const updatedLiveClass = {
      ...liveClass,
      title,
      date,
      startTime,
      endTime,
      meetingLink,
      description,
    };

    console.log(
      "Live class updated:",
      updatedLiveClass
    );

    navigate(`/live-classes/${liveClass.id}`);
  };

  if (!liveClass) {
    return (
      <div className="p-6">
        <Link
          to="/live-classes"
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

  if (!authorized) {
    return (
      <div className="p-6">
        <Link
          to="/live-classes"
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
            You are not authorized to edit this live class.
          </p>
        </div>
      </div>
    );
  }

  if (liveClass.status !== "Scheduled") {
    return (
      <div className="p-6">
        <Link
          to={`/live-classes/${liveClass.id}`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Live Class
        </Link>

        <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-8 text-center">
          <h1 className="text-xl font-semibold text-yellow-700">
            Editing Not Available
          </h1>

          <p className="mt-2 text-sm text-yellow-700">
            Only scheduled live classes can be edited.
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
          to={`/live-classes/${liveClass.id}`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Live Class
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          Edit Live Class
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update the scheduled live class details.
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
              onChange={(e) =>
                setTitle(e.target.value)
              }
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
            />
          </div>

          {/* Class */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Class
            </label>

            <input
              type="text"
              value={liveClass.className}
              disabled
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-600"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Subject
            </label>

            <CustomSelect
              value={liveClass.subject}
              onChange={() => {}}
              disabled
              options={authorizedSubjects}
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
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-5">
          <Link
            to={`/live-classes/${liveClass.id}`}
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