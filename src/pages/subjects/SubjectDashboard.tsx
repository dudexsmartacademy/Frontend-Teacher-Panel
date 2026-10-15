import { useMemo } from "react";
import { Navigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CalendarCheck,
  FileText,
  Megaphone,
  Users,
} from "lucide-react";

import { teacherAssignments } from "../../data";

type SubjectWorkspace = {
  id: string;
  subject: string;
  classId: string;
  className: string;
  academicYear: string;
  totalStudents: number;
  attendance: number;
  assessments: number;
  averageMarks: number;
  gradeDistribution: {
    grade: string;
    count: number;
  }[];
  materials: string[];
  announcements: string[];
};

const subjectWorkspaces: SubjectWorkspace[] = [
  {
    id: "1",
    subject: "Python",
    classId: "1",
    className: "AI & DS - Section B",
    academicYear: "2024–2028",
    totalStudents: 64,
    attendance: 86,
    assessments: 4,
    averageMarks: 78,
    gradeDistribution: [
      {
        grade: "A",
        count: 18,
      },
      {
        grade: "B",
        count: 24,
      },
      {
        grade: "C",
        count: 14,
      },
      {
        grade: "D",
        count: 5,
      },
      {
        grade: "F",
        count: 3,
      },
    ],
    materials: [
      "Python Unit 1 Notes",
      "Python Programming Exercises",
      "Python Lab Material",
    ],
    announcements: [
      "Python assessment scheduled for September 10.",
      "Complete the pending Python exercises.",
    ],
  },
  {
    id: "2",
    subject: "Data Structures",
    classId: "2",
    className: "AI & DS - Section A",
    academicYear: "2024–2028",
    totalStudents: 62,
    attendance: 82,
    assessments: 3,
    averageMarks: 74,
    gradeDistribution: [
      {
        grade: "A",
        count: 15,
      },
      {
        grade: "B",
        count: 23,
      },
      {
        grade: "C",
        count: 16,
      },
      {
        grade: "D",
        count: 6,
      },
      {
        grade: "F",
        count: 2,
      },
    ],
    materials: [
      "Data Structures Unit 1",
      "Arrays and Linked Lists",
      "Stack and Queue Notes",
    ],
    announcements: [
      "Data Structures Unit 1 assessment scheduled.",
      "Review the linked list material.",
    ],
  },
  {
    id: "3",
    subject: "Programming",
    classId: "3",
    className: "CSE - Section A",
    academicYear: "2023–2027",
    totalStudents: 58,
    attendance: 84,
    assessments: 3,
    averageMarks: 76,
    gradeDistribution: [
      {
        grade: "A",
        count: 16,
      },
      {
        grade: "B",
        count: 21,
      },
      {
        grade: "C",
        count: 14,
      },
      {
        grade: "D",
        count: 5,
      },
      {
        grade: "F",
        count: 2,
      },
    ],
    materials: [
      "Programming Fundamentals",
      "Programming Lab Exercises",
      "Control Structures Notes",
    ],
    announcements: [
      "Programming assessment scheduled.",
      "Complete the assigned programming exercises.",
    ],
  },
];

export default function SubjectDashboard() {
  const { id } = useParams();

  const workspace = subjectWorkspaces.find(
    (item) => item.id === id
  );

  /*
   * Only active teacher assignments are allowed.
   */
  const authorizedAssignments = useMemo(
    () =>
      teacherAssignments.filter(
        (assignment) => assignment.active
      ),
    []
  );

  const hasAccess =
    workspace !== undefined &&
    authorizedAssignments.some(
      (assignment) =>
        assignment.classId ===
          workspace.classId &&
        assignment.subject ===
          workspace.subject
    );

  /*
   * Do not expose subject information when
   * the teacher is not assigned to it.
   */
  if (!workspace || !hasAccess) {
    return (
      <Navigate
        to="/subjects"
        replace
      />
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Back */}
      <Link
        to="/subjects"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Back to Subjects
      </Link>

      {/* Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-gray-100 p-3">
            <BookOpen
              size={24}
              className="text-gray-700"
            />
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {workspace.subject}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {workspace.className}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Academic Year:{" "}
              {workspace.academicYear}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Users
              size={20}
              className="text-gray-500"
            />

            <div>
              <p className="text-sm text-gray-500">
                Total Students
              </p>

              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {workspace.totalStudents}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <CalendarCheck
              size={20}
              className="text-gray-500"
            />

            <div>
              <p className="text-sm text-gray-500">
                Attendance
              </p>

              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {workspace.attendance}%
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Assessments
          </p>

          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {workspace.assessments}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Average Marks
          </p>

          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {workspace.averageMarks}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Class
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-900">
            {workspace.className}
          </p>
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Grade Distribution
        </h2>

        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-5">
          {workspace.gradeDistribution.map(
            (item) => (
              <div
                key={item.grade}
                className="rounded-lg border border-gray-200 p-4 text-center"
              >
                <p className="text-sm text-gray-500">
                  Grade
                </p>

                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {item.grade}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {item.count} students
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Materials */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <FileText
            size={20}
            className="text-gray-600"
          />

          <h2 className="text-lg font-semibold text-gray-900">
            Materials
          </h2>
        </div>

        <div className="mt-4 space-y-3">
          {workspace.materials.map(
            (material) => (
              <div
                key={material}
                className="rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700"
              >
                {material}
              </div>
            )
          )}
        </div>
      </div>

      {/* Announcements */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Megaphone
            size={20}
            className="text-gray-600"
          />

          <h2 className="text-lg font-semibold text-gray-900">
            Announcements
          </h2>
        </div>

        <div className="mt-4 space-y-3">
          {workspace.announcements.map(
            (announcement) => (
              <div
                key={announcement}
                className="rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-700"
              >
                {announcement}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}