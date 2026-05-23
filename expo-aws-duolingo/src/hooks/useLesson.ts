import { useState, useCallback } from 'react';
import { Lesson, Exercise, LessonResult } from '../types/course';
import { AssociationExercise } from '../types/course';

type FeedbackState = 'idle' | 'correct' | 'incorrect';

interface LessonState {
  currentExerciseIndex: number;
  selectedAnswer: number | null;       // for multiple-choice, complete-code
  selectedBool: boolean | null;        // for true-false
  orderedSteps: number[];              // for order-steps
  associationLeft: string | null;      // for association: selected left item
  associationMatches: Record<string, string>; // left -> right matched pairs
  feedback: FeedbackState;
  correctCount: number;
  isFinished: boolean;
  xpEarned: number;
}

export const useLesson = (lesson: Lesson) => {
  const exercises = lesson.exercises;

  const [state, setState] = useState<LessonState>({
    currentExerciseIndex: 0,
    selectedAnswer: null,
    selectedBool: null,
    orderedSteps: exercises[0]?.type === 'order-steps'
      ? exercises[0].steps.map((_, i) => i)
      : [],
    associationLeft: null,
    associationMatches: {},
    feedback: 'idle',
    correctCount: 0,
    isFinished: false,
    xpEarned: 0,
  });

  const currentExercise: Exercise | undefined = exercises[state.currentExerciseIndex];
  const progress = exercises.length > 0
    ? (state.currentExerciseIndex / exercises.length) * 100
    : 0;

  const selectAnswer = useCallback((index: number) => {
    if (state.feedback !== 'idle') return;
    setState((s) => ({ ...s, selectedAnswer: index }));
  }, [state.feedback]);

  const selectBool = useCallback((val: boolean) => {
    if (state.feedback !== 'idle') return;
    setState((s) => ({ ...s, selectedBool: val }));
  }, [state.feedback]);

  const selectAssociationLeft = useCallback((item: string) => {
    if (state.feedback !== 'idle') return;
    setState((s) => ({ ...s, associationLeft: item }));
  }, [state.feedback]);

  const selectAssociationRight = useCallback((rightItem: string) => {
    if (state.feedback !== 'idle' || !state.associationLeft) return;
    const newMatches = { ...state.associationMatches, [state.associationLeft]: rightItem };
    setState((s) => ({ ...s, associationMatches: newMatches, associationLeft: null }));
  }, [state.feedback, state.associationLeft, state.associationMatches]);

  const moveStep = useCallback((fromIndex: number, toIndex: number) => {
    if (state.feedback !== 'idle') return;
    setState((s) => {
      const newOrder = [...s.orderedSteps];
      const [moved] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, moved);
      return { ...s, orderedSteps: newOrder };
    });
  }, [state.feedback]);

  const checkAnswer = useCallback((): boolean => {
    if (!currentExercise) return false;

    let isCorrect = false;

    if (currentExercise.type === 'multiple-choice' || currentExercise.type === 'complete-code') {
      isCorrect = state.selectedAnswer === currentExercise.correctIndex;
    } else if (currentExercise.type === 'true-false') {
      isCorrect = state.selectedBool === currentExercise.correctAnswer;
    } else if (currentExercise.type === 'order-steps') {
      isCorrect = state.orderedSteps.join(',') === currentExercise.correctOrder.join(',');
    } else if (currentExercise.type === 'association') {
      const assoc = currentExercise as AssociationExercise;
      isCorrect = assoc.pairs.every(
        (pair) => state.associationMatches[pair.left] === pair.right
      );
    }

    const xpGained = isCorrect ? currentExercise.xpReward : 0;
    setState((s) => ({
      ...s,
      feedback: isCorrect ? 'correct' : 'incorrect',
      correctCount: isCorrect ? s.correctCount + 1 : s.correctCount,
      xpEarned: s.xpEarned + xpGained,
    }));

    return isCorrect;
  }, [currentExercise, state]);

  const nextExercise = useCallback(() => {
    const nextIndex = state.currentExerciseIndex + 1;
    if (nextIndex >= exercises.length) {
      setState((s) => ({ ...s, isFinished: true, feedback: 'idle' }));
      return;
    }

    const nextEx = exercises[nextIndex];
    setState((s) => ({
      ...s,
      currentExerciseIndex: nextIndex,
      selectedAnswer: null,
      selectedBool: null,
      associationLeft: null,
      associationMatches: {},
      orderedSteps: nextEx?.type === 'order-steps'
        ? nextEx.steps.map((_, i) => i)
        : [],
      feedback: 'idle',
    }));
  }, [state.currentExerciseIndex, exercises]);

  const buildResult = useCallback((): LessonResult => ({
    lessonId: lesson.id,
    courseId: lesson.moduleId.split('-')[0], // derive courseId from moduleId prefix
    completedAt: new Date().toISOString(),
    score: exercises.length > 0
      ? Math.round((state.correctCount / exercises.length) * 100)
      : 0,
    xpEarned: state.xpEarned,
    correctAnswers: state.correctCount,
    totalQuestions: exercises.length,
  }), [lesson, exercises.length, state.correctCount, state.xpEarned]);

  const canSubmit = useCallback((): boolean => {
    if (!currentExercise || state.feedback !== 'idle') return false;
    if (currentExercise.type === 'multiple-choice' || currentExercise.type === 'complete-code') {
      return state.selectedAnswer !== null;
    }
    if (currentExercise.type === 'true-false') {
      return state.selectedBool !== null;
    }
    if (currentExercise.type === 'association') {
      const assoc = currentExercise as AssociationExercise;
      return Object.keys(state.associationMatches).length === assoc.pairs.length;
    }
    return true; // order-steps is always submittable
  }, [currentExercise, state]);

  return {
    currentExercise,
    currentExerciseIndex: state.currentExerciseIndex,
    totalExercises: exercises.length,
    progress,
    selectedAnswer: state.selectedAnswer,
    selectedBool: state.selectedBool,
    orderedSteps: state.orderedSteps,
    associationLeft: state.associationLeft,
    associationMatches: state.associationMatches,
    feedback: state.feedback,
    correctCount: state.correctCount,
    xpEarned: state.xpEarned,
    isFinished: state.isFinished,
    canSubmit,
    selectAnswer,
    selectBool,
    selectAssociationLeft,
    selectAssociationRight,
    moveStep,
    checkAnswer,
    nextExercise,
    buildResult,
  };
};
