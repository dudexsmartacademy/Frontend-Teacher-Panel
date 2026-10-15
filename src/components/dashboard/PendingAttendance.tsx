const sessions = [
  {
    subject: "Python",
    className: "AI & DS - B",
    time: "09:00 AM",
  },
  {
    subject: "Data Structures",
    className: "AI & DS - B",
    time: "11:00 AM",
  },
];

export default function PendingAttendance() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900">
          Pending Attendance
        </h3>
      </div>

      <div className="divide-y divide-gray-100">
        {sessions.map((session, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-5"
          >
            <div>
              <p className="text-sm font-medium text-gray-900">
                {session.subject}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {session.className}
              </p>
            </div>

            <p className="text-xs text-gray-500">
              {session.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}