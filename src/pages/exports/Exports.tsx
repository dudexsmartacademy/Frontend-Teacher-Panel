import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Download,
  FileText,
  FileSpreadsheet,
  FileDown,
} from "lucide-react";

import { teacherAssignments } from "../../data/teacher/teacherData";
import CustomSelect from "../../components/CustomSelect";

type ExportType =
  | "Student List"
  | "Attendance"
  | "Result"
  | "Grade"
  | "Performance"
  | "Assessment Report";

type ExportFormat = "CSV" | "Excel" | "PDF";

export default function Exports() {
  const [exportType, setExportType] =
    useState<ExportType>("Student List");

  const [format, setFormat] =
    useState<ExportFormat>("CSV");

  const [classId, setClassId] = useState(
    teacherAssignments[0]?.classId ?? ""
  );

  const [subject, setSubject] = useState(
    teacherAssignments[0]?.subject ?? ""
  );

  const [message, setMessage] = useState("");

  const authorizedAssignments = useMemo(
    () =>
      teacherAssignments.filter(
        (assignment) => assignment.active
      ),
    []
  );

  const selectedAssignment = authorizedAssignments.find(
    (assignment) =>
      assignment.classId === classId &&
      assignment.subject === subject
  );

  const availableSubjects = useMemo(() => {
    return authorizedAssignments
      .filter(
        (assignment) => assignment.classId === classId
      )
      .map((assignment) => assignment.subject);
  }, [authorizedAssignments, classId]);

  const handleClassChange = (
    value: string
  ) => {
    setClassId(value);

    const assignment = authorizedAssignments.find(
      (item) => item.classId === value
    );

    setSubject(assignment?.subject ?? "");
    setMessage("");
  };

  const handleExport = () => {
    setMessage("");

    if (!selectedAssignment) {
      setMessage(
        "You are not authorized to export data for this class and subject."
      );
      return;
    }

    const exportRequest = {
      type: exportType,
      format,
      classId: selectedAssignment.classId,
      className: selectedAssignment.className,
      subject: selectedAssignment.subject,
      academicYear: selectedAssignment.academicYear,
    };

    console.log(
      "Export requested:",
      exportRequest
    );

    setMessage(
      `${exportType} export generated in ${format} format.`
    );
  };

  const exportTypes: ExportType[] = [
    "Student List",
    "Attendance",
    "Result",
    "Grade",
    "Performance",
    "Assessment Report",
  ];

  const formats: {
    label: ExportFormat;
    icon: ReactNode;
  }[] = [
    {
      label: "CSV",
      icon: <FileText size={20} />,
    },
    {
      label: "Excel",
      icon: <FileSpreadsheet size={20} />,
    },
    {
      label: "PDF",
      icon: <FileDown size={20} />,
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Exports
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Export authorized student, attendance, result,
          grade, performance, and assessment data.
        </p>
      </div>

      {/* Export Configuration */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Export Configuration
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Select the data and format you want to export.
          </p>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          {/* Class */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Class
            </label>

            <CustomSelect
              value={classId}
              onChange={(val) => handleClassChange(val)}
              options={authorizedAssignments.map((assignment) => ({
                value: assignment.classId,
                label: assignment.className,
              }))}
            />
          </div>

          {/* Subject */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Subject
            </label>

            <CustomSelect
              value={subject}
              onChange={(val) => setSubject(val)}
              options={availableSubjects.map((item) => ({
                value: item,
                label: item,
              }))}
            />
          </div>
        </div>

        {/* Export Type */}
        <div className="border-t border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">
            Export Data
          </h3>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {exportTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setExportType(type);
                  setMessage("");
                }}
                className={`rounded-lg border p-4 text-left transition ${
                  exportType === type
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
                    <Download
                      size={18}
                      className="text-gray-600"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {type}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-500">
                      Export {type.toLowerCase()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Format */}
        <div className="border-t border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900">
            File Format
          </h3>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {formats.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setFormat(item.label);
                  setMessage("");
                }}
                className={`flex items-center gap-3 rounded-lg border p-4 text-left ${
                  format === item.label
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                  {item.icon}
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.label}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-500">
                    {item.label} file
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Information */}
        {selectedAssignment && (
          <div className="border-t border-gray-200 bg-gray-50 p-6">
            <h3 className="text-sm font-semibold text-gray-900">
              Selected Assignment
            </h3>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-xs text-gray-500">
                  Class
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {selectedAssignment.className}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Subject
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {selectedAssignment.subject}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Academic Year
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {selectedAssignment.academicYear}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Message */}
        {message && (
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end border-t border-gray-200 p-6">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            <Download size={18} />
            Export {exportType}
          </button>
        </div>
      </div>
    </div>
  );
}