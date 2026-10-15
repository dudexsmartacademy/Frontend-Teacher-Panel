const announcements = [
  {
    title: "Placement Training Schedule",
    date: "08 September 2026",
  },
  {
    title: "Assessment Submission Reminder",
    date: "07 September 2026",
  },
  {
    title: "Class Schedule Updated",
    date: "06 September 2026",
  },
];

export default function RecentAnnouncements() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900">
          Recent Announcements
        </h3>
      </div>

      <div className="divide-y divide-gray-100">
        {announcements.map((announcement, index) => (
          <div key={index} className="p-5">
            <p className="text-sm font-medium text-gray-900">
              {announcement.title}
            </p>

            <p className="mt-1 text-xs text-gray-500">
              {announcement.date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}