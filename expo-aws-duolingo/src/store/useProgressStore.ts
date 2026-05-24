import { create } from 'zustand';
import { CourseProgress, LessonResult, UserProgress } from '../types/course';
import { UnlockedAchievement } from '../types/gamification';
import { ACHIEVEMENTS } from '../data/achievements';
import { storage } from '../utils/storage';

const STORAGE_KEY = 'user_progress_v1';
const ACHIEVEMENTS_KEY = 'user_achievements_v1';

interface ProgressState {
  courseProgress: Record<string, CourseProgress>;
  lessonResults: LessonResult[];
  unlockedAchievements: UnlockedAchievement[];
  isLoaded: boolean;

  // Actions
  initializeProgress: () => Promise<void>;
  completeLesson: (result: LessonResult) => Promise<void>;
  isLessonUnlocked: (lessonId: string, courseId: string, allLessonIds: string[]) => boolean;
  isLessonCompleted: (lessonId: string) => boolean;
  getCourseProgress: (courseId: string) => CourseProgress | null;
  getCompletedCount: (courseId: string) => number;
  getTotalXP: () => number;
  checkAndUnlockAchievements: (userXP: number, userStreak: number) => UnlockedAchievement[];
  resetProgress: () => Promise<void>;
}

const buildCourseProgress = (
  existing: CourseProgress | undefined,
  courseId: string,
  lessonId: string,
  allCompletedIds: string[],
  totalLessonsInCourse: number,
): CourseProgress => {
  const completedInCourse = allCompletedIds.filter((id) =>
    id.startsWith(courseId)
  );
  const percentComplete = totalLessonsInCourse > 0
    ? Math.round((completedInCourse.length / totalLessonsInCourse) * 100)
    : 0;

  return {
    courseId,
    startedAt: existing?.startedAt ?? new Date().toISOString(),
    completedLessonIds: completedInCourse,
    lastLessonId: lessonId,
    percentComplete,
  };
};

export const useProgressStore = create<ProgressState>((set, get) => ({
  courseProgress: {},
  lessonResults: [],
  unlockedAchievements: [],
  isLoaded: false,

  initializeProgress: async () => {
    try {
      const [progressStr, achievementsStr] = await Promise.all([
        storage.getItemAsync(STORAGE_KEY),
        storage.getItemAsync(ACHIEVEMENTS_KEY),
      ]);
      const progress: UserProgress = progressStr
        ? JSON.parse(progressStr)
        : { courseProgress: {}, lessonResults: [], totalXPEarned: 0 };
      const achievements: UnlockedAchievement[] = achievementsStr
        ? JSON.parse(achievementsStr)
        : [];

      set({
        courseProgress: progress.courseProgress,
        lessonResults: progress.lessonResults,
        unlockedAchievements: achievements,
        isLoaded: true,
      });
    } catch (e) {
      console.error('Progress init error:', e);
      set({ isLoaded: true });
    }
  },

  completeLesson: async (result) => {
    const state = get();
    const alreadyCompleted = state.lessonResults.some(
      (r) => r.lessonId === result.lessonId
    );

    const newResults = alreadyCompleted
      ? state.lessonResults.map((r) =>
          r.lessonId === result.lessonId ? result : r
        )
      : [...state.lessonResults, result];

    const allCompletedIds = [...new Set(newResults.map((r) => r.lessonId))];

    // Compute total for this course (rough heuristic using prefix)
    const courseTotal = allCompletedIds.filter((id) => id.startsWith(result.courseId)).length;
    const existingCourseProgress = state.courseProgress[result.courseId];

    const updatedCourseProgress = buildCourseProgress(
      existingCourseProgress,
      result.courseId,
      result.lessonId,
      allCompletedIds,
      Math.max(courseTotal, existingCourseProgress?.completedLessonIds.length ?? 0),
    );

    const newCourseProgress = {
      ...state.courseProgress,
      [result.courseId]: updatedCourseProgress,
    };

    set({ lessonResults: newResults, courseProgress: newCourseProgress });

    // Persist
    const toSave: UserProgress = {
      courseProgress: newCourseProgress,
      lessonResults: newResults,
      totalXPEarned: newResults.reduce((sum, r) => sum + r.xpEarned, 0),
    };
    await storage.setItemAsync(STORAGE_KEY, JSON.stringify(toSave));
  },

  isLessonCompleted: (lessonId) => {
    return get().lessonResults.some((r) => r.lessonId === lessonId);
  },

  isLessonUnlocked: (lessonId, _courseId, allLessonIds) => {
    const state = get();
    const idx = allLessonIds.indexOf(lessonId);
    if (idx === 0) return true; // first lesson always unlocked
    const previousId = allLessonIds[idx - 1];
    return state.isLessonCompleted(previousId);
  },

  getCourseProgress: (courseId) => {
    return get().courseProgress[courseId] ?? null;
  },

  getCompletedCount: (courseId) => {
    return get().lessonResults.filter((r) => r.courseId === courseId).length;
  },

  getTotalXP: () => {
    return get().lessonResults.reduce((sum, r) => sum + r.xpEarned, 0);
  },

  checkAndUnlockAchievements: (userXP, userStreak) => {
    const state = get();
    const alreadyUnlocked = state.unlockedAchievements.map((a) => a.achievementId);
    const totalLessons = state.lessonResults.length;
    const newUnlocks: Unlocks = [];
    type Unlocks = UnlockedAchievement[];

    for (const achievement of ACHIEVEMENTS) {
      if (alreadyUnlocked.includes(achievement.id)) continue;

      let unlocked = false;
      if (achievement.requiredLessons && totalLessons >= achievement.requiredLessons) unlocked = true;
      if (achievement.requiredStreak && userStreak >= achievement.requiredStreak) unlocked = true;
      if (achievement.requiredXP && userXP >= achievement.requiredXP) unlocked = true;

      if (unlocked) {
        newUnlocks.push({
          achievementId: achievement.id,
          unlockedAt: new Date().toISOString(),
        });
      }
    }

    if (newUnlocks.length > 0) {
      const all = [...state.unlockedAchievements, ...newUnlocks];
      set({ unlockedAchievements: all });
      storage.setItemAsync(ACHIEVEMENTS_KEY, JSON.stringify(all));
    }

    return newUnlocks;
  },

  resetProgress: async () => {
    await storage.deleteItemAsync(STORAGE_KEY);
    await storage.deleteItemAsync(ACHIEVEMENTS_KEY);
    set({
      courseProgress: {},
      lessonResults: [],
      unlockedAchievements: [],
    });
  },
}));
