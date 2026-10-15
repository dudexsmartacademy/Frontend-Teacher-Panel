export type TestType = "MCQ" | "Coding" | "HackerRank";

export interface StudentAssessmentRecord {
  id: string;
  testTitle: string;
  type: TestType;
  date: string;
  score: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  description: string;
  duration?: string;
  studentEnteredMarks: number;
  studentNotes?: string;
  resultScreenshotUrl: string;
  verificationStatus: "Verified" | "Pending Review" | "Flagged";
  submittedAt: string;
  timeSpent?: string;
  totalQuestions?: number;
  correctAnswers?: number;
}

export interface StudentResultSummary {
  id: string;
  studentId: string;
  student: string;
  rrn: string;
  rollNumber: string;
  batch: string; // "Batch 1" | "Batch 2" | "Batch 3" | "Batch 4"
  department: string;
  section: string;
  assessment: string;
  attempt: number;
  score: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  submittedAt: string;
  status: "Submitted" | "In Progress";
  cohortPlacementIndex: number;
  cohortPlacementGrade: string;
  highestSingleScore: string;
  evaluationsCompletedCount: number;
  completedAssessments: StudentAssessmentRecord[];
}

export function createScorecardSvg(
  testTitle: string,
  studentName: string,
  rrn: string,
  score: number,
  maxMarks: number,
  type: TestType,
  date: string,
  percentage: number
): string {
  const isPassed = percentage >= 50;
  const grade =
    percentage >= 90
      ? "A+"
      : percentage >= 80
      ? "A"
      : percentage >= 70
      ? "B+"
      : percentage >= 60
      ? "B"
      : percentage >= 50
      ? "C"
      : "F";

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="100%" height="100%">
      <defs>
        <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#059669"/>
          <stop offset="100%" stop-color="#10b981"/>
        </linearGradient>
        <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.08"/>
        </filter>
      </defs>

      <!-- Background -->
      <rect width="800" height="480" rx="16" fill="#f8fafc"/>
      <rect x="0" y="0" width="800" height="480" rx="16" fill="none" stroke="#e2e8f0" stroke-width="2"/>

      <!-- Header Bar -->
      <rect width="800" height="90" rx="16" fill="url(#headerGrad)"/>
      <rect y="74" width="800" height="16" fill="url(#headerGrad)"/>

      <!-- Platform Branding -->
      <circle cx="48" cy="45" r="20" fill="#3b82f6"/>
      <text x="48" y="52" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">D</text>
      <text x="80" y="42" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="bold" fill="#ffffff">DUDEX SMART ACADEMY</text>
      <text x="80" y="60" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" fill="#94a3b8">OFFICIAL ASSESSMENT SCORECARD</text>

      <rect x="640" y="30" width="120" height="30" rx="15" fill="#334155"/>
      <text x="700" y="50" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="#38bdf8" text-anchor="middle">${type.toUpperCase()}</text>

      <!-- Content Container -->
      <g transform="translate(40, 115)">
        <!-- Test Info Card -->
        <rect width="720" height="130" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" filter="url(#shadow)"/>
        
        <text x="24" y="36" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="bold" fill="#0f172a">${testTitle}</text>
        
        <text x="24" y="68" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" fill="#64748b">Student Candidate:</text>
        <text x="160" y="68" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#1e293b">${studentName}</text>

        <text x="24" y="96" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" fill="#64748b">Registration (RRN):</text>
        <text x="160" y="96" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#1e293b">${rrn}</text>

        <text x="440" y="68" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" fill="#64748b">Date Completed:</text>
        <text x="560" y="68" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#1e293b">${date}</text>

        <text x="440" y="96" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" fill="#64748b">Result Status:</text>
        <text x="560" y="96" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="${isPassed ? '#16a34a' : '#dc2626'}">${isPassed ? 'PASSED & COMPLETED' : 'FAILED'}</text>

        <!-- Stats Breakdown Row -->
        <g transform="translate(0, 150)">
          <!-- Score Box -->
          <rect width="225" height="150" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
          <text x="24" y="35" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="#64748b">TOTAL SCORE</text>
          <text x="24" y="85" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="36" font-weight="800" fill="#0f172a">${score}<tspan font-size="20" font-weight="500" fill="#94a3b8"> / ${maxMarks}</tspan></text>
          <text x="24" y="122" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" fill="#16a34a">✓ Verified Self-Entry</text>

          <!-- Percentage Box -->
          <rect x="248" width="225" height="150" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
          <text x="272" y="35" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="#64748b">PERCENTAGE</text>
          <text x="272" y="85" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="36" font-weight="800" fill="#b45309">${percentage.toFixed(0)}%</text>
          <text x="272" y="122" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" fill="#64748b">Benchmark Score</text>

          <!-- Grade Box -->
          <rect x="495" width="225" height="150" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
          <text x="519" y="35" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="600" fill="#64748b">FINAL GRADE</text>
          <text x="519" y="85" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="36" font-weight="800" fill="#2563eb">${grade}</text>
          <text x="519" y="122" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" fill="#2563eb">Distinction Tier</text>
        </g>
      </g>

      <!-- Watermark / Footer -->
      <text x="400" y="460" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" fill="#94a3b8" text-anchor="middle">Generated & Authenticated by Dudex Examination Portal • System ID: DDX-${score * 123 + 456}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

export const initialStudentResultsData: StudentResultSummary[] = [
  {
    id: "1",
    studentId: "1",
    student: "Arun Kumar",
    rrn: "RRN001",
    rollNumber: "24AI001",
    batch: "Batch 1",
    department: "AI & DS",
    section: "Section B",
    assessment: "Python Fundamentals Assessment",
    attempt: 1,
    score: 26,
    totalMarks: 30,
    percentage: 86.67,
    grade: "A",
    submittedAt: "2026-09-10 10:25 AM",
    status: "Submitted",
    cohortPlacementIndex: 84.6,
    cohortPlacementGrade: "Grade A (Distinction Tier)",
    highestSingleScore: "90% · Python",
    evaluationsCompletedCount: 8,
    completedAssessments: [
      {
        id: "test-101",
        testTitle: "Python Basics & Control Flow",
        type: "MCQ",
        date: "02 Sep 2026",
        score: 18,
        maxMarks: 20,
        percentage: 90,
        grade: "A+",
        description: "Variables, primitive data types, conditional branching (if-elif-else), loops, and break/continue statements.",
        duration: "30 Minutes",
        studentEnteredMarks: 18,
        studentNotes: "Completed test with 18/20. Verified screenshot of the assessment submission screen attached.",
        resultScreenshotUrl: createScorecardSvg("Python Basics & Control Flow", "Arun Kumar", "RRN001", 18, 20, "MCQ", "02 Sep 2026", 90),
        verificationStatus: "Verified",
        submittedAt: "02 Sep 2026 10:28 AM",
        timeSpent: "22 mins",
        totalQuestions: 20,
        correctAnswers: 18,
      },
      {
        id: "test-102",
        testTitle: "SQL Foundations: Tables & Joins",
        type: "MCQ",
        date: "28 Aug 2026",
        score: 42,
        maxMarks: 50,
        percentage: 84,
        grade: "A",
        description: "Schema architecture, primary/foreign keys, INNER & OUTER JOINs, GROUP BY aggregations, and subqueries.",
        duration: "45 Minutes",
        studentEnteredMarks: 42,
        studentNotes: "Self-entered 42/50. Attaching final SQL submission summary scorecard.",
        resultScreenshotUrl: createScorecardSvg("SQL Foundations: Tables & Joins", "Arun Kumar", "RRN001", 42, 50, "MCQ", "28 Aug 2026", 84),
        verificationStatus: "Verified",
        submittedAt: "28 Aug 2026 11:40 AM",
        timeSpent: "38 mins",
        totalQuestions: 50,
        correctAnswers: 42,
      },
      {
        id: "test-103",
        testTitle: "Loops, Logic & Fast Pointers",
        type: "Coding",
        date: "20 Aug 2026",
        score: 88,
        maxMarks: 100,
        percentage: 88,
        grade: "A",
        description: "Algorithmic problem-solving using two-pointer patterns, string sliding window, and nested loop optimizations.",
        duration: "60 Minutes",
        studentEnteredMarks: 88,
        studentNotes: "Passed 9 out of 10 test cases on the online judge. Code passed all basic constraints.",
        resultScreenshotUrl: createScorecardSvg("Loops, Logic & Fast Pointers", "Arun Kumar", "RRN001", 88, 100, "Coding", "20 Aug 2026", 88),
        verificationStatus: "Verified",
        submittedAt: "20 Aug 2026 03:15 PM",
        timeSpent: "52 mins",
        totalQuestions: 5,
        correctAnswers: 4,
      },
      {
        id: "test-104",
        testTitle: "Data Types, Immutability & Scope",
        type: "MCQ",
        date: "12 Aug 2026",
        score: 17,
        maxMarks: 20,
        percentage: 85,
        grade: "A",
        description: "Deep dive into memory references, tuple immutability, dictionary hashing, and variable namespaces.",
        duration: "25 Minutes",
        studentEnteredMarks: 17,
        studentNotes: "17/20 scored. Scorecard screenshot captured immediately upon completion.",
        resultScreenshotUrl: createScorecardSvg("Data Types, Immutability & Scope", "Arun Kumar", "RRN001", 17, 20, "MCQ", "12 Aug 2026", 85),
        verificationStatus: "Verified",
        submittedAt: "12 Aug 2026 09:30 AM",
        timeSpent: "19 mins",
        totalQuestions: 20,
        correctAnswers: 17,
      },
      {
        id: "test-105",
        testTitle: "Functions, Closures & Recursion",
        type: "MCQ",
        date: "05 Aug 2026",
        score: 27,
        maxMarks: 30,
        percentage: 90,
        grade: "A+",
        description: "First-class functions, higher-order functions, lambda expressions, lexical closures, and recursion tree depth.",
        duration: "35 Minutes",
        studentEnteredMarks: 27,
        studentNotes: "Entered 27 marks. All recursion trace questions answered correctly.",
        resultScreenshotUrl: createScorecardSvg("Functions, Closures & Recursion", "Arun Kumar", "RRN001", 27, 30, "MCQ", "05 Aug 2026", 90),
        verificationStatus: "Verified",
        submittedAt: "05 Aug 2026 02:20 PM",
        timeSpent: "28 mins",
        totalQuestions: 30,
        correctAnswers: 27,
      },
      {
        id: "test-106",
        testTitle: "HackerRank Array Manipulation",
        type: "HackerRank",
        date: "28 Jul 2026",
        score: 45,
        maxMarks: 50,
        percentage: 90,
        grade: "A+",
        description: "Prefix sum algorithms, array transformations, and large dataset constraint optimization on HackerRank.",
        duration: "45 Minutes",
        studentEnteredMarks: 45,
        studentNotes: "HackerRank submission verified. All hidden test cases passed except one corner edge case.",
        resultScreenshotUrl: createScorecardSvg("HackerRank Array Manipulation", "Arun Kumar", "RRN001", 45, 50, "HackerRank", "28 Jul 2026", 90),
        verificationStatus: "Verified",
        submittedAt: "28 Jul 2026 04:45 PM",
        timeSpent: "40 mins",
        totalQuestions: 2,
        correctAnswers: 2,
      },
      {
        id: "test-107",
        testTitle: "Object-Oriented Design & Polymorphism",
        type: "MCQ",
        date: "20 Jul 2026",
        score: 36,
        maxMarks: 40,
        percentage: 90,
        grade: "A+",
        description: "Class hierarchies, inheritance, method overriding, encapsulation, and abstract base classes.",
        duration: "40 Minutes",
        studentEnteredMarks: 36,
        studentNotes: "Uploaded exam scorecard screenshot with 36/40.",
        resultScreenshotUrl: createScorecardSvg("Object-Oriented Design & Polymorphism", "Arun Kumar", "RRN001", 36, 40, "MCQ", "20 Jul 2026", 90),
        verificationStatus: "Verified",
        submittedAt: "20 Jul 2026 11:15 AM",
        timeSpent: "31 mins",
        totalQuestions: 40,
        correctAnswers: 36,
      },
      {
        id: "test-108",
        testTitle: "Dictionary, Sets & Hash Map Operations",
        type: "Coding",
        date: "14 Jul 2026",
        score: 40,
        maxMarks: 50,
        percentage: 80,
        grade: "A",
        description: "Hash collisions, set operations, dictionary comprehension, and frequency counter algorithms.",
        duration: "50 Minutes",
        studentEnteredMarks: 40,
        studentNotes: "Final coding challenge completed. Score 40/50 recorded.",
        resultScreenshotUrl: createScorecardSvg("Dictionary, Sets & Hash Map Operations", "Arun Kumar", "RRN001", 40, 50, "Coding", "14 Jul 2026", 80),
        verificationStatus: "Verified",
        submittedAt: "14 Jul 2026 10:00 AM",
        timeSpent: "42 mins",
        totalQuestions: 3,
        correctAnswers: 2,
      },
    ],
  },
  {
    id: "2",
    studentId: "2",
    student: "Priya Sharma",
    rrn: "RRN002",
    rollNumber: "24AI002",
    batch: "Batch 1",
    department: "AI & DS",
    section: "Section B",
    assessment: "Python Fundamentals Assessment",
    attempt: 1,
    score: 24,
    totalMarks: 30,
    percentage: 80,
    grade: "A",
    submittedAt: "2026-09-10 10:28 AM",
    status: "Submitted",
    cohortPlacementIndex: 82.5,
    cohortPlacementGrade: "Grade A (High Distinction)",
    highestSingleScore: "92% · SQL",
    evaluationsCompletedCount: 7,
    completedAssessments: [
      {
        id: "test-201",
        testTitle: "Python Basics & Control Flow",
        type: "MCQ",
        date: "02 Sep 2026",
        score: 17,
        maxMarks: 20,
        percentage: 85,
        grade: "A",
        description: "Variables, primitive data types, conditionals and loops.",
        duration: "30 Minutes",
        studentEnteredMarks: 17,
        studentNotes: "Uploaded results screenshot with 17/20.",
        resultScreenshotUrl: createScorecardSvg("Python Basics & Control Flow", "Priya Sharma", "RRN002", 17, 20, "MCQ", "02 Sep 2026", 85),
        verificationStatus: "Verified",
        submittedAt: "02 Sep 2026 10:29 AM",
      },
      {
        id: "test-202",
        testTitle: "SQL Foundations: Tables & Joins",
        type: "MCQ",
        date: "28 Aug 2026",
        score: 46,
        maxMarks: 50,
        percentage: 92,
        grade: "A+",
        description: "Schema design, joins, grouping and aggregations.",
        duration: "45 Minutes",
        studentEnteredMarks: 46,
        studentNotes: "Scored 46 out of 50. Screenshot attached.",
        resultScreenshotUrl: createScorecardSvg("SQL Foundations: Tables & Joins", "Priya Sharma", "RRN002", 46, 50, "MCQ", "28 Aug 2026", 92),
        verificationStatus: "Verified",
        submittedAt: "28 Aug 2026 11:35 AM",
      },
      {
        id: "test-203",
        testTitle: "Loops, Logic & Fast Pointers",
        type: "Coding",
        date: "20 Aug 2026",
        score: 80,
        maxMarks: 100,
        percentage: 80,
        grade: "A",
        description: "Two pointer techniques and array iterations.",
        duration: "60 Minutes",
        studentEnteredMarks: 80,
        studentNotes: "Submitted coding tasks successfully.",
        resultScreenshotUrl: createScorecardSvg("Loops, Logic & Fast Pointers", "Priya Sharma", "RRN002", 80, 100, "Coding", "20 Aug 2026", 80),
        verificationStatus: "Verified",
        submittedAt: "20 Aug 2026 03:20 PM",
      },
      {
        id: "test-204",
        testTitle: "Data Types, Immutability & Scope",
        type: "MCQ",
        date: "12 Aug 2026",
        score: 16,
        maxMarks: 20,
        percentage: 80,
        grade: "A",
        description: "Variable scoping and data types.",
        duration: "25 Minutes",
        studentEnteredMarks: 16,
        studentNotes: "Uploaded results screenshot.",
        resultScreenshotUrl: createScorecardSvg("Data Types, Immutability & Scope", "Priya Sharma", "RRN002", 16, 20, "MCQ", "12 Aug 2026", 80),
        verificationStatus: "Verified",
        submittedAt: "12 Aug 2026 09:32 AM",
      },
    ],
  },
  {
    id: "3",
    studentId: "3",
    student: "Rahul Raj",
    rrn: "RRN003",
    rollNumber: "24AI003",
    batch: "Batch 1",
    department: "AI & DS",
    section: "Section B",
    assessment: "Python Fundamentals Assessment",
    attempt: 1,
    score: 18,
    totalMarks: 30,
    percentage: 60,
    grade: "B",
    submittedAt: "2026-09-10 10:30 AM",
    status: "Submitted",
    cohortPlacementIndex: 65.2,
    cohortPlacementGrade: "Grade B (Standard Tier)",
    highestSingleScore: "75% · SQL",
    evaluationsCompletedCount: 5,
    completedAssessments: [
      {
        id: "test-301",
        testTitle: "Python Basics & Control Flow",
        type: "MCQ",
        date: "02 Sep 2026",
        score: 13,
        maxMarks: 20,
        percentage: 65,
        grade: "B",
        description: "Control flow and conditionals in Python.",
        duration: "30 Minutes",
        studentEnteredMarks: 13,
        studentNotes: "Entered 13/20. Scorecard attached.",
        resultScreenshotUrl: createScorecardSvg("Python Basics & Control Flow", "Rahul Raj", "RRN003", 13, 20, "MCQ", "02 Sep 2026", 65),
        verificationStatus: "Verified",
        submittedAt: "02 Sep 2026 10:30 AM",
      },
      {
        id: "test-302",
        testTitle: "SQL Foundations: Tables & Joins",
        type: "MCQ",
        date: "28 Aug 2026",
        score: 38,
        maxMarks: 50,
        percentage: 76,
        grade: "B+",
        description: "Basic SQL queries and table relationships.",
        duration: "45 Minutes",
        studentEnteredMarks: 38,
        studentNotes: "Submitted SQL test scorecard.",
        resultScreenshotUrl: createScorecardSvg("SQL Foundations: Tables & Joins", "Rahul Raj", "RRN003", 38, 50, "MCQ", "28 Aug 2026", 76),
        verificationStatus: "Verified",
        submittedAt: "28 Aug 2026 11:42 AM",
      },
      {
        id: "test-303",
        testTitle: "Data Types, Immutability & Scope",
        type: "MCQ",
        date: "12 Aug 2026",
        score: 12,
        maxMarks: 20,
        percentage: 60,
        grade: "B",
        description: "Fundamental data types in Python.",
        duration: "25 Minutes",
        studentEnteredMarks: 12,
        studentNotes: "Uploaded results screenshot.",
        resultScreenshotUrl: createScorecardSvg("Data Types, Immutability & Scope", "Rahul Raj", "RRN003", 12, 20, "MCQ", "12 Aug 2026", 60),
        verificationStatus: "Verified",
        submittedAt: "12 Aug 2026 09:35 AM",
      },
    ],
  },
  {
    id: "4",
    studentId: "4",
    student: "Sneha Joseph",
    rrn: "RRN004",
    rollNumber: "24AI004",
    batch: "Batch 1",
    department: "AI & DS",
    section: "Section B",
    assessment: "Python Fundamentals Assessment",
    attempt: 1,
    score: 12,
    totalMarks: 30,
    percentage: 40,
    grade: "D",
    submittedAt: "2026-09-10 10:30 AM",
    status: "Submitted",
    cohortPlacementIndex: 48.0,
    cohortPlacementGrade: "Grade D (Needs Improvement)",
    highestSingleScore: "55% · Loops",
    evaluationsCompletedCount: 4,
    completedAssessments: [
      {
        id: "test-401",
        testTitle: "Python Basics & Control Flow",
        type: "MCQ",
        date: "02 Sep 2026",
        score: 9,
        maxMarks: 20,
        percentage: 45,
        grade: "D",
        description: "Python syntax basics and control flow.",
        duration: "30 Minutes",
        studentEnteredMarks: 9,
        studentNotes: "Self-entered 9/20. Scorecard attached.",
        resultScreenshotUrl: createScorecardSvg("Python Basics & Control Flow", "Sneha Joseph", "RRN004", 9, 20, "MCQ", "02 Sep 2026", 45),
        verificationStatus: "Verified",
        submittedAt: "02 Sep 2026 10:32 AM",
      },
      {
        id: "test-402",
        testTitle: "Loops, Logic & Fast Pointers",
        type: "Coding",
        date: "20 Aug 2026",
        score: 55,
        maxMarks: 100,
        percentage: 55,
        grade: "C",
        description: "Loop concepts and conditions.",
        duration: "60 Minutes",
        studentEnteredMarks: 55,
        studentNotes: "Submitted coding tasks.",
        resultScreenshotUrl: createScorecardSvg("Loops, Logic & Fast Pointers", "Sneha Joseph", "RRN004", 55, 100, "Coding", "20 Aug 2026", 55),
        verificationStatus: "Verified",
        submittedAt: "20 Aug 2026 03:25 PM",
      },
    ],
  },
  {
    id: "5",
    studentId: "5",
    student: "Vishal Kumar",
    rrn: "RRN005",
    rollNumber: "24AI005",
    batch: "Batch 2",
    department: "AI & DS",
    section: "Section A",
    assessment: "Python Fundamentals Assessment",
    attempt: 1,
    score: 22,
    totalMarks: 30,
    percentage: 73.33,
    grade: "B",
    submittedAt: "2026-09-10 10:27 AM",
    status: "Submitted",
    cohortPlacementIndex: 78.4,
    cohortPlacementGrade: "Grade B+ (Merit Tier)",
    highestSingleScore: "85% · Algorithms",
    evaluationsCompletedCount: 6,
    completedAssessments: [
      {
        id: "test-501",
        testTitle: "Python Basics & Control Flow",
        type: "MCQ",
        date: "02 Sep 2026",
        score: 15,
        maxMarks: 20,
        percentage: 75,
        grade: "B+",
        description: "Conditionals, operators and variable scoping.",
        duration: "30 Minutes",
        studentEnteredMarks: 15,
        studentNotes: "Submitted 15/20 with screenshot.",
        resultScreenshotUrl: createScorecardSvg("Python Basics & Control Flow", "Vishal Kumar", "RRN005", 15, 20, "MCQ", "02 Sep 2026", 75),
        verificationStatus: "Verified",
        submittedAt: "02 Sep 2026 10:28 AM",
      },
      {
        id: "test-502",
        testTitle: "SQL Foundations: Tables & Joins",
        type: "MCQ",
        date: "28 Aug 2026",
        score: 41,
        maxMarks: 50,
        percentage: 82,
        grade: "A",
        description: "Relational queries and table joins.",
        duration: "45 Minutes",
        studentEnteredMarks: 41,
        studentNotes: "Uploaded SQL exam scorecard.",
        resultScreenshotUrl: createScorecardSvg("SQL Foundations: Tables & Joins", "Vishal Kumar", "RRN005", 41, 50, "MCQ", "28 Aug 2026", 82),
        verificationStatus: "Verified",
        submittedAt: "28 Aug 2026 11:38 AM",
      },
      {
        id: "test-503",
        testTitle: "HackerRank Data Structures Challenge",
        type: "HackerRank",
        date: "20 Aug 2026",
        score: 85,
        maxMarks: 100,
        percentage: 85,
        grade: "A",
        description: "Array sorting and searching algorithms.",
        duration: "60 Minutes",
        studentEnteredMarks: 85,
        studentNotes: "Passed all test cases on HackerRank.",
        resultScreenshotUrl: createScorecardSvg("HackerRank Data Structures Challenge", "Vishal Kumar", "RRN005", 85, 100, "HackerRank", "20 Aug 2026", 85),
        verificationStatus: "Verified",
        submittedAt: "20 Aug 2026 03:10 PM",
      },
    ],
  },
  {
    id: "6",
    studentId: "6",
    student: "Meena Devi",
    rrn: "RRN006",
    rollNumber: "24AI006",
    batch: "Batch 2",
    department: "AI & DS",
    section: "Section A",
    assessment: "Python Fundamentals Assessment",
    attempt: 1,
    score: 20,
    totalMarks: 30,
    percentage: 66.67,
    grade: "B",
    submittedAt: "2026-09-10 10:29 AM",
    status: "Submitted",
    cohortPlacementIndex: 71.0,
    cohortPlacementGrade: "Grade B (Standard Tier)",
    highestSingleScore: "80% · Python",
    evaluationsCompletedCount: 5,
    completedAssessments: [
      {
        id: "test-601",
        testTitle: "Python Basics & Control Flow",
        type: "MCQ",
        date: "02 Sep 2026",
        score: 14,
        maxMarks: 20,
        percentage: 70,
        grade: "B",
        description: "Variables and conditionals.",
        duration: "30 Minutes",
        studentEnteredMarks: 14,
        studentNotes: "Entered 14/20.",
        resultScreenshotUrl: createScorecardSvg("Python Basics & Control Flow", "Meena Devi", "RRN006", 14, 20, "MCQ", "02 Sep 2026", 70),
        verificationStatus: "Verified",
        submittedAt: "02 Sep 2026 10:30 AM",
      },
      {
        id: "test-602",
        testTitle: "SQL Foundations: Tables & Joins",
        type: "MCQ",
        date: "28 Aug 2026",
        score: 36,
        maxMarks: 50,
        percentage: 72,
        grade: "B+",
        description: "SQL joins and groupings.",
        duration: "45 Minutes",
        studentEnteredMarks: 36,
        studentNotes: "Screenshot attached.",
        resultScreenshotUrl: createScorecardSvg("SQL Foundations: Tables & Joins", "Meena Devi", "RRN006", 36, 50, "MCQ", "28 Aug 2026", 72),
        verificationStatus: "Verified",
        submittedAt: "28 Aug 2026 11:41 AM",
      },
    ],
  },
  {
    id: "7",
    studentId: "7",
    student: "Karthik Rajan",
    rrn: "RRN007",
    rollNumber: "24AI007",
    batch: "Batch 2",
    department: "AI & DS",
    section: "Section A",
    assessment: "Python Fundamentals Assessment",
    attempt: 1,
    score: 28,
    totalMarks: 30,
    percentage: 93.33,
    grade: "A+",
    submittedAt: "2026-09-10 10:24 AM",
    status: "Submitted",
    cohortPlacementIndex: 91.2,
    cohortPlacementGrade: "Grade A+ (Distinction Tier)",
    highestSingleScore: "96% · Coding",
    evaluationsCompletedCount: 8,
    completedAssessments: [
      {
        id: "test-701",
        testTitle: "Python Basics & Control Flow",
        type: "MCQ",
        date: "02 Sep 2026",
        score: 19,
        maxMarks: 20,
        percentage: 95,
        grade: "A+",
        description: "Language syntax and branching logic.",
        duration: "30 Minutes",
        studentEnteredMarks: 19,
        studentNotes: "Scorecard verified.",
        resultScreenshotUrl: createScorecardSvg("Python Basics & Control Flow", "Karthik Rajan", "RRN007", 19, 20, "MCQ", "02 Sep 2026", 95),
        verificationStatus: "Verified",
        submittedAt: "02 Sep 2026 10:26 AM",
      },
      {
        id: "test-702",
        testTitle: "Loops, Logic & Fast Pointers",
        type: "Coding",
        date: "20 Aug 2026",
        score: 96,
        maxMarks: 100,
        percentage: 96,
        grade: "A+",
        description: "Optimal algorithmic problem-solving.",
        duration: "60 Minutes",
        studentEnteredMarks: 96,
        studentNotes: "Passed 10/10 test cases.",
        resultScreenshotUrl: createScorecardSvg("Loops, Logic & Fast Pointers", "Karthik Rajan", "RRN007", 96, 100, "Coding", "20 Aug 2026", 96),
        verificationStatus: "Verified",
        submittedAt: "20 Aug 2026 03:05 PM",
      },
    ],
  },
  {
    id: "8",
    studentId: "8",
    student: "Ananya Iyer",
    rrn: "RRN008",
    rollNumber: "24AI008",
    batch: "Batch 3",
    department: "CSE",
    section: "Section A",
    assessment: "Python Fundamentals Assessment",
    attempt: 1,
    score: 25,
    totalMarks: 30,
    percentage: 83.33,
    grade: "A",
    submittedAt: "2026-09-10 10:26 AM",
    status: "Submitted",
    cohortPlacementIndex: 86.0,
    cohortPlacementGrade: "Grade A (Distinction Tier)",
    highestSingleScore: "92% · MCQ",
    evaluationsCompletedCount: 6,
    completedAssessments: [
      {
        id: "test-801",
        testTitle: "Python Basics & Control Flow",
        type: "MCQ",
        date: "02 Sep 2026",
        score: 18,
        maxMarks: 20,
        percentage: 90,
        grade: "A+",
        description: "Control flow and syntax structures.",
        duration: "30 Minutes",
        studentEnteredMarks: 18,
        studentNotes: "18/20 verified.",
        resultScreenshotUrl: createScorecardSvg("Python Basics & Control Flow", "Ananya Iyer", "RRN008", 18, 20, "MCQ", "02 Sep 2026", 90),
        verificationStatus: "Verified",
        submittedAt: "02 Sep 2026 10:27 AM",
      },
    ],
  },
  {
    id: "9",
    studentId: "9",
    student: "Rohit Verma",
    rrn: "RRN009",
    rollNumber: "23CSE011",
    batch: "Batch 3",
    department: "CSE",
    section: "Section A",
    assessment: "Python Fundamentals Assessment",
    attempt: 1,
    score: 21,
    totalMarks: 30,
    percentage: 70.0,
    grade: "B",
    submittedAt: "2026-09-10 10:31 AM",
    status: "Submitted",
    cohortPlacementIndex: 72.8,
    cohortPlacementGrade: "Grade B (Standard Tier)",
    highestSingleScore: "82% · Coding",
    evaluationsCompletedCount: 5,
    completedAssessments: [
      {
        id: "test-901",
        testTitle: "Python Basics & Control Flow",
        type: "MCQ",
        date: "02 Sep 2026",
        score: 15,
        maxMarks: 20,
        percentage: 75,
        grade: "B+",
        description: "Variables and conditionals.",
        duration: "30 Minutes",
        studentEnteredMarks: 15,
        studentNotes: "15/20 scored.",
        resultScreenshotUrl: createScorecardSvg("Python Basics & Control Flow", "Rohit Verma", "RRN009", 15, 20, "MCQ", "02 Sep 2026", 75),
        verificationStatus: "Verified",
        submittedAt: "02 Sep 2026 10:30 AM",
      },
    ],
  },
  {
    id: "10",
    studentId: "10",
    student: "Divya Krishnan",
    rrn: "RRN010",
    rollNumber: "23CSE014",
    batch: "Batch 4",
    department: "IT",
    section: "Section B",
    assessment: "Python Fundamentals Assessment",
    attempt: 1,
    score: 27,
    totalMarks: 30,
    percentage: 90.0,
    grade: "A+",
    submittedAt: "2026-09-10 10:23 AM",
    status: "Submitted",
    cohortPlacementIndex: 89.5,
    cohortPlacementGrade: "Grade A+ (Distinction Tier)",
    highestSingleScore: "94% · SQL",
    evaluationsCompletedCount: 7,
    completedAssessments: [
      {
        id: "test-1001",
        testTitle: "Python Basics & Control Flow",
        type: "MCQ",
        date: "02 Sep 2026",
        score: 19,
        maxMarks: 20,
        percentage: 95,
        grade: "A+",
        description: "Python flow and syntax logic.",
        duration: "30 Minutes",
        studentEnteredMarks: 19,
        studentNotes: "19/20 verified.",
        resultScreenshotUrl: createScorecardSvg("Python Basics & Control Flow", "Divya Krishnan", "RRN010", 19, 20, "MCQ", "02 Sep 2026", 95),
        verificationStatus: "Verified",
        submittedAt: "02 Sep 2026 10:25 AM",
      },
    ],
  },
];

const LOCAL_STORAGE_RESULTS_KEY = "dudex_teacher_results_data";

export function loadResultsDataFromStorage(): StudentResultSummary[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_RESULTS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to load results from storage", e);
  }
  return initialStudentResultsData;
}

export function saveResultsDataToStorage(data: StudentResultSummary[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_RESULTS_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save results to storage", e);
  }
}

export function getAssessmentSubmissions(
  assessmentTitle: string,
  batchFilter: string = "All"
): StudentResultSummary[] {
  const currentData = loadResultsDataFromStorage();
  const directMatches = currentData.filter((r) =>
    r.assessment.toLowerCase() === assessmentTitle.toLowerCase()
  );

  if (directMatches.length > 0) {
    return batchFilter === "All"
      ? directMatches
      : directMatches.filter((r) => r.batch === batchFilter);
  }

  // Generate realistic submissions for this assessment using enrolled students
  const studentPool = [
    { student: "Arun Kumar", rrn: "RRN001", roll: "24AI001", batch: "Batch 1", dept: "AI & DS", score: 26, max: 30, pct: 86.67, grade: "A" },
    { student: "Priya Sharma", rrn: "RRN002", roll: "24AI002", batch: "Batch 1", dept: "AI & DS", score: 24, max: 30, pct: 80.0, grade: "A" },
    { student: "Rahul Raj", rrn: "RRN003", roll: "24AI003", batch: "Batch 1", dept: "AI & DS", score: 18, max: 30, pct: 60.0, grade: "B" },
    { student: "Sneha Joseph", rrn: "RRN004", roll: "24AI004", batch: "Batch 1", dept: "AI & DS", score: 12, max: 30, pct: 40.0, grade: "D" },
    { student: "Vishal Kumar", rrn: "RRN005", roll: "24AI005", batch: "Batch 2", dept: "AI & DS", score: 22, max: 30, pct: 73.33, grade: "B" },
    { student: "Meena Devi", rrn: "RRN006", roll: "24AI006", batch: "Batch 2", dept: "AI & DS", score: 20, max: 30, pct: 66.67, grade: "B" },
    { student: "Karthik Rajan", rrn: "RRN007", roll: "24AI007", batch: "Batch 2", dept: "AI & DS", score: 28, max: 30, pct: 93.33, grade: "A+" },
    { student: "Ananya Iyer", rrn: "RRN008", roll: "24AI008", batch: "Batch 3", dept: "CSE", score: 25, max: 30, pct: 83.33, grade: "A" },
    { student: "Rohit Verma", rrn: "RRN009", roll: "23CSE011", batch: "Batch 3", dept: "CSE", score: 21, max: 30, pct: 70.0, grade: "B" },
    { student: "Divya Krishnan", rrn: "RRN010", roll: "23CSE014", batch: "Batch 4", dept: "IT", score: 27, max: 30, pct: 90.0, grade: "A+" },
  ];

  const isCoding =
    assessmentTitle.toLowerCase().includes("coding") ||
    assessmentTitle.toLowerCase().includes("hackerrank") ||
    assessmentTitle.toLowerCase().includes("dsa");
  const testType: TestType = isCoding ? "Coding" : "MCQ";

  const generated: StudentResultSummary[] = studentPool.map((s, idx) => {
    const studentTestRecord: StudentAssessmentRecord = {
      id: `gen-test-${idx + 1}`,
      testTitle: assessmentTitle,
      type: testType,
      date: "28 Sep 2026",
      score: s.score,
      maxMarks: s.max,
      percentage: s.pct,
      grade: s.grade,
      description: `Evaluation for ${assessmentTitle}. Comprehensive assessment questions and student code/score evaluation.`,
      duration: "45 Minutes",
      studentEnteredMarks: s.score,
      studentNotes: `Completed ${assessmentTitle} test. Self-entered score: ${s.score}/${s.max}. Uploaded scorecard screenshot attached for verification.`,
      resultScreenshotUrl: createScorecardSvg(
        assessmentTitle,
        s.student,
        s.rrn,
        s.score,
        s.max,
        testType,
        "28 Sep 2026",
        s.pct
      ),
      verificationStatus: "Verified",
      submittedAt: `2026-09-28 10:${20 + idx} AM`,
    };

    return {
      id: `gen-${idx + 1}`,
      studentId: String(idx + 1),
      student: s.student,
      rrn: s.rrn,
      rollNumber: s.roll,
      batch: s.batch,
      department: s.dept,
      section: "Section A",
      assessment: assessmentTitle,
      attempt: 1,
      score: s.score,
      totalMarks: s.max,
      percentage: s.pct,
      grade: s.grade,
      submittedAt: `2026-09-28 10:${20 + idx} AM`,
      status: "Submitted",
      cohortPlacementIndex: s.pct,
      cohortPlacementGrade: `Grade ${s.grade} (Verified)`,
      highestSingleScore: `${s.pct.toFixed(0)}% · ${assessmentTitle.split(" ")[0]}`,
      evaluationsCompletedCount: 6,
      completedAssessments: [studentTestRecord],
    };
  });

  return batchFilter === "All"
    ? generated
    : generated.filter((r) => r.batch === batchFilter);
}

