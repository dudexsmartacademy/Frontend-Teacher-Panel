import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Layers,
} from "lucide-react";
import CustomSelect from "../../components/CustomSelect";
import { teacherAssignments } from "../../data/teacher/teacherData";

type EventType =
  | "Class"
  | "Attendance"
  | "Assessment"
  | "Deadline"
  | "Event";

type CalendarEvent = {
  id: string;
  title: string;
  type: EventType;
  date: string;
  startTime?: string;
  endTime?: string;
  classId: string;
  className: string;
  subject: string;
};

const calendarEvents: CalendarEvent[] = [
  {
    id: "CAL001",
    title: "Python Basics",
    type: "Class",
    date: "2026-09-08",
    startTime: "09:00",
    endTime: "10:00",
    classId: "1",
    className: "AI & DS - Section B",
    subject: "Python",
  },
  {
    id: "CAL002",
    title: "Python Attendance Session",
    type: "Attendance",
    date: "2026-09-08",
    startTime: "09:00",
    endTime: "10:00",
    classId: "1",
    className: "AI & DS - Section B",
    subject: "Python",
  },
  {
    id: "CAL003",
    title: "Python Fundamentals Assessment",
    type: "Assessment",
    date: "2026-09-10",
    startTime: "10:00",
    endTime: "11:00",
    classId: "1",
    className: "Batch 1",
    subject: "Python",
  },
  {
    id: "CAL004",
    title: "Python Assignment Submission",
    type: "Deadline",
    date: "2026-09-15",
    classId: "1",
    className: "Batch 1",
    subject: "Python",
  },
  {
    id: "CAL005",
    title: "Arrays and Linked Lists",
    type: "Class",
    date: "2026-09-09",
    startTime: "11:00",
    endTime: "12:00",
    classId: "2",
    className: "Batch 2",
    subject: "Data Structures",
  },
  {
    id: "CAL006",
    title: "Data Structures Assessment",
    type: "Assessment",
    date: "2026-09-12",
    startTime: "14:00",
    endTime: "15:00",
    classId: "2",
    className: "Batch 2",
    subject: "Data Structures",
  },
];

const eventTypeStyles: Record<EventType, string> = {
  Class: "bg-blue-100 text-blue-800 border border-blue-200/60",
  Attendance: "bg-green-100 text-green-800 border border-green-200/60",
  Assessment: "bg-purple-100 text-purple-800 border border-purple-200/60",
  Deadline: "bg-red-100 text-red-800 border border-red-200/60",
  Event: "bg-amber-100 text-amber-800 border border-amber-200/60",
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(
    new Date(2026, 8, 8)
  );

  const [typeFilter, setTypeFilter] = useState<
    "All" | EventType
  >("All");

  const [classFilter, setClassFilter] =
    useState("All");

  const authorizedClassIds = useMemo(
    () =>
      new Set(
        teacherAssignments
          .filter((assignment) => assignment.active)
          .map((assignment) => assignment.classId)
      ),
    []
  );

  const authorizedEvents = useMemo(
    () =>
      calendarEvents.filter((event) =>
        authorizedClassIds.has(event.classId)
      ),
    [authorizedClassIds]
  );

  const filteredEvents = useMemo(
    () =>
      authorizedEvents.filter((event) => {
        const matchesType =
          typeFilter === "All" ||
          event.type === typeFilter;

        const matchesClass =
          classFilter === "All" ||
          event.classId === classFilter;

        return matchesType && matchesClass;
      }),
    [
      authorizedEvents,
      typeFilter,
      classFilter,
    ]
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const previousMonth = () => {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date(2026, 8, 8));
  };

  const getEventsForDay = (day: number) => {
    const date = `${year}-${String(month + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;

    return filteredEvents.filter(
      (event) => event.date === date
    );
  };

  const classOptions = [
    ...new Map(
      authorizedEvents.map((event) => [
        event.classId,
        event.className,
      ])
    ),
  ];

  return (
    <div className="min-h-screen bg-[#faf7f2]/50 p-3 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">
              Academic Calendar
            </h1>
            <span className="inline-flex items-center rounded-full bg-[#e9ded0] px-2.5 py-0.5 text-xs font-bold text-gray-800 border border-[#b08e67]/30">
              {filteredEvents.length} Events
            </span>
          </div>

          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            View and manage classes, attendance sessions, assessments, deadlines, and academic events.
          </p>
        </div>

        {/* Today quick action button on top-right for larger screens */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={goToToday}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-xs transition"
          >
            Go to Today (Sep 8, 2026)
          </button>
        </div>
      </div>

      {/* Responsive Filters */}
      <div className="rounded-2xl border border-gray-200/80 bg-white p-3.5 sm:p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:flex lg:flex-wrap items-center gap-3.5">
          {/* Event Type Filter */}
          <div className="w-full sm:flex-1 lg:w-64">
            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-600">
              <Filter size={12} className="text-gray-400" />
              Event Type
            </label>
            <CustomSelect
              value={typeFilter}
              onChange={(val) => setTypeFilter(val as "All" | EventType)}
              options={[
                { value: "All", label: "All Event Types" },
                { value: "Class", label: "Class" },
                { value: "Attendance", label: "Attendance" },
                { value: "Assessment", label: "Assessment" },
                { value: "Deadline", label: "Deadline" },
                { value: "Event", label: "Event" },
              ]}
            />
          </div>

          {/* Batch Filter */}
          <div className="w-full sm:flex-1 lg:w-64">
            <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-600">
              <Layers size={12} className="text-gray-400" />
              Target Batch
            </label>
            <CustomSelect
              value={classFilter}
              onChange={(val) => setClassFilter(val)}
              options={[
                { value: "All", label: "All Batches" },
                ...classOptions.map(([id, className]) => ({
                  value: id,
                  label: className,
                })),
              ]}
            />
          </div>
        </div>
      </div>

      {/* Calendar Card Container */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs">
        {/* Calendar Header Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200/80 p-3.5 sm:p-5 bg-[#fffdf9]">
          <button
            type="button"
            onClick={previousMonth}
            className="rounded-xl border border-gray-300 bg-white p-2 sm:px-3 sm:py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-2xs transition inline-flex items-center gap-1"
            title="Previous Month"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="rounded-xl bg-[#e9ded0] p-2 text-gray-800">
              <CalendarDays size={18} />
            </div>

            <h2 className="text-sm sm:text-lg font-bold text-gray-900">
              {monthNames[month]} {year}
            </h2>

            <button
              type="button"
              onClick={goToToday}
              className="sm:hidden rounded-lg border border-gray-300 px-2.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
            >
              Today
            </button>
          </div>

          <button
            type="button"
            onClick={nextMonth}
            className="rounded-xl border border-gray-300 bg-white p-2 sm:px-3 sm:py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-2xs transition inline-flex items-center gap-1"
            title="Next Month"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Horizontal scroll helper notice on small screens */}
        <div className="sm:hidden px-3 pt-2 text-[11px] font-medium text-gray-400 text-right flex items-center justify-end gap-1">
          <span>Scroll horizontally for full 7 days</span>
          <span>→</span>
        </div>

        {/* Scrollable Responsive Calendar Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[700px] lg:min-w-full">
            {/* Week Days Header */}
            <div className="grid grid-cols-7 border-b border-gray-200/80 bg-gray-50/75">
              {[
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
              ].map((day) => (
                <div
                  key={day}
                  className="border-r border-gray-200/80 px-2 sm:px-3 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-gray-500 last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 divide-y divide-gray-200/80">
              {calendarDays.map((day, index) => {
                const dayEvents = day
                  ? getEventsForDay(day)
                  : [];
                const isToday =
                  day === 8 &&
                  month === 8 &&
                  year === 2026;

                return (
                  <div
                    key={`${day}-${index}`}
                    className={`min-h-[125px] sm:min-h-[145px] border-r border-gray-200/80 p-2 sm:p-2.5 last:border-r-0 transition-colors ${
                      !day
                        ? "bg-gray-50/40"
                        : isToday
                        ? "bg-[#faf7f2]"
                        : "bg-white hover:bg-gray-50/30"
                    }`}
                  >
                    {day && (
                      <>
                        <div className="mb-2 flex items-center justify-between">
                          {isToday && (
                            <span className="text-[10px] font-bold text-[#b08e67] uppercase tracking-wider">
                              Today
                            </span>
                          )}
                          <span
                            className={`ml-auto flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full text-xs sm:text-sm font-bold ${
                              isToday
                                ? "bg-gray-900 text-white shadow-xs"
                                : "text-gray-700"
                            }`}
                          >
                            {day}
                          </span>
                        </div>

                        {/* Day Events Stack */}
                        <div className="space-y-1.5">
                          {dayEvents.map((event) => (
                            <div
                              key={event.id}
                              className="rounded-lg border border-gray-200 bg-white p-2 shadow-2xs hover:shadow-xs transition-shadow"
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span
                                  className={`inline-flex rounded-full px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold ${eventTypeStyles[event.type]}`}
                                >
                                  {event.type}
                                </span>
                              </div>

                              <p
                                className="mt-1 text-xs font-semibold text-gray-900 truncate leading-snug"
                                title={event.title}
                              >
                                {event.title}
                              </p>

                              {event.startTime && (
                                <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                                  <Clock size={10} className="shrink-0 text-gray-400" />
                                  <span>
                                    {event.startTime}
                                    {event.endTime && ` - ${event.endTime}`}
                                  </span>
                                </div>
                              )}

                              <p
                                className="mt-0.5 text-[10px] text-gray-500 truncate"
                                title={event.className}
                              >
                                {event.className}
                              </p>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200/80 p-4 sm:p-5 bg-[#fffdf9]">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Upcoming Events & Deadlines
            </h2>
            <p className="text-xs text-gray-500">
              Chronological schedule of lectures, assessments, and assignment submissions
            </p>
          </div>
          <span className="self-start sm:self-auto rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
            {filteredEvents.filter((e) => e.date >= "2026-09-08").length} Scheduled
          </span>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredEvents
            .filter(
              (event) =>
                event.date >= "2026-09-08"
            )
            .sort((a, b) =>
              a.date.localeCompare(b.date)
            )
            .map((event) => (
              <div
                key={event.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 hover:bg-[#faf7f2]/60 transition"
              >
                {/* Left details: Type badge, title, class and subject */}
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-bold shrink-0 ${eventTypeStyles[event.type]}`}
                  >
                    {event.type}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-bold text-gray-900 truncate sm:whitespace-normal">
                      {event.title}
                    </p>

                    <p className="mt-0.5 text-[11px] sm:text-xs text-gray-500">
                      <span className="font-semibold text-gray-700">{event.className}</span>
                      {event.subject ? ` • ${event.subject}` : ""}
                    </p>
                  </div>
                </div>

                {/* Right details: Date & Time - cleanly styled across small and medium screens */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100 text-left sm:text-right shrink-0">
                  <span className="text-xs font-bold text-gray-800 bg-gray-100 sm:bg-transparent px-2.5 py-1 sm:p-0 rounded-lg sm:rounded-none">
                    {event.date}
                  </span>

                  {event.startTime && (
                    <span className="text-[11px] text-gray-500 sm:mt-0.5 flex items-center gap-1 font-medium">
                      <Clock size={11} className="text-gray-400" />
                      {event.startTime}
                      {event.endTime && ` - ${event.endTime}`}
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}