import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type {
  MCQAssessment,
  MCQAssessmentDraft,
  MCQClassInfo,
  MCQQuestion,
} from '../types/mcqAssessment';

const STORAGE_KEY = 'dudex_mcq_assessments';
const DRAFT_STORAGE_KEY = 'dudex_mcq_assessment_draft';

export const INITIAL_CLASSES: MCQClassInfo[] = [
  {
    classId: 'all-batches',
    className: 'All Batches',
    college: 'ABC College of Engineering & Technology',
    department: 'All Departments',
    specialization: 'All Enrolled Batches (Batch 1 - 4)',
    batch: 'All Batches',
    section: 'All Batches',
  },
  {
    classId: 'class-1',
    className: 'Batch 1',
    college: 'ABC College of Engineering & Technology',
    department: 'AI & DS',
    specialization: 'Artificial Intelligence & Data Science',
    batch: 'Batch 1',
    section: 'Batch 1',
  },
  {
    classId: 'class-2',
    className: 'Batch 2',
    college: 'ABC College of Engineering & Technology',
    department: 'AI & DS',
    specialization: 'Artificial Intelligence & Data Science',
    batch: 'Batch 2',
    section: 'Batch 2',
  },
  {
    classId: 'class-3',
    className: 'Batch 3',
    college: 'ABC College of Engineering & Technology',
    department: 'Computer Science',
    specialization: 'Computer Science & Engineering',
    batch: 'Batch 3',
    section: 'Batch 3',
  },
  {
    classId: 'class-4',
    className: 'Batch 4',
    college: 'ABC College of Engineering & Technology',
    department: 'Information Technology',
    specialization: 'Information Technology',
    batch: 'Batch 4',
    section: 'Batch 4',
  },
];

export const INITIAL_SUBJECTS = [
  { id: 'sub-1', name: 'Python Fundamentals' },
  { id: 'sub-2', name: 'Data Structures & Algorithms' },
  { id: 'sub-3', name: 'Database Management Systems' },
  { id: 'sub-4', name: 'Artificial Intelligence' },
  { id: 'sub-5', name: 'Web Development Technologies' },
];

const sampleQuestionsPython: MCQQuestion[] = [
  {
    id: 'q-1',
    order: 1,
    questionText: 'What is Python?',
    options: [
      { id: 'opt-1-a', optionKey: 'A', text: 'Programming Language' },
      { id: 'opt-1-b', optionKey: 'B', text: 'Operating System' },
      { id: 'opt-1-c', optionKey: 'C', text: 'Database Engine' },
      { id: 'opt-1-d', optionKey: 'D', text: 'Web Browser' },
    ],
    correctOptionId: 'opt-1-a',
    marks: 1,
    explanation: 'Python is a high-level, interpreted, general-purpose programming language designed by Guido van Rossum.',
  },
  {
    id: 'q-2',
    order: 2,
    questionText: 'Which data structure follows the LIFO (Last In, First Out) principle in Python?',
    options: [
      { id: 'opt-2-a', optionKey: 'A', text: 'Queue' },
      { id: 'opt-2-b', optionKey: 'B', text: 'Stack' },
      { id: 'opt-2-c', optionKey: 'C', text: 'Array' },
      { id: 'opt-2-d', optionKey: 'D', text: 'Graph' },
    ],
    correctOptionId: 'opt-2-b',
    marks: 2,
    explanation: 'A stack operates on the Last In First Out (LIFO) principle, where the last added element is removed first.',
  },
  {
    id: 'q-3',
    order: 3,
    questionText: 'Which of the following data types in Python is immutable?',
    options: [
      { id: 'opt-3-a', optionKey: 'A', text: 'List' },
      { id: 'opt-3-b', optionKey: 'B', text: 'Dictionary' },
      { id: 'opt-3-c', optionKey: 'C', text: 'Tuple' },
      { id: 'opt-3-d', optionKey: 'D', text: 'Set' },
    ],
    correctOptionId: 'opt-3-c',
    marks: 1,
    explanation: 'Tuples in Python cannot be modified, resized, or updated after creation, making them immutable.',
  },
  {
    id: 'q-4',
    order: 4,
    questionText: 'What is the output of bool([]) in Python?',
    options: [
      { id: 'opt-4-a', optionKey: 'A', text: 'True' },
      { id: 'opt-4-b', optionKey: 'B', text: 'False' },
      { id: 'opt-4-c', optionKey: 'C', text: 'TypeError' },
      { id: 'opt-4-d', optionKey: 'D', text: 'None' },
    ],
    correctOptionId: 'opt-4-b',
    marks: 1,
    explanation: 'Empty sequences such as empty lists, tuples, or strings evaluate to False in boolean context.',
  },
  {
    id: 'q-5',
    order: 5,
    questionText: 'Which keyword is used to define an anonymous / inline function in Python?',
    options: [
      { id: 'opt-5-a', optionKey: 'A', text: 'def' },
      { id: 'opt-5-b', optionKey: 'B', text: 'func' },
      { id: 'opt-5-c', optionKey: 'C', text: 'lambda' },
      { id: 'opt-5-d', optionKey: 'D', text: 'inline' },
    ],
    correctOptionId: 'opt-5-c',
    marks: 1,
    explanation: 'The lambda keyword is used to create small anonymous functions without a formal name.',
  },
];

const initialAssessments: MCQAssessment[] = [
  {
    id: 'mcq-1',
    title: 'Python Fundamentals Assessment',
    description: 'Comprehensive assessment evaluating core Python syntax, immutable structures, and basic algorithms for semester 2.',
    classInfo: INITIAL_CLASSES[0],
    subjectId: 'sub-1',
    subjectName: 'Python Fundamentals',
    questions: sampleQuestionsPython,
    schedule: {
      date: '2026-09-28',
      startTime: '10:00 AM',
      endTime: '10:30 AM',
      durationMinutes: 30,
      timezone: 'Asia/Kolkata (IST)',
    },
    status: 'Scheduled',
    createdAt: '2026-09-15T09:00:00Z',
    updatedAt: '2026-09-17T11:30:00Z',
  },
  {
    id: 'mcq-2',
    title: 'Data Structures Trees & Graphs Evaluation',
    description: 'Mid-term assessment covering binary search trees, graph traversals, and complexity analysis.',
    classInfo: INITIAL_CLASSES[1],
    subjectId: 'sub-2',
    subjectName: 'Data Structures & Algorithms',
    questions: [
      {
        id: 'ds-1',
        order: 1,
        questionText: 'Which traversal of a Binary Search Tree (BST) produces sorted ascending order output?',
        options: [
          { id: 'ds-opt-1-a', optionKey: 'A', text: 'Pre-order Traversal' },
          { id: 'ds-opt-1-b', optionKey: 'B', text: 'In-order Traversal' },
          { id: 'ds-opt-1-c', optionKey: 'C', text: 'Post-order Traversal' },
          { id: 'ds-opt-1-d', optionKey: 'D', text: 'Level-order Traversal' },
        ],
        correctOptionId: 'ds-opt-1-b',
        marks: 2,
        explanation: 'In-order traversal visits nodes in (Left, Root, Right) order, which always produces ascending values in a valid BST.',
      },
      {
        id: 'ds-2',
        order: 2,
        questionText: 'What is the worst-case time complexity of searching in an unbalanced Binary Search Tree?',
        options: [
          { id: 'ds-opt-2-a', optionKey: 'A', text: 'O(1)' },
          { id: 'ds-opt-2-b', optionKey: 'B', text: 'O(log n)' },
          { id: 'ds-opt-2-c', optionKey: 'C', text: 'O(n)' },
          { id: 'ds-opt-2-d', optionKey: 'D', text: 'O(n log n)' },
        ],
        correctOptionId: 'ds-opt-2-c',
        marks: 2,
        explanation: 'In a skewed BST (degenerated into a linked list), searching requires visiting all n nodes in the worst case.',
      },
      {
        id: 'ds-3',
        order: 3,
        questionText: 'Which algorithm is typically used to find the shortest path in an unweighted graph?',
        options: [
          { id: 'ds-opt-3-a', optionKey: 'A', text: 'Depth First Search (DFS)' },
          { id: 'ds-opt-3-b', optionKey: 'B', text: 'Breadth First Search (BFS)' },
          { id: 'ds-opt-3-c', optionKey: 'C', text: 'Prim Algorithm' },
          { id: 'ds-opt-3-d', optionKey: 'D', text: 'Kruskal Algorithm' },
        ],
        correctOptionId: 'ds-opt-3-b',
        marks: 2,
        explanation: 'BFS explores nodes layer by layer, guaranteeing the shortest path in unweighted graphs.',
      },
    ],
    schedule: {
      date: '2026-09-18',
      startTime: '09:00 AM',
      endTime: '10:00 AM',
      durationMinutes: 45,
      timezone: 'Asia/Kolkata (IST)',
    },
    status: 'Active',
    createdAt: '2026-09-10T08:00:00Z',
    updatedAt: '2026-09-18T08:00:00Z',
  },
  {
    id: 'mcq-3',
    title: 'Relational Database Design & SQL Quiz',
    description: 'Faculty diagnostic test covering 3NF normalization, foreign key constraints, and JOIN operations.',
    classInfo: INITIAL_CLASSES[2],
    subjectId: 'sub-3',
    subjectName: 'Database Management Systems',
    questions: [
      {
        id: 'db-1',
        order: 1,
        questionText: 'Which normal form eliminates transitive functional dependencies?',
        options: [
          { id: 'db-opt-1-a', optionKey: 'A', text: '1NF' },
          { id: 'db-opt-1-b', optionKey: 'B', text: '2NF' },
          { id: 'db-opt-1-c', optionKey: 'C', text: '3NF' },
          { id: 'db-opt-1-d', optionKey: 'D', text: 'BCNF' },
        ],
        correctOptionId: 'db-opt-1-c',
        marks: 1,
        explanation: 'Third Normal Form (3NF) requires 2NF compliance and ensures that non-prime attributes are not transitively dependent on the primary key.',
      },
    ],
    schedule: {
      date: '2026-09-02',
      startTime: '02:00 PM',
      endTime: '02:45 PM',
      durationMinutes: 45,
      timezone: 'Asia/Kolkata (IST)',
    },
    status: 'Completed',
    createdAt: '2026-08-25T10:00:00Z',
    updatedAt: '2026-09-02T15:00:00Z',
  },
  {
    id: 'mcq-4',
    title: 'Machine Learning Concepts & Math',
    description: 'Draft quiz covering gradient descent, loss functions, and bias-variance tradeoff.',
    classInfo: INITIAL_CLASSES[0],
    subjectId: 'sub-4',
    subjectName: 'Artificial Intelligence',
    questions: [
      {
        id: 'ml-1',
        order: 1,
        questionText: 'What problem occurs when a model performs extremely well on training data but poorly on test data?',
        options: [
          { id: 'ml-opt-1-a', optionKey: 'A', text: 'Underfitting' },
          { id: 'ml-opt-1-b', optionKey: 'B', text: 'Overfitting' },
          { id: 'ml-opt-1-c', optionKey: 'C', text: 'Convergence' },
          { id: 'ml-opt-1-d', optionKey: 'D', text: 'Zero Variance' },
        ],
        correctOptionId: 'ml-opt-1-b',
        marks: 1,
        explanation: 'Overfitting happens when a model learns noise in training data and fails to generalize to unseen test data.',
      },
    ],
    schedule: {
      date: '2026-10-05',
      startTime: '11:00 AM',
      endTime: '11:45 AM',
      durationMinutes: 45,
      timezone: 'Asia/Kolkata (IST)',
    },
    status: 'Draft',
    createdAt: '2026-09-17T14:20:00Z',
    updatedAt: '2026-09-17T14:20:00Z',
  },
];

function loadLocalAssessments(): MCQAssessment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialAssessments));
      return initialAssessments;
    }
    return JSON.parse(raw);
  } catch {
    return initialAssessments;
  }
}

function saveLocalAssessments(items: MCQAssessment[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save MCQ assessments to localStorage', e);
  }
}

export const mcqAssessmentService = {
  async getAssessments(filters?: {
    search?: string;
    classId?: string;
    subjectId?: string;
    status?: string;
    sortBy?: string;
  }): Promise<{ data: MCQAssessment[]; error: string | null }> {
    let list = loadLocalAssessments();

    // Exclude archived by default unless specifically asked for Archived status
    if (filters?.status && filters.status !== 'All') {
      list = list.filter((a) => a.status.toLowerCase() === filters.status?.toLowerCase());
    } else {
      list = list.filter((a) => a.status !== 'Archived');
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.subjectName.toLowerCase().includes(q) ||
          a.classInfo.className.toLowerCase().includes(q) ||
          a.classInfo.department.toLowerCase().includes(q)
      );
    }

    if (filters?.classId && filters.classId !== 'All') {
      list = list.filter((a) => a.classInfo.classId === filters.classId);
    }

    if (filters?.subjectId && filters.subjectId !== 'All') {
      list = list.filter((a) => a.subjectId === filters.subjectId);
    }

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'Newest':
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'Oldest':
          list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          break;
        case 'Upcoming':
          list.sort((a, b) => new Date(a.schedule.date).getTime() - new Date(b.schedule.date).getTime());
          break;
        case 'Recently Updated':
          list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
          break;
        default:
          break;
      }
    }

    return { data: list, error: null };
  },

  async getAssessmentById(id: string): Promise<{ data: MCQAssessment | null; error: string | null }> {
    const list = loadLocalAssessments();
    const item = list.find((a) => a.id === id);
    if (!item) {
      return { data: null, error: 'Assessment not found' };
    }
    return { data: item, error: null };
  },

  async createAssessment(payload: Omit<MCQAssessment, 'id' | 'createdAt' | 'updatedAt'>): Promise<{
    data: MCQAssessment | null;
    error: string | null;
  }> {
    const list = loadLocalAssessments();
    const now = new Date().toISOString();
    const newAssessment: MCQAssessment = {
      ...payload,
      id: `mcq-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };

    list.unshift(newAssessment);
    saveLocalAssessments(list);

    // Optional Supabase sync
    if (isSupabaseConfigured) {
      try {
        const { data: teacherProf } = await (supabase
          .from('teacher_profiles')
          .select('id')
          .limit(1)
          .single() as unknown as Promise<{ data: { id: string } | null; error: Error | null }>);

        if (teacherProf) {
          const totalMarks = payload.questions.reduce((s, q) => s + (Number(q.marks) || 1), 0);
          await supabase.from('assessments').insert({
            created_by: teacherProf.id,
            title: payload.title,
            description: payload.description || null,
            class_id: payload.classInfo.classId,
            type: 'mcq',
            duration_seconds: payload.schedule.durationMinutes * 60,
            max_marks: totalMarks,
            pass_marks: Math.ceil(totalMarks * 0.4),
            status: payload.status.toLowerCase(),
          });
        }
      } catch (err) {
        console.warn('Supabase sync skipped, stored locally', err);
      }
    }

    return { data: newAssessment, error: null };
  },

  async updateAssessment(
    id: string,
    payload: Partial<Omit<MCQAssessment, 'id' | 'createdAt'>>
  ): Promise<{ data: MCQAssessment | null; error: string | null }> {
    const list = loadLocalAssessments();
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) {
      return { data: null, error: 'Assessment not found' };
    }

    const updated: MCQAssessment = {
      ...list[idx],
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    list[idx] = updated;
    saveLocalAssessments(list);
    return { data: updated, error: null };
  },

  async deleteAssessment(id: string, softArchive = true): Promise<{ success: boolean; error: string | null }> {
    const list = loadLocalAssessments();
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) {
      return { success: false, error: 'Assessment not found' };
    }

    if (softArchive) {
      list[idx].status = 'Archived';
      list[idx].updatedAt = new Date().toISOString();
    } else {
      list.splice(idx, 1);
    }

    saveLocalAssessments(list);
    return { success: true, error: null };
  },

  saveDraft(draft: MCQAssessmentDraft): void {
    try {
      draft.lastSavedAt = new Date().toISOString();
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch (e) {
      console.error('Failed to save draft', e);
    }
  },

  getDraft(): MCQAssessmentDraft | null {
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  clearDraft(): void {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear draft', e);
    }
  },

  getClasses(): MCQClassInfo[] {
    return INITIAL_CLASSES;
  },

  getSubjects() {
    return INITIAL_SUBJECTS;
  },
};
