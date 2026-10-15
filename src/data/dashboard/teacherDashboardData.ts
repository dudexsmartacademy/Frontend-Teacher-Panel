import {
  teacherProfile,
  teacherAssignments,
} from "../teacher/teacherData";

export const teacherDashboardData = {
  teacher: teacherProfile,

  assignedClasses: teacherAssignments.filter(
    (assignment) => assignment.active
  ),

  assignedSubjects: [
    ...new Set(
      teacherAssignments
        .filter((assignment) => assignment.active)
        .map((assignment) => assignment.subject)
    ),
  ],

  statistics: {
    assignedClasses: teacherAssignments.filter(
      (assignment) => assignment.active
    ).length,

    assignedStudents: 184,

    todaysClasses: 3,

    attendancePending: 1,

    activeAssessments: 2,

    averageClassPerformance: 78,

    studentsAtRisk: 8,
  },
};