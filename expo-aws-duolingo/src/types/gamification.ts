export type AchievementCategory =
  | 'streak'
  | 'course'
  | 'xp'
  | 'lesson'
  | 'speed';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Feather icon name
  category: AchievementCategory;
  xpBonus: number;
  // Criteria
  requiredStreak?: number;
  requiredXP?: number;
  requiredLessons?: number;
  requiredCourseId?: string;
}

export interface UnlockedAchievement {
  achievementId: string;
  unlockedAt: string; // ISO date
}

export interface LevelConfig {
  level: number;
  minXP: number;
  maxXP: number;
  title: string; // e.g. "Iniciante", "Aprendiz", "Dev"
}

export const LEVEL_CONFIGS: LevelConfig[] = [
  { level: 1, minXP: 0,    maxXP: 100,  title: 'Iniciante' },
  { level: 2, minXP: 100,  maxXP: 250,  title: 'Curioso' },
  { level: 3, minXP: 250,  maxXP: 500,  title: 'Aprendiz' },
  { level: 4, minXP: 500,  maxXP: 1000, title: 'Dev Júnior' },
  { level: 5, minXP: 1000, maxXP: 2000, title: 'Dev' },
  { level: 6, minXP: 2000, maxXP: 4000, title: 'Dev Sênior' },
  { level: 7, minXP: 4000, maxXP: 8000, title: 'Arquiteto' },
  { level: 8, minXP: 8000, maxXP: Infinity, title: 'Tech Lead' },
];

export const getLevelForXP = (xp: number): LevelConfig => {
  return (
    LEVEL_CONFIGS.slice().reverse().find((l) => xp >= l.minXP) ??
    LEVEL_CONFIGS[0]
  );
};

export const getXPProgressInLevel = (xp: number): number => {
  const level = getLevelForXP(xp);
  if (level.maxXP === Infinity) return 100;
  const range = level.maxXP - level.minXP;
  const earned = xp - level.minXP;
  return Math.min(100, Math.round((earned / range) * 100));
};
