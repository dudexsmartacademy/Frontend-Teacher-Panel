import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface NoteAttachment {
  id: string;
  noteId: string;
  filePath: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export interface NoteItem {
  id: string;
  classId: string;
  className?: string;
  subjectName?: string;
  noteDate: string;
  title: string;
  description?: string | null;
  isPublished: boolean;
  attachments?: NoteAttachment[];
  createdAt: string;
}

const mockNotes: NoteItem[] = [
  {
    id: '1',
    classId: '1',
    className: 'AI & DS - Section B',
    subjectName: 'Python',
    noteDate: new Date().toISOString().split('T')[0],
    title: 'Python Basics & Memory Management',
    description: 'Comprehensive notes covering memory references, garbage collection, and variable scoping in Python.',
    isPublished: true,
    attachments: [
      {
        id: 'att-1',
        noteId: '1',
        filePath: 'notes/1/1/python_basics_lecture.pdf',
        fileName: 'python_basics_lecture.pdf',
        fileType: 'application/pdf',
        fileSize: 2457600,
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    classId: '1',
    className: 'AI & DS - Section B',
    subjectName: 'Python',
    noteDate: new Date().toISOString().split('T')[0],
    title: 'Interview Questions - OOP & Polymorphism',
    description: 'Top 25 technical placement questions asked by Tier-1 product companies.',
    isPublished: true,
    attachments: [
      {
        id: 'att-2',
        noteId: '2',
        filePath: 'notes/1/2/interview_qa_sheet.pdf',
        fileName: 'interview_qa_sheet.pdf',
        fileType: 'application/pdf',
        fileSize: 1843200,
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    classId: '1',
    className: 'AI & DS - Section B',
    subjectName: 'Python',
    noteDate: new Date().toISOString().split('T')[0],
    title: 'Practice Problems Set #1',
    description: '10 algorithmic challenges on strings, arrays, and dictionaries.',
    isPublished: true,
    attachments: [
      {
        id: 'att-3',
        noteId: '3',
        filePath: 'notes/1/3/practice_problems.png',
        fileName: 'practice_problems.png',
        fileType: 'image/png',
        fileSize: 845200,
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

export const notesService = {
  async getNotes(classId?: string) {
    if (!isSupabaseConfigured) {
      const filtered = classId && classId !== 'all' ? mockNotes.filter(n => n.classId === classId || n.classId === '1') : mockNotes;
      return { data: filtered, error: null };
    }

    let q = supabase
      .from('notes')
      .select(`
        id,
        class_id,
        note_date,
        title,
        description,
        is_published,
        created_at,
        classes(name),
        subjects(name),
        note_attachments(
          id,
          file_path,
          file_name,
          file_type,
          file_size
        )
      `)
      .is('archived_at', null)
      .order('note_date', { ascending: false });

    if (classId && classId !== 'all') {
      q = q.eq('class_id', classId);
    }

    const { data, error } = await (q as unknown as Promise<{ data: Array<Record<string, unknown>> | null; error: Error | null }>);
    if (error) return { data: mockNotes, error: error.message };

    const formatted: NoteItem[] = (data || []).map((item) => {
      const cls = item.classes as { name: string } | undefined;
      const sub = item.subjects as { name: string } | undefined;
      const atts = (item.note_attachments as Array<{ id: string; file_path: string; file_name: string; file_type: string; file_size: number }>) || [];

      return {
        id: item.id as string,
        classId: item.class_id as string,
        className: cls?.name || 'Class',
        subjectName: sub?.name || 'Subject',
        noteDate: item.note_date as string,
        title: item.title as string,
        description: (item.description as string) || null,
        isPublished: Boolean(item.is_published),
        attachments: atts.map(a => ({
          id: a.id,
          noteId: item.id as string,
          filePath: a.file_path,
          fileName: a.file_name,
          fileType: a.file_type,
          fileSize: Number(a.file_size),
        })),
        createdAt: item.created_at as string,
      };
    });

    return { data: formatted.length > 0 ? formatted : mockNotes, error: null };
  },

  async createNote(
    payload: {
      classId: string;
      title: string;
      description?: string;
      noteDate: string;
      subjectId?: string;
    },
    files: File[]
  ) {
    if (!isSupabaseConfigured) {
      const newNote: NoteItem = {
        id: `mock-${Date.now()}`,
        classId: payload.classId,
        className: 'AI & DS - Section B',
        subjectName: 'Python',
        noteDate: payload.noteDate,
        title: payload.title,
        description: payload.description,
        isPublished: true,
        attachments: files.map((f, i) => ({
          id: `att-${Date.now()}-${i}`,
          noteId: `mock-${Date.now()}`,
          fileName: f.name,
          filePath: `notes/${payload.classId}/mock/${f.name}`,
          fileType: f.type,
          fileSize: f.size,
        })),
        createdAt: new Date().toISOString(),
      };
      mockNotes.unshift(newNote);
      return { data: newNote, error: null };
    }

    try {
      const { data: teacherProf } = await (supabase
        .from('teacher_profiles')
        .select('id')
        .limit(1)
        .single() as unknown as Promise<{ data: { id: string } | null; error: Error | null }>);

      if (!teacherProf) throw new Error('Teacher profile not found.');

      // 1. Create note record
      const { data: note, error: noteErr } = await (supabase
        .from('notes')
        .insert({
          class_id: payload.classId,
          teacher_id: teacherProf.id,
          subject_id: payload.subjectId || null,
          title: payload.title,
          description: payload.description || null,
          note_date: payload.noteDate,
          is_published: true,
        })
        .select()
        .single() as unknown as Promise<{ data: Record<string, unknown> | null; error: Error | null }>);

      if (noteErr || !note) throw new Error(noteErr?.message || 'Failed to create note');

      // 2. Upload files to private Supabase Storage bucket 'academy-notes'
      const attachmentRecords: NoteAttachment[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uniqueFileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const storagePath = `notes/${payload.classId}/${note.id}/${uniqueFileName}`;

        const { error: uploadErr } = await supabase.storage
          .from('academy-notes')
          .upload(storagePath, file, {
            contentType: file.type,
            upsert: false,
          });

        if (uploadErr) {
          console.warn(`Storage upload warning for ${file.name}:`, uploadErr.message);
        }

        const { data: attRecord } = await (supabase
          .from('note_attachments')
          .insert({
            note_id: note.id as string,
            file_path: storagePath,
            file_name: file.name,
            file_type: file.type || 'application/octet-stream',
            file_size: file.size,
            display_order: i + 1,
          })
          .select()
          .single() as unknown as Promise<{ data: Record<string, unknown> | null; error: Error | null }>);

        if (attRecord) {
          attachmentRecords.push({
            id: attRecord.id as string,
            noteId: note.id as string,
            filePath: attRecord.file_path as string,
            fileName: attRecord.file_name as string,
            fileType: attRecord.file_type as string,
            fileSize: Number(attRecord.file_size),
          });
        }
      }

      return {
        data: {
          id: note.id as string,
          classId: note.class_id as string,
          noteDate: note.note_date as string,
          title: note.title as string,
          description: (note.description as string) || null,
          isPublished: Boolean(note.is_published),
          attachments: attachmentRecords,
          createdAt: note.created_at as string,
        },
        error: null,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Note creation failed';
      return { data: null, error: msg };
    }
  },

  async archiveNote(noteId: string) {
    if (!isSupabaseConfigured) {
      const idx = mockNotes.findIndex(n => n.id === noteId);
      if (idx !== -1) mockNotes.splice(idx, 1);
      return { success: true, error: null };
    }

    const { error } = await supabase
      .from('notes')
      .update({ archived_at: new Date().toISOString() })
      .eq('id', noteId);

    return { success: !error, error: error?.message || null };
  },
};
