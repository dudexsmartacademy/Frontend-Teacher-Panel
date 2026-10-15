const assessments = [
  {
    name: "Python MCQ Assessment",
    subject: "Python",
    date: "10 September 2026",
  },
  {
    name: "Data Structures Test",
    subject: "Data Structures",
    date: "12 September 2026",
  },
  {
    name: "Coding Assessment",
    subject: "Programming",
    date: "15 September 2026",
  },
];

export default function UpcomingAssessments() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900">
          Upcoming Assessments
        </h3>
      </div>

      <div className="divide-y divide-gray-100">
        {assessments.map((assessment, index) => (
          <div key={index} className="p-5">
            <p className="text-sm font-medium text-gray-900">
              {assessment.name}
            </p>

            <div className="mt-1 flex justify-between gap-4">
              <p className="text-xs text-gray-500">
                {assessment.subject}
              </p>

              <p className="text-xs text-gray-500">
                {assessment.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}