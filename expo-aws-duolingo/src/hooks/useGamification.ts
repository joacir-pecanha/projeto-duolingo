import { useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useProgressStore } from '../store/useProgressStore';
import { getLevelForXP, getXPProgressInLevel } from '../types/gamification';
import { LessonResult } from '../types/course';
import { UnlockedAchievement } from '../types/gamification';

export interface GamificationResult {
  xpEarned: number;
  newAchievements: UnlockedAchievement[];
  leveledUp: boolean;
  newLevel: number;
}

export const useGamification = () => {
  const user = useAuthStore((s) => s.user);
  const addXP = useAuthStore((s) => s.addXP);
  const { checkAndUnlockAchievements } = useProgressStore();

  const currentXP = user?.xp ?? 0;
  const currentLevel = user?.level ?? 1;
  const streak = user?.streak ?? 0;

  const levelConfig = getLevelForXP(currentXP);
  const xpProgressPercent = getXPProgressInLevel(currentXP);

  const processLessonCompletion = useCallback(
    (result: LessonResult): GamificationResult => {
      const prevLevel = getLevelForXP(currentXP).level;
      const newXP = currentXP + result.xpEarned;
      const newLevel = getLevelForXP(newXP).level;

      addXP(result.xpEarned);

      const newAchievements = checkAndUnlockAchievements(newXP, streak);

      return {
        xpEarned: result.xpEarned,
        newAchievements,
        leveledUp: newLevel > prevLevel,
        newLevel,
      };
    },
    [currentXP, streak, addXP, checkAndUnlockAchievements]
  );

  return {
    currentXP,
    currentLevel,
    streak,
    levelConfig,
    xpProgressPercent,
    processLessonCompletion,
  };
};
