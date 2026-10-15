export type TeacherAttendanceStatus =
  | "Present"
  | "Absent"
  | "Leave"
  | "Half Day"
  | "Holiday"
  | "Pending";

export type TeacherAttendanceDay = {
  dayNumber: number; // 1 to 90
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  status: TeacherAttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  classesConducted: number;
  subject: string;
  remarks?: string;
  leaveType?: "Casual" | "Medical" | "Duty" | "On-Duty" | "None";
};

export type TeacherAttendanceSummary = {
  totalCourseDays: number; // 90
  totalCourseMonths: number; // 3
  currentDayNumber: number; // e.g. 76
  todayDate: string; // YYYY-MM-DD
  todayDayOfWeek: string;
  isSunday: boolean;
  totalClassesAssigned: number; // 90
  daysAttended: number; // e.g. 46
  daysLeave: number; // e.g. 4
  daysAbsent: number; // e.g. 1
  daysRemaining: number; // e.g. 13
  attendancePercentage: number; // e.g. 90.2%
  courseCompletionPercentage: number; // e.g. 85.5%
  casualLeaveAllowance: number; // 6
  casualLeaveUsed: number; // 3
  medicalLeaveAllowance: number; // 4
  medicalLeaveUsed: number; // 1
  todayStatus: TeacherAttendanceStatus | "Holiday";
  todayCheckInTime?: string;
  todayRemarks?: string;
};

const STORAGE_KEY = "dudex_teacher_self_attendance_data";

export function isTodaySunday(): boolean {
  return new Date().getDay() === 0;
}

export function getTodayDateStr(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function getCurrentDayRecord(days: TeacherAttendanceDay[]): TeacherAttendanceDay {
  const todayStr = getTodayDateStr();
  const exact = days.find((d) => d.date === todayStr);
  if (exact) return exact;

  // If today is Sunday (weekend), active reference day is the upcoming Monday
  const nextWorking = days.find((d) => d.date >= todayStr);
  if (nextWorking) return nextWorking;

  return days[days.length - 1] || days[0];
}

function generateInitial90DaysData(): TeacherAttendanceDay[] {
  const days: TeacherAttendanceDay[] = [];
  const startDate = new Date(2026, 6, 1); // July 1, 2026
  const todayStr = getTodayDateStr();

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let currentCalDate = new Date(startDate);
  let workingDayCount = 0;

  while (workingDayCount < 90) {
    const dayOfWeekIndex = currentCalDate.getDay();
    const isWeekend = dayOfWeekIndex === 0; // Sunday off

    const yyyy = currentCalDate.getFullYear();
    const mm = String(currentCalDate.getMonth() + 1).padStart(2, "0");
    const dd = String(currentCalDate.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const dayOfWeek = dayNames[dayOfWeekIndex];

    if (!isWeekend) {
      workingDayCount++;
      const dayNum = workingDayCount;

      let status: TeacherAttendanceStatus = "Pending";
      let checkInTime: string | undefined = undefined;
      let checkOutTime: string | undefined = undefined;
      let classesConducted = 0;
      let remarks: string | undefined = undefined;
      let leaveType: TeacherAttendanceDay["leaveType"] = "None";

      if (dateStr < todayStr) {
        // Past days before today
        if (dayNum === 8 || dayNum === 24 || dayNum === 39) {
          status = "Leave";
          leaveType = "Casual";
          remarks = "Casual leave approved by department";
          classesConducted = 0;
        } else if (dayNum === 17) {
          status = "Leave";
          leaveType = "Medical";
          remarks = "Medical rest certificate submitted";
          classesConducted = 0;
        } else if (dayNum === 31) {
          status = "Absent";
          remarks = "Emergency absent - makeup class scheduled";
          classesConducted = 0;
        } else if (dayNum === 44) {
          status = "Half Day";
          checkInTime = "08:45 AM";
          checkOutTime = "01:00 PM";
          classesConducted = 1;
          remarks = "Attended faculty development workshop";
        } else {
          status = "Present";
          checkInTime = "08:45 AM";
          checkOutTime = "04:45 PM";
          classesConducted = dayNum % 2 === 0 ? 2 : 1;
          remarks = `Conducted scheduled lecture & practical session`;
        }
      } else {
        // Today and future days
        status = "Pending";
      }

      days.push({
        dayNumber: dayNum,
        date: dateStr,
        dayOfWeek,
        status,
        checkInTime,
        checkOutTime,
        classesConducted,
        subject: "Python, Data Structures",
        remarks,
        leaveType,
      });
    }

    currentCalDate.setDate(currentCalDate.getDate() + 1);
  }

  return days;
}

export const teacherAttendanceService = {
  getDays(): TeacherAttendanceDay[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: TeacherAttendanceDay[] = JSON.parse(stored);
        const todayStr = getTodayDateStr();

        // Sanitize: Clean up any future day (such as upcoming Monday) that might have been marked erroneously
        let modified = false;
        const sanitized = parsed.map((d) => {
          if (d.date > todayStr && d.status === "Present" && (d.remarks?.includes("Marked attendance") || d.checkInTime)) {
            modified = true;
            return {
              ...d,
              status: "Pending" as TeacherAttendanceStatus,
              checkInTime: undefined,
              checkOutTime: undefined,
              classesConducted: 0,
              remarks: undefined,
            };
          }
          return d;
        });

        if (modified) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
        }
        return sanitized;
      }
    } catch (e) {
      console.error("Failed to load teacher attendance", e);
    }
    const initial = generateInitial90DaysData();
    this.saveDays(initial);
    return initial;
  },

  saveDays(days: TeacherAttendanceDay[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(days));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("storage"));
      }
    } catch (e) {
      console.error("Failed to save teacher attendance", e);
    }
  },

  getSummary(): TeacherAttendanceSummary {
    const days = this.getDays();
    const todayDay = getCurrentDayRecord(days);
    const sundayToday = isTodaySunday();

    const pastAndTodayDays = days.filter(
      (d) => d.status !== "Pending"
    );

    const daysAttended = pastAndTodayDays.filter(
      (d) => d.status === "Present" || d.status === "Half Day"
    ).length;

    const daysLeave = pastAndTodayDays.filter(
      (d) => d.status === "Leave"
    ).length;

    const daysAbsent = pastAndTodayDays.filter(
      (d) => d.status === "Absent"
    ).length;

    const totalPassed = pastAndTodayDays.length;
    const attendancePercentage =
      totalPassed > 0
        ? Number(((daysAttended / totalPassed) * 100).toFixed(1))
        : 100;

    const courseCompletionPercentage = Number(
      (((todayDay ? todayDay.dayNumber : totalPassed) / 90) * 100).toFixed(1)
    );

    const casualLeaveUsed = days.filter(
      (d) => d.leaveType === "Casual"
    ).length;

    const medicalLeaveUsed = days.filter(
      (d) => d.leaveType === "Medical"
    ).length;

    return {
      totalCourseDays: 90,
      totalCourseMonths: 3,
      currentDayNumber: todayDay ? todayDay.dayNumber : 1,
      todayDate: getTodayDateStr(),
      todayDayOfWeek: sundayToday ? "Sunday" : (todayDay?.dayOfWeek || "Monday"),
      isSunday: sundayToday,
      totalClassesAssigned: 90,
      daysAttended,
      daysLeave,
      daysAbsent,
      daysRemaining: 90 - (todayDay ? todayDay.dayNumber : totalPassed),
      attendancePercentage,
      courseCompletionPercentage,
      casualLeaveAllowance: 6,
      casualLeaveUsed,
      medicalLeaveAllowance: 4,
      medicalLeaveUsed,
      todayStatus: sundayToday ? "Holiday" : (todayDay ? todayDay.status : "Pending"),
      todayCheckInTime: sundayToday ? undefined : todayDay?.checkInTime,
      todayRemarks: sundayToday
        ? "Today is Sunday (Institutional Weekend) — No classes scheduled."
        : todayDay?.remarks,
    };
  },

  markTodayAttendance(
    status: TeacherAttendanceStatus,
    remarks?: string,
    leaveType: TeacherAttendanceDay["leaveType"] = "None"
  ): { success: boolean; isSunday: boolean; message: string; summary: TeacherAttendanceSummary } {
    if (isTodaySunday()) {
      return {
        success: false,
        isSunday: true,
        message: "Today is Sunday — There are no classes scheduled for you today and you do not have to mark attendance for today because today is Sunday.",
        summary: this.getSummary(),
      };
    }

    const days = this.getDays();
    const todayDay = getCurrentDayRecord(days);
    const targetDayNumber = todayDay ? todayDay.dayNumber : 1;
    const targetDate = todayDay ? todayDay.date : getTodayDateStr();

    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const updated = days.map((d) => {
      if (d.dayNumber === targetDayNumber || d.date === targetDate) {
        return {
          ...d,
          status,
          checkInTime:
            status === "Present" || status === "Half Day"
              ? timeString || "08:45 AM"
              : undefined,
          checkOutTime:
            status === "Present"
              ? "04:30 PM"
              : status === "Half Day"
                ? "01:00 PM"
                : undefined,
          classesConducted: status === "Present" ? 2 : status === "Half Day" ? 1 : 0,
          remarks:
            remarks ||
            (status === "Present"
              ? "Marked attendance for today's classes"
              : status === "Half Day"
                ? "Conducted morning session"
                : status === "Leave"
                  ? "On Leave"
                  : "Absent"),
          leaveType: status === "Leave" ? leaveType || "Casual" : "None",
        };
      }
      return d;
    });

    this.saveDays(updated);
    return {
      success: true,
      isSunday: false,
      message: status === "Present" ? "Attendance marked as Present." : "Attendance updated.",
      summary: this.getSummary(),
    };
  },

  applyLeaveRange(
    fromDate: string,
    toDate: string,
    reason: string,
    leaveType: "Casual" | "Medical" | "Duty" | "On-Duty" = "Casual"
  ): { count: number; summary: TeacherAttendanceSummary } {
    const days = this.getDays();
    let appliedCount = 0;

    const updated = days.map((d) => {
      if (d.date >= fromDate && d.date <= toDate) {
        appliedCount++;
        return {
          ...d,
          status: "Leave" as TeacherAttendanceStatus,
          checkInTime: undefined,
          checkOutTime: undefined,
          classesConducted: 0,
          remarks: reason || "Leave applied in advance",
          leaveType,
        };
      }
      return d;
    });

    this.saveDays(updated);
    return { count: appliedCount, summary: this.getSummary() };
  },

  updateDayAttendance(
    dayNumber: number,
    status: TeacherAttendanceStatus,
    remarks?: string,
    leaveType: TeacherAttendanceDay["leaveType"] = "None"
  ): TeacherAttendanceDay[] {
    const days = this.getDays();
    const updated = days.map((d) => {
      if (d.dayNumber === dayNumber) {
        let checkInTime = d.checkInTime;
        let checkOutTime = d.checkOutTime;

        if (status === "Present") {
          checkInTime = checkInTime || "08:45 AM";
          checkOutTime = checkOutTime || "04:30 PM";
        } else if (status === "Half Day") {
          checkInTime = checkInTime || "08:45 AM";
          checkOutTime = checkOutTime || "01:00 PM";
        } else {
          checkInTime = undefined;
          checkOutTime = undefined;
        }

        let updatedRemarks = remarks;
        if (updatedRemarks === undefined || updatedRemarks.trim() === "") {
          if (status === "Present") {
            updatedRemarks =
              d.remarks && !d.remarks.toLowerCase().includes("absent") && !d.remarks.toLowerCase().includes("leave")
                ? d.remarks
                : "Conducted scheduled lecture & practical session";
          } else if (status === "Half Day") {
            updatedRemarks = "Conducted morning lecture session";
          } else if (status === "Leave") {
            updatedRemarks = "On approved leave";
          } else if (status === "Absent") {
            updatedRemarks = "Absent";
          } else {
            updatedRemarks = d.remarks;
          }
        }

        return {
          ...d,
          status,
          checkInTime,
          checkOutTime,
          classesConducted: status === "Present" ? 2 : status === "Half Day" ? 1 : 0,
          remarks: updatedRemarks,
          leaveType: status === "Leave" ? (leaveType || "Casual") : "None",
        };
      }
      return d;
    });
    this.saveDays(updated);
    return updated;
  },

  resetAll(): void {
    const initial = generateInitial90DaysData();
    this.saveDays(initial);
  },
};
