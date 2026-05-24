import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useAuth } from '../../src/hooks/useAuth';
import { useProgressStore } from '../../src/store/useProgressStore';
import { useGamification } from '../../src/hooks/useGamification';
import { useCourse } from '../../src/hooks/useCourse';
import { Mascot } from '../../src/components/Mascot';
import { Text } from '../../src/components/Text';
import { Button } from '../../src/components/Button';
import { CourseCard } from '../../src/components/CourseCard';
import { ProgressBar } from '../../src/components/ProgressBar';
import { SkeletonCard } from '../../src/components/SkeletonLoader';
import { theme } from '../../src/theme';
import { getLevelForXP } from '../../src/types/gamification';

export default function Dashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuth();
  const { isLoaded, initializeProgress } = useProgressStore();
  const { currentXP, currentLevel, streak, xpProgressPercent } = useGamification();
  const expoCourse = useCourse('expo');
  const awsCourse = useCourse('aws');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    initializeProgress();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]).start();
    }
  }, [isLoaded]);

  const levelConfig = getLevelForXP(currentXP);
  const firstName = user?.name?.split(' ')[0] || 'Dev';
  const hourNow = new Date().getHours();
  const greeting =
    hourNow < 12 ? 'Bom dia' : hourNow < 18 ? 'Boa tarde' : 'Boa noite';

  const getMascotMessage = () => {
    if (streak >= 7) return `${greeting}, ${firstName}! 🔥 ${streak} dias seguidos! Você é imparável!`;
    if (currentXP === 0) return `${greeting}, ${firstName}! Vamos começar sua jornada de aprendizado hoje!`;
    return `${greeting}, ${firstName}! Continue assim — você já acumulou ${currentXP} XP!`;
  };

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text size="xs" variant="secondary" weight="500">
              {greeting},
            </Text>
            <Text size="lg" weight="800">
              {user?.name || 'Desenvolvedor'}
            </Text>
          </View>
          <Button
            variant="ghost"
            style={{ width: 'auto', height: 42, paddingHorizontal: 12 }}
            onPress={logout}
          >
            <Feather name="log-out" size={18} color={theme.colors.error.base} />
          </Button>
        </View>

        {/* XP / Level / Streak Row */}
        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Feather name="zap" size={14} color={theme.colors.accent.base} />
            <Text size="xs" weight="bold" style={{ marginLeft: 4 }}>
              {currentXP} XP
            </Text>
          </View>
          <View style={styles.statChip}>
            <Feather name="award" size={14} color={theme.colors.secondary.base} />
            <Text size="xs" weight="bold" style={{ marginLeft: 4 }}>
              Nv. {currentLevel} · {levelConfig.title}
            </Text>
          </View>
          <View style={[styles.statChip, streak >= 1 && styles.streakActive]}>
            <Text size="xs">🔥</Text>
            <Text
              size="xs"
              weight="bold"
              color={streak >= 1 ? theme.colors.accent.shadow : theme.colors.text.secondary}
              style={{ marginLeft: 4 }}
            >
              {streak} dias
            </Text>
          </View>
        </View>

        {/* Level Progress */}
        <View style={{ marginTop: 8 }}>
          <ProgressBar
            progress={xpProgressPercent}
            color={theme.colors.secondary.base}
            height={8}
            label={`Nível ${currentLevel} → ${currentLevel + 1}`}
            showLabel
            animated={isLoaded}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* Mascot */}
          <Mascot expression="happy" message={getMascotMessage()} />

          {/* Section title */}
          <View style={styles.sectionHeader}>
            <Text size="sm" variant="secondary" weight="800" style={styles.sectionTitle}>
              Minhas Trilhas
            </Text>
            <View style={styles.coursesCount}>
              <Text size="xs" color={theme.colors.secondary.base} weight="bold">
                2 cursos
              </Text>
            </View>
          </View>

          {/* Course Cards */}
          {!isLoaded ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              {expoCourse && (
                <CourseCard
                  courseData={expoCourse}
                  onPress={() => router.push('/course/expo' as any)}
                  onTrailPress={() => router.push('/trail/expo' as any)}
                />
              )}
              {awsCourse && (
                <CourseCard
                  courseData={awsCourse}
                  onPress={() => router.push('/course/aws' as any)}
                  onTrailPress={() => router.push('/trail/aws' as any)}
                />
              )}
            </>
          )}

          {/* Quick Stats */}
          {isLoaded && (
            <View style={styles.quickStats}>
              <Text size="sm" variant="secondary" weight="800" style={styles.sectionTitle}>
                Estatísticas Rápidas
              </Text>
              <View style={styles.statsGrid}>
                <View style={[styles.statBox, { borderColor: theme.colors.primary.base }]}>
                  <Feather name="book-open" size={20} color={theme.colors.primary.base} />
                  <Text size="lg" weight="800" color={theme.colors.primary.base}>
                    {(expoCourse?.completedLessons ?? 0) + (awsCourse?.completedLessons ?? 0)}
                  </Text>
                  <Text size="xs" variant="secondary" align="center">
                    Lições{'\n'}concluídas
                  </Text>
                </View>
                <View style={[styles.statBox, { borderColor: theme.colors.accent.base }]}>
                  <Feather name="zap" size={20} color={theme.colors.accent.base} />
                  <Text size="lg" weight="800" color={theme.colors.accent.base}>
                    {currentXP}
                  </Text>
                  <Text size="xs" variant="secondary" align="center">
                    XP{'\n'}total
                  </Text>
                </View>
                <View style={[styles.statBox, { borderColor: theme.colors.secondary.base }]}>
                  <Text style={{ fontSize: 20 }}>🔥</Text>
                  <Text size="lg" weight="800" color={theme.colors.secondary.base}>
                    {streak}
                  </Text>
                  <Text size="xs" variant="secondary" align="center">
                    Dias{'\n'}seguidos
                  </Text>
                </View>
              </View>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.gray.lightest,
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 52,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray.lightest,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.borderRadius.round,
  },
  streakActive: {
    backgroundColor: theme.colors.accent.light,
    borderColor: theme.colors.accent.base,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  coursesCount: {
    backgroundColor: theme.colors.secondary.light,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.round,
  },
  quickStats: {
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderRadius: theme.borderRadius.md,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
});
