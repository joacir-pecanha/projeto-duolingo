import { useMemo } from 'react';
import { getCourseById, getAllLessonIds } from '../data/courses';
import { useProgressStore } from '../store/useProgressStore';
import { Course, Module, Lesson } from '../types/course';

export interface LessonWithStatus {
  lesson: Lesson;
  isCompleted: boolean;
  isUnlocked: boolean;
  isActive: boolean; // next lesson to do
}

export interface ModuleWithStatus {
  module: Module;
  lessons: LessonWithStatus[];
  completedCount: number;
  isStarted: boolean;
}

export interface CourseWithProgress {
  course: Course;
  modules: ModuleWithStatus[];
  percentComplete: number;
  completedLessons: number;
  totalLessons: number;
  nextLessonId: string | null;
}

export const useCourse = (courseId: string): CourseWithProgress | null => {
  const { isLessonCompleted, courseProgress } = useProgressStore();
  const progress = courseProgress[courseId];

  return useMemo(() => {
    const course = getCourseById(courseId);
    if (!course) return null;

    const allLessonIds = getAllLessonIds(courseId);
    let foundActive = false;
    let nextLessonId: string | null = null;

    const modulesWithStatus: ModuleWithStatus[] = course.modules.map((mod) => {
      let completedCount = 0;

      const lessonsWithStatus: LessonWithStatus[] = mod.lessons.map((lesson) => {
        const isCompleted = isLessonCompleted(lesson.id);
        const lessonIdx = allLessonIds.indexOf(lesson.id);
        const isUnlocked =
          lessonIdx === 0 || isLessonCompleted(allLessonIds[lessonIdx - 1]);

        let isActive = false;
        if (!foundActive && isUnlocked && !isCompleted) {
          isActive = true;
          foundActive = true;
          nextLessonId = lesson.id;
        }

        if (isCompleted) completedCount++;

        return { lesson, isCompleted, isUnlocked, isActive };
      });

      return {
        module: mod,
        lessons: lessonsWithStatus,
        completedCount,
        isStarted: completedCount > 0,
      };
    });

    const totalLessons = allLessonIds.length;
    const completedLessons = progress?.completedLessonIds.length ?? 0;
    const percentComplete =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      course,
      modules: modulesWithStatus,
      percentComplete,
      completedLessons,
      totalLessons,
      nextLessonId,
    };
  }, [courseId, isLessonCompleted, progress]);
};
