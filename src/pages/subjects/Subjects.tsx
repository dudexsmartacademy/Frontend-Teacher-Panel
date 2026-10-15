import {
  ArrowRight,
  BookOpen,
  FileText,
  FolderOpen,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const subjects = [
  {
    id: 1,
    name: "Python",
    className: "AI & DS - Section B",
    students: 64,
    attendance: "86%",
    averageMarks: "76%",
    assessments: 5,
  },
  {
    id: 2,
    name: "Data Structures",
    className: "AI & DS - Section B",
    students: 64,
    attendance: "84%",
    averageMarks: "72%",
    assessments: 4,
  },
  {
    id: 3,
    name: "Programming",
    className: "AI & DS - Section A",
    students: 62,
    attendance: "89%",
    averageMarks: "81%",
    assessments: 3,
  },
];

export default function Subjects() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Subjects
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your assigned subject workspaces.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <BookOpen
                  size={20}
                  className="text-gray-600"
                />
              </div>

              <Link
                to={`/subjects/${subject.id}`}
                className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                View
                <ArrowRight size={15} />
              </Link>
            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-900">
              {subject.name}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {subject.className}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <Metric
                icon={<Users size={16} />}
                label="Students"
                value={subject.students.toString()}
              />

              <Metric
                icon={<BookOpen size={16} />}
                label="Attendance"
                value={subject.attendance}
              />

              <Metric
                icon={<FileText size={16} />}
                label="Assessments"
                value={subject.assessments.toString()}
              />

              <Metric
                icon={<FolderOpen size={16} />}
                label="Average Marks"
                value={subject.averageMarks}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-gray-400">
        {icon}

        <span className="text-xs">
          {label}
        </span>
      </div>

      <p className="mt-1 text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}