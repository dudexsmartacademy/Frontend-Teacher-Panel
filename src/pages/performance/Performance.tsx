import {
  BarChart3,
  GraduationCap,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

import { useState } from "react";
import { Link } from "react-router-dom";
import CustomSelect from "../../components/CustomSelect";

const scoreDistribution = [
  { range: "0–39", students: 2 },
  { range: "40–49", students: 3 },
  { range: "50–59", students: 8 },
  { range: "60–69", students: 18 },
  { range: "70–79", students: 42 },
  { range: "80–89", students: 67 },
  { range: "90–100", students: 44 },
];

const gradeDistribution = [
  { grade: "A+", students: 18 },
  { grade: "A", students: 49 },
  { grade: "B+", students: 55 },
  { grade: "B", students: 38 },
  { grade: "C", students: 16 },
  { grade: "D", students: 6 },
  { grade: "F", students: 2 },
];

const attendancePerformance = [
  {
    range: "Below 60%",
    attendance: 55,
    average: 48,
  },
  {
    range: "60–69%",
    attendance: 65,
    average: 58,
  },
  {
    range: "70–79%",
    attendance: 75,
    average: 68,
  },
  {
    range: "80–89%",
    attendance: 85,
    average: 78,
  },
  {
    range: "90–100%",
    attendance: 95,
    average: 88,
  },
];

const topPerformers = [
  {
    name: "Arun Kumar",
    rrn: "RRN001",
    average: 92,
    attendance: 96,
    grade: "A+",
  },
  {
    name: "Priya Sharma",
    rrn: "RRN002",
    average: 89,
    attendance: 94,
    grade: "A+",
  },
  {
    name: "Vishal Kumar",
    rrn: "RRN005",
    average: 86,
    attendance: 91,
    grade: "A",
  },
  {
    name: "Meena Devi",
    rrn: "RRN006",
    average: 84,
    attendance: 89,
    grade: "A",
  },
];

const lowPerformers = [
  {
    name: "Sneha Joseph",
    rrn: "RRN004",
    average: 42,
    attendance: 61,
    grade: "D",
  },
  {
    name: "Rahul Raj",
    rrn: "RRN003",
    average: 58,
    attendance: 68,
    grade: "C",
  },
];

const atRiskStudents = [
  {
    name: "Sneha Joseph",
    rrn: "RRN004",
    attendance: 61,
    assessmentAverage: 42,
    level: "Critical",
  },
  {
    name: "Rahul Raj",
    rrn: "RRN003",
    attendance: 68,
    assessmentAverage: 58,
    level: "Needs Attention",
  },
  {
    name: "Student 007",
    rrn: "RRN007",
    attendance: 58,
    assessmentAverage: 64,
    level: "At Risk",
  },
];

export default function Performance() {
  const [batch, setBatch] = useState("All Batches");
  const [subject, setSubject] = useState("All Subjects");
  const [academicYear, setAcademicYear] = useState("Current Academic Year");

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Performance Analytics
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Analyze class, subject and student performance
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <CustomSelect
            value={batch}
            onChange={(val) => setBatch(val)}
            options={[
              { value: "All Batches", label: "All Batches" },
              { value: "Batch 1", label: "Batch 1" },
              { value: "Batch 2", label: "Batch 2" },
              { value: "Batch 3", label: "Batch 3" },
            ]}
          />

          <CustomSelect
            value={subject}
            onChange={(val) => setSubject(val)}
            options={[
              { value: "All Subjects", label: "All Subjects" },
              { value: "Python", label: "Python" },
              { value: "Data Structures", label: "Data Structures" },
              { value: "Programming", label: "Programming" },
            ]}
          />

          <CustomSelect
            value={academicYear}
            onChange={(val) => setAcademicYear(val)}
            options={[
              { value: "Current Academic Year", label: "Current Academic Year" },
              { value: "2025–2026", label: "2025–2026" },
              { value: "2026–2027", label: "2026–2027" },
            ]}
            containerClassName="sm:col-span-2 md:col-span-1"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
              <Users size={20} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Class Average
              </p>

              <p className="text-2xl font-bold text-gray-900">
                78%
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-50 p-2.5 text-green-600">
              <GraduationCap size={20} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Subject Average
              </p>

              <p className="text-2xl font-bold text-gray-900">
                76%
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-50 p-2.5 text-purple-600">
              <BarChart3 size={20} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Assessment Completion
              </p>

              <p className="text-2xl font-bold text-gray-900">
                91%
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-50 p-2.5 text-red-600">
              <TrendingDown size={20} />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                At-Risk Students
              </p>

              <p className="text-2xl font-bold text-gray-900">
                8
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Score Distribution */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <BarChart3
            size={20}
            className="text-blue-600"
          />

          <h2 className="font-semibold text-gray-900">
            Score Distribution
          </h2>
        </div>

        <div className="space-y-4">
          {scoreDistribution.map((item) => (
            <div
              key={item.range}
              className="flex items-center gap-4"
            >
              <span className="w-20 text-sm text-gray-600">
                {item.range}
              </span>

              <div className="h-8 flex-1 overflow-hidden rounded-lg bg-gray-100">
                <div
                  className="flex h-full items-center rounded-lg bg-blue-500 px-3 text-xs font-medium text-white"
                  style={{
                    width: `${Math.max(
                      item.students * 1.2,
                      8
                    )}%`,
                  }}
                >
                  {item.students}
                </div>
              </div>

              <span className="w-16 text-right text-sm font-medium text-gray-700">
                {item.students}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <GraduationCap
            size={20}
            className="text-blue-600"
          />

          <h2 className="font-semibold text-gray-900">
            Grade Distribution
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {gradeDistribution.map((item) => (
            <div
              key={item.grade}
              className="rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Grade {item.grade}
                </span>

                <span className="text-lg font-bold text-gray-900">
                  {item.students}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance vs Performance */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2">
          <TrendingUp
            size={20}
            className="text-blue-600"
          />

          <h2 className="font-semibold text-gray-900">
            Attendance vs Performance
          </h2>
        </div>

        <div className="space-y-4">
          {attendancePerformance.map((item) => (
            <div key={item.range}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.range}
                </span>

                <span className="font-medium text-gray-900">
                  Average: {item.average}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{
                    width: `${item.average}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performers */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900">
            Top Performers
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Student
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  RRN
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Average
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Attendance
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Grade
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {topPerformers.map((student) => (
                <tr key={student.rrn}>
                  <td className="px-5 py-4 font-medium text-gray-900">
                    {student.name}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {student.rrn}
                  </td>

                  <td className="px-5 py-4 text-sm font-medium text-gray-900">
                    {student.average}%
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {student.attendance}%
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                      {student.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low Performers */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900">
            Low Performers
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Student
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  RRN
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Average
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Attendance
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Grade
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {lowPerformers.map((student) => (
                <tr key={student.rrn}>
                  <td className="px-5 py-4 font-medium text-gray-900">
                    {student.name}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {student.rrn}
                  </td>

                  <td className="px-5 py-4 text-sm font-medium text-red-600">
                    {student.average}%
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {student.attendance}%
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                      {student.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* At Risk */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900">
            At-Risk Students
          </h2>
          <Link
  to="/performance/at-risk"
  className="text-sm font-medium text-gray-700 hover:underline"
>
  View All At-Risk Students
</Link>

          <p className="mt-1 text-sm text-gray-500">
            Students requiring attention based on attendance
            and assessment performance
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Student
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  RRN
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Attendance
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Assessment Average
                </th>

                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                  Level
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {atRiskStudents.map((student) => (
                <tr key={student.rrn}>
                  <td className="px-5 py-4 font-medium text-gray-900">
                    {student.name}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {student.rrn}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {student.attendance}%
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {student.assessmentAverage}%
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        student.level === "Critical"
                          ? "bg-red-50 text-red-700"
                          : student.level ===
                            "Needs Attention"
                          ? "bg-yellow-50 text-yellow-700"
                          : "bg-orange-50 text-orange-700"
                      }`}
                    >
                      {student.level}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}