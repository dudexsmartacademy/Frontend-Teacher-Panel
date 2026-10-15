import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, School } from "lucide-react";

import CustomSelect from "../../components/CustomSelect";
import ResponsiveDatePicker from "../../components/ResponsiveDatePicker";

import {
  loadClassesFromStorage,
  saveClassesToStorage,
  type ClassItem,
} from "./Classes";

export default function CreateClass() {
  const navigate = useNavigate();

  // Get today's local date in YYYY-MM-DD format.
  // Using local date components avoids UTC timezone issues.
  const getTodayDateString = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const [name, setName] = useState("");
  const [batch, setBatch] = useState("All Batches");
  const [subject, setSubject] = useState("");
  const [classDate, setClassDate] = useState("");
  const [schedule, setSchedule] = useState("10:00 - 11:00");
  const [meetLink, setMeetLink] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !subject.trim()) {
      alert("Please enter a class name and subject.");
      return;
    }

    if (!classDate) {
      alert("Please select a class date.");
      return;
    }

    // Validate against today's date at submission time.
    // This also handles a page left open across midnight.
    const todayDateString = getTodayDateString();

    if (classDate < todayDateString) {
      alert(
        "You cannot create a class for a past date. Please select today or a future date."
      );
      return;
    }

    const currentClasses = loadClassesFromStorage();

    const newClass: ClassItem = {
      id: String(Date.now()),
      name: name.trim(),
      department: batch,
      section: "",
      subject: subject.trim(),
      batch,
      academicYear: "",
      studentsCount: 60,
      classDate,
      schedule,
      meetLink: meetLink.trim(),
      room: "",
      description,
      status: "Active",
    };

    saveClassesToStorage([newClass, ...currentClasses]);

    navigate("/classes");
  };

  return (
    <div className="min-w-0 p-4 sm:p-6">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link
          to="/classes"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} />
          Back to Classes
        </Link>
      </div>

      {/* Create Class Card */}
      <div className="mx-auto w-full min-w-0 max-w-3xl rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-8">
        {/* Header */}
        <div className="mb-6 flex min-w-0 items-center gap-3 border-b border-gray-200 pb-5">
          <div className="shrink-0 rounded-lg bg-blue-50 p-2 text-blue-600">
            <School size={22} />
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-900">
              Create New Class
            </h1>

            <p className="text-sm text-gray-500">
              Configure details and schedule for a new class section
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="min-w-0 space-y-6">
          {/* Class Name */}
          <div className="min-w-0">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Class Name / Title *
            </label>

            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Advanced Machine Learning"
              className="w-full min-w-0 rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Batches and Subject */}
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="min-w-0">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Batches *
              </label>

              <CustomSelect
                value={batch}
                onChange={setBatch}
                options={[
                  "All Batches",
                  "Batch 1",
                  "Batch 2",
                  "Batch 3",
                  "Batch 4",
                  "Batch 5",
                ]}
              />
            </div>

            <div className="min-w-0">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Subject *
              </label>

              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Python Programming"
                className="w-full min-w-0 rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Select Date and Schedule */}
          <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="min-w-0">
              <ResponsiveDatePicker
                label="Select Date"
                value={classDate}
                minDate={getTodayDateString()}
                onChange={setClassDate}
              />
            </div>

            <div className="min-w-0">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Schedule / Time
              </label>

              <input
                type="text"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                placeholder="e.g. 10:00 - 11:00 (Mon, Wed, Fri)"
                className="w-full min-w-0 rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Meet Link */}
          <div className="min-w-0">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Meet Link / Online Class URL
            </label>

            <input
              type="url"
              value={meetLink}
              onChange={(e) => setMeetLink(e.target.value)}
              placeholder="e.g. https://meet.google.com/abc-defg-hij or Zoom link"
              className="w-full min-w-0 rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div className="min-w-0">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a brief overview of course objectives and syllabus..."
              className="w-full min-w-0 rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-gray-200 pt-5">
            <Link
              to="/classes"
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Create Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}