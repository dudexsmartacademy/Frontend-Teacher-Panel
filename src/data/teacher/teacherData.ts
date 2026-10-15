export type TeacherProfile = {
  id: string;
  name: string;
  facultyId: string;
  department: string;
};

export type TeacherAssignment = {
  classId: string;
  className: string;
  subject: string;
  academicYear: string;
  active: boolean;
};

export const teacherProfile: TeacherProfile = {
  id: "teacher-001",
  name: "ABC",
  facultyId: "FAC001",
  department: "Computer Science & Engineering",
};

export const teacherAssignments: TeacherAssignment[] = [
  {
    classId: "1",
    className: "Batch 1",
    subject: "Python",
    academicYear: "2024–2028",
    active: true,
  },
  {
    classId: "2",
    className: "Batch 2",
    subject: "Data Structures",
    academicYear: "2024–2028",
    active: true,
  },
  {
    classId: "3",
    className: "Batch 3",
    subject: "Programming",
    academicYear: "2023–2027",
    active: true,
  },
];