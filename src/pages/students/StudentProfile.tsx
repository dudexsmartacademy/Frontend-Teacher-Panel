import { Navigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CalendarCheck,
  Code2,
  GraduationCap,
  History,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { teacherAssignments } from "../../data";

type Student = {
  id: string;
  name: string;
  rrn: string;
  college: string;
  department: string;
  section: string;
  classId: string;
  attendance: number;
  averageMark: number;
  grade: string;
  assessmentCompletion: number;
};

const students: Student[] = [
  {
    id: "1",
    name: "Arun Kumar",
    rrn: "RRN001",
    college: "ABC Engineering College",
    department: "AI & DS",
    section: "B",
    classId: "1",
    attendance: 92,
    averageMark: 86,
    grade: "A",
    assessmentCompletion: 100,
  },
  {
    id: "2",
    name: "Priya Sharma",
    rrn: "RRN002",
    college: "ABC Engineering College",
    department: "AI & DS",
    section: "B",
    classId: "1",
    attendance: 88,
    averageMark: 81,
    grade: "A",
    assessmentCompletion: 95,
  },
  {
    id: "3",
    name: "Rahul Raj",
    rrn: "RRN003",
    college: "ABC Engineering College",
    department: "AI & DS",
    section: "B",
    classId: "1",
    attendance: 68,
    averageMark: 54,
    grade: "C",
    assessmentCompletion: 70,
  },
  {
    id: "4",
    name: "Sneha Joseph",
    rrn: "RRN004",
    college: "ABC Engineering College",
    department: "AI & DS",
    section: "B",
    classId: "1",
    attendance: 96,
    averageMark: 91,
    grade: "A+",
    assessmentCompletion: 100,
  },
  {
    id: "5",
    name: "Vishal Kumar",
    rrn: "RRN005",
    college: "ABC Engineering College",
    department: "AI & DS",
    section: "B",
    classId: "1",
    attendance: 74,
    averageMark: 48,
    grade: "D",
    assessmentCompletion: 60,
  },
  {
    id: "6",
    name: "Meena Devi",
    rrn: "RRN006",
    college: "ABC Engineering College",
    department: "AI & DS",
    section: "B",
    classId: "1",
    attendance: 90,
    averageMark: 76,
    grade: "B+",
    assessmentCompletion: 90,
  },
];

export default function StudentProfile() {
  const { id } = useParams();

  const student = students.find((item) => item.id === id);

  const authorizedClassIds = teacherAssignments
    .filter((assignment) => assignment.active)
    .map((assignment) => assignment.classId);

  const hasAccess =
    student !== undefined &&
    authorizedClassIds.includes(student.classId);

  if (!hasAccess) {
    return <Navigate to="/students" replace />;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Link
          to="/students"
          className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50"
        >
          <ArrowLeft size={18} />
        </Link>

        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Student Profile
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Complete academic performance
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-semibold text-blue-700">
            {student.name.charAt(0)}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {student.name}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {student.rrn}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {student.department} • Section {student.section}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Attendance</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {student.attendance}%
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Average Mark</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {student.averageMark}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Grade</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {student.grade}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Assessment Completion
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {student.assessmentCompletion}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProfileSection
          icon={<GraduationCap size={20} />}
          title="Student Information"
          items={[
            ["Name", student.name],
            ["RRN", student.rrn],
            ["College", student.college],
            ["Department", student.department],
            ["Section", student.section],
          ]}
        />

        <ProfileSection
          icon={<BookOpen size={20} />}
          title="Academic Information"
          items={[
            ["Average Mark", `${student.averageMark}`],
            ["Grade", student.grade],
            [
              "Assessment Completion",
              `${student.assessmentCompletion}%`,
            ],
          ]}
        />

        <ProfileSection
          icon={<CalendarCheck size={20} />}
          title="Attendance"
          items={[
            ["Attendance", `${student.attendance}%`],
            ["Status", student.attendance < 75 ? "Low" : "Good"],
          ]}
        />

        <ProfileSection
          icon={<TrendingUp size={20} />}
          title="Performance"
          items={[
            ["Average Mark", `${student.averageMark}`],
            ["Grade", student.grade],
            [
              "Performance",
              student.averageMark >= 80
                ? "High Performer"
                : student.averageMark < 60
                  ? "Low Performer"
                  : "Average",
            ],
          ]}
        />

        <ProfileSection
          icon={<History size={20} />}
          title="Attendance History"
          items={[
            ["Current Attendance", `${student.attendance}%`],
            ["Sessions Recorded", "24"],
            ["Present", "22"],
            ["Absent", "2"],
          ]}
        />

        <ProfileSection
          icon={<History size={20} />}
          title="Assessment History"
          items={[
            ["Assessments", "10"],
            ["Completed", `${student.assessmentCompletion}%`],
            ["Average", `${student.averageMark}`],
          ]}
        />

        <ProfileSection
          icon={<Code2 size={20} />}
          title="Coding Performance"
          items={[
            ["Problems Attempted", "12"],
            ["Passed", "9"],
            ["Failed", "3"],
          ]}
        />

        <ProfileSection
          icon={<MessageSquare size={20} />}
          title="Teacher Notes"
          items={[
            ["Notes", "No notes added"],
          ]}
        />
      </div>
    </div>
  );
}

type ProfileSectionProps = {
  icon: React.ReactNode;
  title: string;
  items: string[][];
};

function ProfileSection({
  icon,
  title,
  items,
}: ProfileSectionProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-gray-200 p-5">
        <div className="text-blue-600">{icon}</div>

        <h2 className="font-semibold text-gray-900">
          {title}
        </h2>
      </div>

      <div className="space-y-3 p-5">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4"
          >
            <span className="text-sm text-gray-500">
              {label}
            </span>

            <span className="text-right text-sm font-medium text-gray-900">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}