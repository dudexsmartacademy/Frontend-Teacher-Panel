const schedule = [
  {
    time: "09:00 AM - 10:00 AM",
    subject: "Python",
    className: "AI & DS - B",
  },
  {
    time: "11:00 AM - 12:00 PM",
    subject: "Data Structures",
    className: "AI & DS - B",
  },
  {
    time: "02:00 PM - 03:00 PM",
    subject: "Python",
    className: "AI & DS - A",
  },
];

export default function TodaySchedule() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 p-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9C7449]">Friday, 11 September</p>
          <h3 className="mt-1 font-bold text-gray-900">Today's Schedule</h3>
        </div>
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">3 sessions</span>
      </div>

      <div className="divide-y divide-gray-100">
        {schedule.map((item, index) => (
          <div key={index} className="flex items-center gap-4 p-5 transition-colors hover:bg-gray-100">
            <div className={`h-10 w-1 shrink-0 rounded-full ${index === 0 ? "bg-[#B08E67]" : "bg-[#E9DED0]"}`} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900">
                {item.subject}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {item.className}
              </p>
            </div>

            <p className="shrink-0 text-right text-xs font-semibold text-gray-600">
              {item.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}