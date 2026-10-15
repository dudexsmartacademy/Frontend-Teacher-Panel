/**
 * Coding Assessment Isolation Boundary
 * 
 * ARCHITECTURAL RULE:
 * Student-submitted code must NEVER be executed inside:
 * 1. The browser / React client
 * 2. The main web application server
 * 3. PostgreSQL database functions
 * 4. Supabase default edge handlers without gVisor / container isolation
 * 
 * Code execution must be delegated to an isolated sandbox (e.g. Judge0, AWS ECS microVM, or isolated sandboxed workers).
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { ProgrammingLanguage, SubmissionStatus } from '../types/database.types';

export interface CodeSubmissionPayload {
  attemptId?: string;
  problemId: string;
  studentId: string;
  language: ProgrammingLanguage;
  code: string;
}

export interface CodeSubmissionResult {
  id: string;
  status: SubmissionStatus;
  score: number;
  testCasesPassed: number;
  totalTestCases: number;
  executionTimeMs?: number;
  memoryUsedKb?: number;
  errorMessage?: string;
}

export const codingJudgeService = {
  /**
   * Submits student code to the queuing table.
   * A dedicated sandboxed worker / Edge Function polls and runs the code against hidden test cases.
   */
  async submitCodeForEvaluation(payload: CodeSubmissionPayload): Promise<{ data: CodeSubmissionResult | null; error: string | null }> {
    if (!isSupabaseConfigured) {
      return {
        data: {
          id: `sub-mock-${Date.now()}`,
          status: 'accepted',
          score: 100,
          testCasesPassed: 5,
          totalTestCases: 5,
          executionTimeMs: 42,
          memoryUsedKb: 12400,
        },
        error: null,
      };
    }

    try {
      const { data, error } = await supabase
        .from('code_submissions')
        .insert({
          attempt_id: payload.attemptId || null,
          coding_problem_id: payload.problemId,
          student_id: payload.studentId,
          language: payload.language,
          code: payload.code,
          status: 'pending',
          score: 0,
          test_cases_passed: 0,
          total_test_cases: 0,
        })
        .select()
        .single();

      if (error || !data) {
        return { data: null, error: error?.message || 'Failed to submit code for evaluation' };
      }

      const row = data as unknown as Record<string, unknown>;
      return {
        data: {
          id: row.id as string,
          status: row.status as SubmissionStatus,
          score: Number(row.score),
          testCasesPassed: Number(row.test_cases_passed),
          totalTestCases: Number(row.total_test_cases),
          executionTimeMs: row.execution_time_ms ? Number(row.execution_time_ms) : undefined,
          memoryUsedKb: row.memory_used_kb ? Number(row.memory_used_kb) : undefined,
          errorMessage: (row.error_message as string) || undefined,
        },
        error: null,
      };
    } catch {
      return { data: null, error: 'Code submission failed' };
    }
  },

  /**
   * Fetches problem statement and starter template (without revealing hidden test cases).
   */
  async getProblemDetails(problemId: string) {
    if (!isSupabaseConfigured) {
      return {
        data: {
          id: problemId,
          title: 'Two Sum Problem',
          problemStatement: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
          timeLimitMs: 2000,
          memoryLimitMb: 256,
          starterTemplates: {
            python: 'def solution(nums, target):\n    # Write your code here\n    pass',
          },
        },
        error: null,
      };
    }

    const { data, error } = await (supabase
      .from('coding_problems')
      .select('id, title, problem_statement, input_format, output_format, constraints, time_limit_ms, memory_limit_mb, starter_templates')
      .eq('id', problemId)
      .maybeSingle() as unknown as Promise<{ data: Record<string, unknown> | null; error: Error | null }>);

    if (error || !data) return { data: null, error: error?.message || 'Problem not found' };

    return {
      data: {
        id: data.id as string,
        title: data.title as string,
        problemStatement: data.problem_statement as string,
        inputFormat: (data.input_format as string) || null,
        outputFormat: (data.output_format as string) || null,
        constraints: (data.constraints as string) || null,
        timeLimitMs: Number(data.time_limit_ms),
        memoryLimitMb: Number(data.memory_limit_mb),
        starterTemplates: data.starter_templates as Record<string, string>,
      },
      error: null,
    };
  },
};
