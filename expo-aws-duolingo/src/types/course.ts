// ────────────────────────────────────────────────────────
// Exercise Types
// ────────────────────────────────────────────────────────

export type ExerciseType =
  | 'multiple-choice'
  | 'true-false'
  | 'association'
  | 'complete-code'
  | 'order-steps';

interface BaseExercise {
  id: string;
  type: ExerciseType;
  question: string;
  explanation: string; // shown on feedback
  xpReward: number;
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: 'multiple-choice';
  options: string[];
  correctIndex: number;
}

export interface TrueFalseExercise extends BaseExercise {
  type: 'true-false';
  correctAnswer: boolean;
}

export interface AssociationPair {
  left: string;
  right: string;
}

export interface AssociationExercise extends BaseExercise {
  type: 'association';
  pairs: AssociationPair[];
}

export interface CompleteCodeExercise extends BaseExercise {
  type: 'complete-code';
  codePrefix: string;  // code shown before the blank
  codeSuffix: string;  // code shown after the blank
  options: string[];   // clickable code fragments
  correctIndex: number;
}

export interface OrderStepsExercise extends BaseExercise {
  type: 'order-steps';
  steps: string[];        // shuffled display
  correctOrder: number[]; // correct indices
}

export type Exercise =
  | MultipleChoiceExercise
  | TrueFalseExercise
  | AssociationExercise
  | CompleteCodeExercise
  | OrderStepsExercise;

// ────────────────────────────────────────────────────────
// Lesson
// ────────────────────────────────────────────────────────

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  icon: string; // Feather icon name
  order: number;
  xpReward: number; // total XP for completing lesson
  exercises: Exercise[];
}

// ────────────────────────────────────────────────────────
// Module
// ────────────────────────────────────────────────────────

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  color: string;
  lessons: Lesson[];
}

// ────────────────────────────────────────────────────────
// Course
// ────────────────────────────────────────────────────────

export interface Course {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  color: string;       // main brand color
  shadowColor: string; // darker shade
  lightColor: string;  // lighter shade for bg
  totalLessons: number;
  modules: Module[];
}

// ────────────────────────────────────────────────────────
// Progress
// ────────────────────────────────────────────────────────

export interface LessonResult {
  lessonId: string;
  courseId: string;
  completedAt: string; // ISO date
  score: number;       // 0-100 %
  xpEarned: number;
  correctAnswers: number;
  totalQuestions: number;
}

export interface CourseProgress {
  courseId: string;
  startedAt: string;
  completedLessonIds: string[];
  lastLessonId: string | null;
  percentComplete: number;
}

export interface UserProgress {
  courseProgress: Record<string, CourseProgress>;
  lessonResults: LessonResult[];
  totalXPEarned: number;
}
