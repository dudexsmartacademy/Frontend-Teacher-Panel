import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  CalendarDays,
  UserCheck,
  Check,
  X,
  Info,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";
import {
  teacherAttendanceService,
  type TeacherAttendanceSummary,
} from "../../services/teacherAttendanceService";
import CustomSelect from "../CustomSelect";
import ResponsiveDatePicker from "../ResponsiveDatePicker";

export default function TeacherAttendanceCard() {
  const [summary, setSummary] = useState<TeacherAttendanceSummary>(() =>
    teacherAttendanceService.getSummary()
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Minimum selectable date is tomorrow (today & past dates strictly disallowed)
  const tomorrowDateStr = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    warningNote?: string;
    confirmText?: string;
    onConfirm: () => void;
  } | null>(null);

  // Leave Dialog State (Advance Leave from Tomorrow Only)
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [leaveFromDate, setLeaveFromDate] = useState(tomorrowDateStr);
  const [leaveToDate, setLeaveToDate] = useState(tomorrowDateStr);
  const [leaveReason, setLeaveReason] = useState("");
  const [selectedLeaveType, setSelectedLeaveType] = useState<"Casual" | "Medical" | "Duty">("Casual");
  const [leaveFormError, setLeaveFormError] = useState<string | null>(null);

  useEffect(() => {
    const handleStorageChange = () => {
      setSummary(teacherAttendanceService.getSummary());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const executeMarkPresent = () => {
    const result = teacherAttendanceService.markTodayAttendance("Present");
    setSummary(result.summary);
    showToast(result.message);
  };

  const handleMarkPresentWithConfirm = () => {
    if (summary.isSunday) {
      showToast("Today is Sunday — There are no classes scheduled for you today and you do not have to mark attendance for today because today is Sunday.");
      return;
    }

    if (summary.todayStatus && summary.todayStatus !== "Pending" && summary.todayStatus !== "Holiday") {
      setConfirmDialog({
        isOpen: true,
        title: "Confirm Attendance Alteration",
        description: `You have already marked today's attendance as "${summary.todayStatus}". Do you want to modify and change today's status to Present, or cancel?`,
        warningNote: "This will update today's attendance record and log your check-in timestamp.",
        confirmText: "Yes, Update Attendance",
        onConfirm: () => {
          executeMarkPresent();
          setConfirmDialog(null);
        },
      });
      return;
    }
    executeMarkPresent();
  };

  const handleOpenLeaveDialog = () => {
    if (summary.isSunday) {
      showToast("Today is Sunday — There are no classes scheduled for today. You can apply advance leave for upcoming academic days.");
    }
    setLeaveFromDate(tomorrowDateStr);
    setLeaveToDate(tomorrowDateStr);
    setLeaveReason("");
    setLeaveFormError(null);
    setLeaveDialogOpen(true);
  };

  const handleApplyAdvanceLeave = (e: React.FormEvent) => {
    e.preventDefault();
    setLeaveFormError(null);

    // Validation 1: From date must be tomorrow or later
    if (leaveFromDate < tomorrowDateStr) {
      setLeaveFormError("Notice: The leave must be taken at least 1 day in advance (from tomorrow onwards). Today and past days are not allowed.");
      return;
    }

    // Validation 2: To date must be >= From date
    if (leaveToDate < leaveFromDate) {
      setLeaveFormError("To Date cannot be earlier than From Date.");
      return;
    }

    // Validation 3: Reason is required
    if (!leaveReason.trim()) {
      setLeaveFormError("Please provide a valid reason for the leave request.");
      return;
    }

    const executeApply = () => {
      const { count, summary: updatedSummary } = teacherAttendanceService.applyLeaveRange(
        leaveFromDate,
        leaveToDate,
        leaveReason.trim(),
        selectedLeaveType
      );

      setSummary(updatedSummary);
      setLeaveDialogOpen(false);
      setLeaveReason("");
      showToast(`Leave application submitted successfully for ${count > 0 ? count : 1} day(s) (${leaveFromDate} to ${leaveToDate}).`);
    };

    // Check for existing marked/leave days in the selected range
    const allDays = teacherAttendanceService.getDays();
    const alreadyMarkedDays = allDays.filter(
      (d) => d.date >= leaveFromDate && d.date <= leaveToDate && d.status !== "Pending"
    );

    if (alreadyMarkedDays.length > 0) {
      setConfirmDialog({
        isOpen: true,
        title: "Confirm Leave Reschedule & Alteration",
        description: `You already have ${alreadyMarkedDays.length} day(s) with recorded attendance/leave in this date range (${leaveFromDate} to ${leaveToDate}). Do you want to make these changes and overwrite the schedule, or cancel?`,
        warningNote: "This will reschedule your existing leave/classes for the selected dates.",
        confirmText: "Yes, Overwrite & Apply Leave",
        onConfirm: () => {
          executeApply();
          setConfirmDialog(null);
        },
      });
      return;
    }

    executeApply();
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-200/70 bg-gradient-to-br from-amber-50/60 via-white to-orange-50/30 p-5 shadow-sm transition-all hover:shadow-md sm:p-6">
      {/* Toast popup */}
      {toastMessage && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-medium text-white shadow-xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 rounded p-0.5 hover:bg-gray-800 cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Top row: Header & Mark Attendance Actions */}
      <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E9DED0] text-[#9C7449] shadow-xs">
            <UserCheck size={24} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-lg font-bold text-gray-900">
                Faculty Self-Attendance
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/80 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                <CalendarDays size={13} />
                3-Month Course (90 Days)
              </span>
            </div>
            <p className="mt-0.5 text-xs text-gray-500">
              Track your teaching attendance, attended classes, and leave balance across the 90-day semester
            </p>
          </div>
        </div>

        {/* Action Buttons & Status Badge */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-xs">
            <div className="flex items-center gap-1.5">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  summary.isSunday
                    ? "bg-blue-500"
                    : summary.todayStatus === "Present"
                      ? "bg-emerald-500 animate-pulse"
                      : summary.todayStatus === "Leave"
                        ? "bg-amber-500"
                        : "bg-rose-500"
                }`}
              />
              <span className="text-xs font-semibold text-gray-700">
                Today:{" "}
                <span
                  className={
                    summary.isSunday
                      ? "text-blue-700 font-bold"
                      : summary.todayStatus === "Present"
                        ? "text-emerald-700"
                        : summary.todayStatus === "Leave"
                          ? "text-amber-700"
                          : "text-rose-700"
                  }
                >
                  {summary.isSunday ? "Sunday (No Class)" : summary.todayStatus}
                </span>
              </span>
            </div>
            {summary.todayCheckInTime && (
              <span className="flex items-center gap-1 border-l border-gray-200 pl-2 text-[11px] text-gray-500">
                <Clock size={12} /> {summary.todayCheckInTime}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleMarkPresentWithConfirm}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer ${
              summary.isSunday
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            <Check size={14} />
            Mark Present
          </button>

          <button
            type="button"
            onClick={handleOpenLeaveDialog}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-xs transition hover:bg-gray-50 active:scale-95 cursor-pointer"
          >
            Mark Leave
          </button>

          <Link
            to="/my-attendance"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-gray-800 active:scale-95 cursor-pointer"
          >
            <span>View My Attendance</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Sunday Notice Banner */}
      {summary.isSunday && (
        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50/80 p-3.5 flex items-start gap-2.5 text-xs text-blue-950">
          <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Today is Sunday (Institutional Weekend):</strong> There are no classes scheduled for you today and faculty attendance is not required.
          </p>
        </div>
      )}

      {/* 4 Key Statistics for the 90-Day Course */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* Total Course Duration */}
        <div className="rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs">
          <p className="text-xs font-medium text-gray-500">
            Total Course Days
          </p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-gray-900">
              {summary.totalCourseDays}
            </span>
            <span className="text-xs text-gray-500 font-medium">Days (3 Mo)</span>
          </div>
          <p className="mt-1 text-[11px] text-amber-700 font-medium">
            Day {summary.currentDayNumber} of 90 in progress
          </p>
        </div>

        {/* Classes Attended */}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 shadow-xs">
          <p className="text-xs font-medium text-emerald-800">
            Days Attended
          </p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-emerald-950">
              {summary.daysAttended}
            </span>
            <span className="text-xs text-emerald-700 font-medium">
              / {summary.currentDayNumber} Days
            </span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-700 font-medium">
            Full &amp; active class attendance
          </p>
        </div>

        {/* Leaves / Absent Taken */}
        <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-4 shadow-xs">
          <p className="text-xs font-medium text-amber-800">
            Leaves / Absent
          </p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-amber-950">
              {summary.daysLeave + summary.daysAbsent}
            </span>
            <span className="text-xs text-amber-700 font-medium">Days taken</span>
          </div>
          <p className="mt-1 text-[11px] text-amber-700 font-medium">
            {summary.daysLeave} Leave · {summary.daysAbsent} Absent
          </p>
        </div>

        {/* Overall Attendance Rate */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-blue-800">
              Attendance Rate
            </p>
            <TrendingUp size={14} className="text-blue-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-blue-950">
              {summary.attendancePercentage}%
            </span>
            <span className="text-xs text-blue-700 font-medium">Target: 85%</span>
          </div>

          {/* Progress Bar */}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-blue-200/60">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${Math.min(summary.attendancePercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Apply Advance Leave Dialog Modal */}
      {leaveDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="leave-date-modal w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800 font-bold">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Apply Advance Leave
                  </h3>
                  <p className="text-xs text-gray-500">Submit planned faculty leave in advance</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLeaveDialogOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Prominent Policy Notes at the Top */}
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 flex items-start gap-3 text-xs text-amber-900">
              <Info className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
              <div className="space-y-0.5 leading-relaxed">
                <p className="font-bold text-amber-950">Academic Leave Policy Notice:</p>
                <p className="text-amber-800">
                  The leave should be taken at least <strong>one day in advance</strong>. Same-day (today) and past-dated leaves are not allowed. You may only select dates starting from tomorrow onwards.
                </p>
              </div>
            </div>

            {/* Error Message */}
            {leaveFormError && (
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 animate-in fade-in">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                <p className="font-medium">{leaveFormError}</p>
              </div>
            )}

            <form onSubmit={handleApplyAdvanceLeave} className="mt-4 space-y-4">
              {/* Responsive Date Selection: From & To */}
<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
  <ResponsiveDatePicker
    label="From Date"
    value={leaveFromDate}
    minDate={tomorrowDateStr}
    helperText="From tomorrow onwards only"
    onChange={(date) => {
      setLeaveFromDate(date);

      if (leaveToDate < date) {
        setLeaveToDate(date);
      }
    }}
  />

  <ResponsiveDatePicker
    label="To Date"
    value={leaveToDate}
    minDate={leaveFromDate || tomorrowDateStr}
    helperText="End date of leave"
    onChange={setLeaveToDate}
  />
</div>

              {/* Leave Type */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-gray-700">
                  Leave Type <span className="text-rose-500">*</span>
                </label>
                <CustomSelect
                  value={selectedLeaveType}
                  onChange={(val) => setSelectedLeaveType(val as "Casual" | "Medical" | "Duty")}
                  options={[
                    {
                      value: "Casual",
                      label: `Casual Leave (CL) — ${summary.casualLeaveAllowance - summary.casualLeaveUsed} Days Remaining`,
                    },
                    {
                      value: "Medical",
                      label: `Medical Leave (ML) — ${summary.medicalLeaveAllowance - summary.medicalLeaveUsed} Days Remaining`,
                    },
                    {
                      value: "Duty",
                      label: "On-Duty / Academic Deputation (OD)",
                    },
                  ]}
                />
              </div>

              {/* Reason for Leave */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-gray-700">
                  Reason for Leave <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder="Please describe the purpose/reason for your leave request in detail..."
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-sm text-gray-900 outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setLeaveDialogOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-600 px-5 py-2 text-sm font-bold text-white hover:bg-amber-700 shadow-sm cursor-pointer transition-all active:scale-95"
                >
                  Submit Leave Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation & Alteration Dialog Modal */}
      {confirmDialog && confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150 border border-gray-200">
            <div className="flex items-start gap-3.5 mb-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
                <HelpCircle size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 leading-snug">
                  {confirmDialog.title}
                </h3>
                <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                  {confirmDialog.description}
                </p>
              </div>
            </div>

            {confirmDialog.warningNote && (
              <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle size={15} className="text-amber-700 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{confirmDialog.warningNote}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                Cancel (Keep Current)
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className="rounded-xl bg-amber-600 px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white hover:bg-amber-700 shadow-sm transition active:scale-95 cursor-pointer"
              >
                {confirmDialog.confirmText || "Yes, Confirm Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
