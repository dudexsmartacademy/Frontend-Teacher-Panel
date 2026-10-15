import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Code2,
  LoaderCircle,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

type EvaluationStatus =
  | "Accepted"
  | "Wrong Answer"
  | "Runtime Error"
  | "Time Limit Exceeded"
  | "Evaluating";

type Evaluation = {
  id: number;
  student: string;
  rrn: string;
  language: string;
  submittedAt: string;
  testCases: number;
  passed: number;
  status: EvaluationStatus;
  score: number;
};

const evaluations: Evaluation[] = [
  {
    id: 1,
    student: "Arun Kumar",
    rrn: "RRN001",
    language: "Python",
    submittedAt: "2026-09-08 10:15 AM",
    testCases: 10,
    passed: 10,
    status: "Accepted",
    score: 20,
  },
  {
    id: 2,
    student: "Priya Sharma",
    rrn: "RRN002",
    language: "Python",
    submittedAt: "2026-09-08 10:22 AM",
    testCases: 10,
    passed: 8,
    status: "Wrong Answer",
    score: 16,
  },
  {
    id: 3,
    student: "Rahul Raj",
    rrn: "RRN003",
    language: "Java",
    submittedAt: "2026-09-08 10:30 AM",
    testCases: 10,
    passed: 7,
    status: "Wrong Answer",
    score: 14,
  },
  {
    id: 4,
    student: "Sneha Joseph",
    rrn: "RRN004",
    language: "C++",
    submittedAt: "2026-09-08 10:38 AM",
    testCases: 10,
    passed: 0,
    status: "Runtime Error",
    score: 0,
  },
  {
    id: 5,
    student: "Vishal Kumar",
    rrn: "RRN005",
    language: "Python",
    submittedAt: "2026-09-08 10:45 AM",
    testCases: 10,
    passed: 0,
    status: "Evaluating",
    score: 0,
  },
];

export default function CodingEvaluation() {
  const totalSubmissions = evaluations.length;
  const accepted = evaluations.filter(
    (evaluation) => evaluation.status === "Accepted",
  ).length;
  const evaluating = evaluations.filter(
    (evaluation) => evaluation.status === "Evaluating",
  ).length;

  const averageScore =
    evaluations.reduce(
      (total, evaluation) => total + evaluation.score,
      0,
    ) / evaluations.length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          to="/coding"
          className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
        >
          <ArrowLeft size={18} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Coding Evaluation
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View coding submission evaluation results.
          </p>
        </div>
      </div>

      {/* Assessment Information */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
            <Code2 size={22} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              Python Array Problems
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Python · AI & DS - Section B
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Submissions"
          value={totalSubmissions}
          icon={<Code2 size={20} />}
        />

        <StatCard
          title="Accepted"
          value={accepted}
          icon={<CheckCircle size={20} />}
        />

        <StatCard
          title="Evaluating"
          value={evaluating}
          icon={<Clock size={20} />}
        />

        <StatCard
          title="Average Score"
          value={`${averageScore.toFixed(1)}`}
          icon={<LoaderCircle size={20} />}
        />
      </div>

      {/* Evaluation Workflow */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">
          Evaluation Workflow
        </h2>

        <div className="grid gap-4 md:grid-cols-6">
          <WorkflowStep number="1" label="Student Submission" />

          <WorkflowStep number="2" label="Evaluation Job" />

          <WorkflowStep number="3" label="Sandbox Execution" />

          <WorkflowStep number="4" label="Test Cases" />

          <WorkflowStep number="5" label="Result" />

          <WorkflowStep number="6" label="Stored" />
        </div>
      </div>

      {/* Evaluation Results */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Evaluation Results
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase text-gray-500">
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">RRN</th>
                <th className="px-5 py-3">Language</th>
                <th className="px-5 py-3">Submitted At</th>
                <th className="px-5 py-3">Test Cases</th>
                <th className="px-5 py-3">Score</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {evaluations.map((evaluation) => (
                <tr
                  key={evaluation.id}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">
                      {evaluation.student}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {evaluation.rrn}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {evaluation.language}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {evaluation.submittedAt}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600">
                    {evaluation.passed} / {evaluation.testCases}
                  </td>

                  <td className="px-5 py-4 text-sm font-medium text-gray-900">
                    {evaluation.score}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={evaluation.status} />
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

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-gray-500">{title}</p>

        <div className="rounded-lg bg-gray-50 p-2 text-gray-600">
          {icon}
        </div>
      </div>

      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function WorkflowStep({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 text-center">
      <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
        {number}
      </div>

      <p className="text-xs font-medium text-gray-700">
        {label}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: EvaluationStatus;
}) {
  if (status === "Accepted") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
        <CheckCircle size={13} />
        Accepted
      </span>
    );
  }

  if (status === "Evaluating") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
        <Clock size={13} />
        Evaluating
      </span>
    );
  }

  if (status === "Runtime Error") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
        <XCircle size={13} />
        Runtime Error
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
      <XCircle size={13} />
      Wrong Answer
    </span>
  );
}