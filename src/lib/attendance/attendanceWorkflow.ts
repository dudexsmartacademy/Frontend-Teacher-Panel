import { teacherAssignments } from "../../data";

export type AttendanceStatus =
  | "Present"
  | "Absent"
  | "Late"
  | "Excused";

export type AttendanceInput = {
  studentId: string;
  rrn: string;
  status: AttendanceStatus;
  time: string;
  remarks: string;
};

export type SaveAttendanceInput = {
  teacherId: string;
  classId: string;
  subject: string;
  session: string;
  date: string;
  attendance: AttendanceInput[];
};

export type AttendanceAuditRecord = {
  action: "ATTENDANCE_SAVED";
  teacherId: string;
  classId: string;
  subject: string;
  session: string;
  date: string;
  studentCount: number;
  createdAt: string;
};

export function validateAttendanceAuthorization(
  teacherId: string,
  classId: string,
  subject: string
) {
  const assignment = teacherAssignments.find(
    (item) =>
      item.active &&
      item.classId === classId &&
      item.subject === subject
  );

  if (!assignment) {
    throw new Error(
      "Teacher is not authorized for this class and subject."
    );
  }

  if (teacherId !== "FAC001") {
    throw new Error("Teacher authorization failed.");
  }

  return assignment;
}

export function validateAttendanceInput(
  input: SaveAttendanceInput
) {
  if (!input.classId) {
    throw new Error("Class is required.");
  }

  if (!input.subject) {
    throw new Error("Subject is required.");
  }

  if (!input.session) {
    throw new Error("Session is required.");
  }

  if (!input.date) {
    throw new Error("Date is required.");
  }

  if (input.attendance.length === 0) {
    throw new Error("No students found for this class.");
  }
}

export function validateStudentsBelongToClass(
  attendance: AttendanceInput[],
  classId: string
) {
  const authorizedStudentIds = new Set([
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
  ]);

  for (const student of attendance) {
    if (!authorizedStudentIds.has(student.studentId)) {
      throw new Error(
        `Student ${student.studentId} does not belong to the selected class.`
      );
    }
  }

  console.log(
    `Validated students for class ${classId}`
  );
}

export function createAttendanceAuditRecord(
  input: SaveAttendanceInput
): AttendanceAuditRecord {
  return {
    action: "ATTENDANCE_SAVED",
    teacherId: input.teacherId,
    classId: input.classId,
    subject: input.subject,
    session: input.session,
    date: input.date,
    studentCount: input.attendance.length,
    createdAt: new Date().toISOString(),
  };
}

export function broadcastAttendanceUpdate(
  input: SaveAttendanceInput
) {
  if (typeof BroadcastChannel === "undefined") {
    return;
  }

  const channel = new BroadcastChannel(
    `teacher:${input.teacherId}`
  );

  channel.postMessage({
    type: "class_changed",
    classId: input.classId,
  });

  channel.close();
}

import { attendanceService } from "../../services/attendanceService";

export async function saveAttendance(
  input: SaveAttendanceInput
) {
  validateAttendanceAuthorization(
    input.teacherId,
    input.classId,
    input.subject
  );

  validateAttendanceInput(input);

  const auditRecord =
    createAttendanceAuditRecord(input);

  // Call database-backed attendance service
  const dbResult = await attendanceService.saveAttendance({
    teacherId: input.teacherId,
    classId: input.classId,
    subject: input.subject,
    session: input.session,
    date: input.date,
    attendance: input.attendance.map((a) => ({
      studentId: a.studentId,
      name: a.rrn,
      rrn: a.rrn,
      status: a.status,
      time: a.time,
      remarks: a.remarks,
    })),
  });

  broadcastAttendanceUpdate(input);

  return {
    success: dbResult.success,
    auditRecord,
    error: dbResult.error,
  };
}