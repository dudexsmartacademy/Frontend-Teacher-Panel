import { useMemo, useState } from "react";
import {
  Check,
  CheckCircle2,
  RotateCcw,
  Save,
  Search,
  X,
  XCircle,
} from "lucide-react";

import { teacherAssignments } from "../../data";
import CustomSelect from "../../components/CustomSelect";
import ResponsiveDatePicker from "../../components/ResponsiveDatePicker";
import { saveAttendance as saveAttendanceWorkflow } from "../../lib/attendance/attendanceWorkflow";

type AttendanceStatus = "Present" | "Absent" | "";

type Student = {
  id: string;
  name: string;
  rrn: string;
  classId: string;
};

type AttendanceRecord = {
  status: AttendanceStatus;
  time: string;
  remarks: string;
};

const students: Student[] = [
  {
    id: "1",
    name: "Arun Kumar",
    rrn: "RRN001",
    classId: "1",
  },
  {
    id: "2",
    name: "Priya Sharma",
    rrn: "RRN002",
    classId: "1",
  },
  {
    id: "3",
    name: "Rahul Raj",
    rrn: "RRN003",
    classId: "1",
  },
  {
    id: "4",
    name: "Sneha Joseph",
    rrn: "RRN004",
    classId: "1",
  },
  {
    id: "5",
    name: "Vishal Kumar",
    rrn: "RRN005",
    classId: "1",
  },
  {
    id: "6",
    name: "Meena Devi",
    rrn: "RRN006",
    classId: "1",
  },
];

const batches = [
  "All Batches",
  "Batch 1",
  "Batch 2",
  "Batch 3",
];

function generateAttendanceCode(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const characters = letters + numbers;

  const randomIndex = (max: number): number => {
    const random = new Uint32Array(1);
    crypto.getRandomValues(random);

    return random[0] % max;
  };

  const code = [
    letters[randomIndex(letters.length)],
    numbers[randomIndex(numbers.length)],
    ...Array.from(
      { length: 4 },
      () => characters[randomIndex(characters.length)]
    ),
  ];

  for (let i = code.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);
    [code[i], code[j]] = [code[j], code[i]];
  }

  return code.join("");
}

/*
 * Initially, every student's attendance is Not Marked.
 */
function createInitialRecords(): Record<
  string,
  AttendanceRecord
> {
  return students.reduce(
    (records, student) => {
      records[student.id] = {
        status: "",
        time: "",
        remarks: "",
      };

      return records;
    },
    {} as Record<string, AttendanceRecord>
  );
}

export default function Attendance() {
  const classId = "1";
  const subject = "Python";

  const [batch, setBatch] = useState("Batch 1");
  const [date, setDate] = useState("2026-09-08");

  const [records, setRecords] = useState<
    Record<string, AttendanceRecord>
  >(createInitialRecords);

  const [selectedStudentIds, setSelectedStudentIds] =
    useState<string[]>([]);

  const [search, setSearch] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [popupMessage, setPopupMessage] =
    useState<string | null>(null);

  const [attendanceCode, setAttendanceCode] = useState("");
  const [codeActive, setCodeActive] = useState(false);
  const [codeGenerated, setCodeGenerated] = useState(false);
  const [codeMessage, setCodeMessage] = useState("");

  /*
   * Generate attendance verification code.
   */
  const handleGenerateCode = () => {
    if (codeGenerated) {
      return;
    }

    const newCode = generateAttendanceCode();

    setAttendanceCode(newCode);
    setCodeActive(true);
    setCodeGenerated(true);
    setCodeMessage(
      "Attendance code generated successfully."
    );
  };

  /*
   * Stop the generated attendance code.
   */
  const handleStopCode = () => {
    if (!codeActive) {
      return;
    }

    setCodeActive(false);
    setCodeMessage("Code stopped successfully.");
  };

  /*
   * Authorized teacher assignments.
   */
  const authorizedClasses = useMemo(
    () =>
      teacherAssignments.filter(
        (assignment) => assignment.active
      ),
    []
  );

  const selectedAssignment = authorizedClasses.find(
    (assignment) => assignment.classId === classId
  );

  /*
   * Students belonging to the current class.
   */
  const authorizedStudents = useMemo(
    () =>
      students.filter(
        (student) => student.classId === classId
      ),
    [classId]
  );

  /*
   * Search students by name or RRN.
   */
  const visibleStudents = useMemo(() => {
    const value = search.trim().toLowerCase();

    return authorizedStudents.filter(
      (student) =>
        student.name.toLowerCase().includes(value) ||
        student.rrn.toLowerCase().includes(value)
    );
  }, [authorizedStudents, search]);

  /*
   * Check whether all currently visible students
   * are selected.
   */
  const isAllVisibleSelected =
    visibleStudents.length > 0 &&
    visibleStudents.every((student) =>
      selectedStudentIds.includes(student.id)
    );

  /*
   * Select or deselect all visible students.
   * This changes only checkbox selection.
   */
  const handleToggleSelectAll = () => {
    const visibleIds = visibleStudents.map(
      (student) => student.id
    );

    if (isAllVisibleSelected) {
      setSelectedStudentIds((previous) =>
        previous.filter(
          (id) => !visibleIds.includes(id)
        )
      );
    } else {
      setSelectedStudentIds((previous) => [
        ...new Set([...previous, ...visibleIds]),
      ]);
    }
  };

  /*
   * Toggle an individual student's checkbox.
   */
  const handleToggleStudent = (studentId: string) => {
    setSelectedStudentIds((previous) => {
      if (previous.includes(studentId)) {
        return previous.filter((id) => id !== studentId);
      }

      return [...previous, studentId];
    });
  };

  const showPopup = (message: string) => {
    setPopupMessage(message);
  };

  /*
   * Mark attendance as Present.
   *
   * Selected students become Present and the remaining
   * students become Absent. If no students are selected,
   * all students become Present.
   */
  const handleMarkPresent = () => {
    setSaveMessage("");

    const selectedSet = new Set(selectedStudentIds);

    setRecords((current) => {
      const updated = { ...current };

      authorizedStudents.forEach((student) => {
        const shouldBePresent =
          selectedStudentIds.length === 0 ||
          selectedSet.has(student.id);

        updated[student.id] = {
          ...updated[student.id],
          status: shouldBePresent ? "Present" : "Absent",
        };
      });

      return updated;
    });

    showPopup(
      selectedStudentIds.length > 0
        ? "The selected students are marked as present and the remaining students are marked as absent."
        : "All students are marked as present."
    );
  };

  /*
   * Mark attendance as Absent.
   *
   * Selected students become Absent and the remaining
   * students become Present. If no students are selected,
   * all students become Absent.
   */
  const handleMarkAbsent = () => {
    setSaveMessage("");

    const selectedSet = new Set(selectedStudentIds);

    setRecords((current) => {
      const updated = { ...current };

      authorizedStudents.forEach((student) => {
        const shouldBeAbsent =
          selectedStudentIds.length === 0 ||
          selectedSet.has(student.id);

        updated[student.id] = {
          ...updated[student.id],
          status: shouldBeAbsent ? "Absent" : "Present",
        };
      });

      return updated;
    });

    showPopup(
      selectedStudentIds.length > 0
        ? "The selected students are marked as absent and the remaining students are marked as present."
        : "All students are marked as absent."
    );
  };

  /*
   * Reset all attendance statuses to Not Marked.
   */
  const resetAttendance = () => {
    setRecords(createInitialRecords());
    setSelectedStudentIds([]);
    setSaveMessage("");
    setPopupMessage(null);
  };

  /*
   * Save attendance through the existing workflow.
   */
  const handleSaveAttendance = async () => {
    setSaveMessage("");

    if (!selectedAssignment) {
      setSaveMessage(
        "You are not authorized for this class."
      );
      return;
    }

    if (!classId) {
      setSaveMessage("Please select a class.");
      return;
    }

    if (!subject) {
      setSaveMessage("Please select a subject.");
      return;
    }

    if (!batch) {
      setSaveMessage("Please select a batch.");
      return;
    }

    if (!date) {
      setSaveMessage("Please select a date.");
      return;
    }

    /*
     * Prevent saving until all students are marked.
     */
    const unmarkedStudents = authorizedStudents.filter(
      (student) => !records[student.id]?.status
    );

    if (unmarkedStudents.length > 0) {
      setSaveMessage(
        `Please mark attendance for all students before saving. ${unmarkedStudents.length} student${
          unmarkedStudents.length === 1 ? "" : "s"
        } still ${
          unmarkedStudents.length === 1 ? "is" : "are"
        } Not Marked.`
      );

      return;
    }

    const attendance = authorizedStudents.map(
      (student) => ({
        studentId: student.id,
        rrn: student.rrn,
        status: records[student.id].status as
          | "Present"
          | "Absent",
        time: records[student.id].time,
        remarks: records[student.id].remarks,
      })
    );

    try {
      const result = await saveAttendanceWorkflow({
        teacherId: "FAC001",
        classId,
        subject,
        session: batch,
        date,
        attendance,
      });

      if (result.success) {
        setSaveMessage(
          "Attendance saved successfully."
        );
      } else if (result.error) {
        setSaveMessage(result.error);
      }
    } catch (error) {
      console.error(
        "Attendance save failed:",
        error
      );

      setSaveMessage(
        error instanceof Error
          ? error.message
          : "Unable to save attendance."
      );
    }
  };

  return (
    <div className="min-w-0 space-y-5 p-3.5 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Student Attendance Dashboard
        </h1>

        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Mark and manage daily attendance for students in
          authorized classes
        </p>
      </div>

      {/* Attendance Verification */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Daily Attendance Verification
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Generate a six-character code for attendance
              verification.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerateCode}
            disabled={codeGenerated}
            className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed"
          >
            {codeGenerated
              ? "Code Already Generated"
              : "Generate Code"}
          </button>
        </div>

        {attendanceCode && codeActive && (
          <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-700">
              Attendance Verification Code
            </p>

            <div className="mt-3 flex min-h-16 items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-3">
              <span className="font-mono text-2xl font-bold tracking-[0.4em] text-gray-900">
                {attendanceCode}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Code Active
              </span>

              <button
                type="button"
                onClick={handleStopCode}
                className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                Stop Code
              </button>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Students must enter this exact code to verify
              their attendance.
            </p>
          </div>
        )}

        {codeMessage && (
          <p
            role="status"
            className={`mt-3 text-sm ${
              codeMessage.includes("successfully")
                ? "text-green-700"
                : "text-gray-600"
            }`}
          >
            {codeMessage}
          </p>
        )}
      </div>

      {/* Batch and Date */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
          <div className="min-w-0">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Batch
            </label>

            <CustomSelect
              value={batch}
              onChange={(value) => {
                setBatch(value);
                setSaveMessage("");
              }}
              options={batches.map((item) => ({
                value: item,
                label: item,
              }))}
            />
          </div>

          {/* Responsive Date Picker */}
          <div className="min-w-0">
            <ResponsiveDatePicker
              label="Date"
              value={date}
              onChange={(value) => {
                setDate(value);
                setSaveMessage("");
              }}
            />
          </div>
        </div>
      </div>

      {/* Search and Attendance Actions */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-80">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search student..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedStudentIds.length > 0 && (
            <span className="mr-2 text-xs font-medium text-gray-500">
              {selectedStudentIds.length} student
              {selectedStudentIds.length > 1 ? "s" : ""} selected
            </span>
          )}

          <button
            type="button"
            onClick={handleMarkPresent}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <Check size={16} className="text-green-600" />
            Mark All Present
          </button>

          <button
            type="button"
            onClick={handleMarkAbsent}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <X size={16} className="text-red-500" />
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div
          role="status"
          className={`rounded-lg border px-4 py-3 text-sm ${
            saveMessage.includes("successfully")
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {saveMessage}
        </div>
      )}

      {/* Attendance Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="w-14 px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={isAllVisibleSelected}
                    onChange={handleToggleSelectAll}
                    aria-label="Select all visible students"
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>

                <th className="px-4 py-3 font-semibold text-gray-700">
                  Student Name
                </th>

                <th className="px-4 py-3 text-right font-semibold text-gray-700">
                  Current Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {visibleStudents.map((student) => {
                const isSelected =
                  selectedStudentIds.includes(student.id);

                const status =
                  records[student.id]?.status ?? "";

                return (
                  /*
                   * The checkbox alone controls student
                   * selection; the table row has no onClick.
                   */
                  <tr
                    key={student.id}
                    className={`transition hover:bg-gray-50 ${
                      isSelected ? "bg-blue-50/40" : ""
                    }`}
                  >
                    <td className="w-14 px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          handleToggleStudent(student.id)
                        }
                        aria-label={`Select ${student.name}`}
                        className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-medium text-gray-900">
                        {student.name}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      {status === "Present" ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">
                          Present
                        </span>
                      ) : status === "Absent" ? (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-800">
                          Absent
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
                          Not Marked
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {visibleStudents.length === 0 && (
          <div className="p-8 text-center text-sm text-gray-500">
            No students found.
          </div>
        )}
      </div>

      {/* Reset and Save */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={resetAttendance}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <RotateCcw size={16} />
          Reset
        </button>

        <button
          type="button"
          onClick={handleSaveAttendance}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          <Save size={16} />
          Save
        </button>
      </div>

      {/* Attendance Confirmation Popup */}
      {popupMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
                  popupMessage.toLowerCase().includes("present")
                    ? "bg-green-100 text-green-600"
                    : "bg-amber-100 text-amber-600"
                }`}
              >
                {popupMessage.toLowerCase().includes("present") ? (
                  <CheckCircle2 size={24} />
                ) : (
                  <XCircle size={24} />
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">
                  Attendance Updated
                </h3>

                <p className="mt-1 text-sm font-medium text-gray-600">
                  {popupMessage}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPopupMessage(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setPopupMessage(null)}
                className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}