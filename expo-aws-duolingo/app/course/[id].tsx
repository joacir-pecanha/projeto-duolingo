import React, { useState } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useCourse, LessonWithStatus } from '../../src/hooks/useCourse';
import { Text } from '../../src/components/Text';
import { ProgressBar } from '../../src/components/ProgressBar';
import { SkeletonCard } from '../../src/components/SkeletonLoader';
import { theme } from '../../src/theme';
import { Module } from '../../src/types/course';

export default function CourseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const courseData = useCourse(id ?? '');
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['expo-m1', 'aws-m1']));

  if (!courseData) {
    return (
      <View style={styles.root}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={theme.colors.text.primary} />
          </Pressable>
          <SkeletonCard />
        </View>
      </View>
    );
  }

  const { course, modules, percentComplete, completedLessons, totalLessons, nextLessonId } = courseData;

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const getLessonIcon = (lesson: LessonWithStatus) => {
    if (lesson.isCompleted) return { name: 'check-circle', color: theme.colors.primary.base };
    if (lesson.isUnlocked && !lesson.isCompleted) return { name: 'play-circle', color: course.color };
    return { name: 'lock', color: theme.colors.gray.medium };
  };

  return (
    <View style={styles.root}>
      {/* Sticky Header Banner */}
      <View style={[styles.banner, { backgroundColor: course.color }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtnWhite}>
          <Feather name="arrow-left" size={22} color="#ffffff" />
        </Pressable>

        <View style={styles.bannerContent}>
          <View style={[styles.iconCircle, { backgroundColor: course.shadowColor }]}>
            <Feather name={course.icon as any} size={32} color="#ffffff" />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text size="xl" weight="800" color="#ffffff">
              {course.title}
            </Text>
            <Text size="xs" color="rgba(255,255,255,0.85)" weight="500">
              {completedLessons}/{totalLessons} lições · {course.modules.length} módulos
            </Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.bannerProgress}>
          <ProgressBar
            progress={percentComplete}
            color="#ffffff"
            trackColor="rgba(255,255,255,0.3)"
            height={10}
            showLabel
            animated
          />
        </View>

        {/* Shortcut to Trail */}
        <View style={styles.bannerActions}>
          <Pressable
            onPress={() => router.push(`/trail/${id}` as any)}
            style={styles.trailBtn}
          >
            <Feather name="map" size={14} color={course.color} />
            <Text size="xs" weight="bold" color={course.color} style={{ marginLeft: 5 }}>
              Ver Trilha Visual
            </Text>
          </Pressable>

          {nextLessonId && (
            <Pressable
              onPress={() => router.push(`/lesson/${nextLessonId}` as any)}
              style={[styles.continueBtn, { backgroundColor: course.shadowColor }]}
            >
              <Text size="xs" weight="bold" color="#ffffff">
                Continuar
              </Text>
              <Feather name="chevron-right" size={14} color="#ffffff" style={{ marginLeft: 4 }} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Description */}
        <View style={styles.descSection}>
          <Text size="sm" variant="secondary" style={{ lineHeight: 22 }}>
            {course.description}
          </Text>
        </View>

        {/* Modules */}
        <Text size="sm" variant="secondary" weight="800" style={styles.sectionTitle}>
          Módulos do Curso
        </Text>

        {modules.map((modData, modIdx) => {
          const { module, lessons, completedCount, isStarted } = modData;
          const isExpanded = expandedModules.has(module.id);
          const modulePercent = lessons.length > 0
            ? Math.round((completedCount / lessons.length) * 100)
            : 0;

          return (
            <View key={module.id} style={styles.moduleCard}>
              {/* Module Header */}
              <Pressable
                onPress={() => toggleModule(module.id)}
                style={[styles.moduleHeader, { borderBottomWidth: isExpanded ? 1 : 0 }]}
              >
                <View
                  style={[styles.moduleIconCircle, { backgroundColor: module.color + '22' }]}
                >
                  <Feather name={module.icon as any} size={18} color={module.color} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text size="md" weight="700">
                    {modIdx + 1}. {module.title}
                  </Text>
                  <Text size="xs" variant="secondary">
                    {completedCount}/{lessons.length} lições
                  </Text>
                </View>
                <View style={{ width: 60, marginRight: 12 }}>
                  <ProgressBar progress={modulePercent} color={module.color} height={6} animated={false} />
                </View>
                <Feather
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={theme.colors.gray.medium}
                />
              </Pressable>

              {/* Lessons List */}
              {isExpanded &&
                lessons.map((lessonData, lessonIdx) => {
                  const lessonIcon = getLessonIcon(lessonData);
                  return (
                    <Pressable
                      key={lessonData.lesson.id}
                      onPress={
                        lessonData.isUnlocked
                          ? () => router.push(`/lesson/${lessonData.lesson.id}` as any)
                          : undefined
                      }
                      style={[
                        styles.lessonRow,
                        !lessonData.isUnlocked && styles.lessonRowLocked,
                        lessonIdx === lessons.length - 1 && { borderBottomWidth: 0 },
                      ]}
                    >
                      <View style={styles.lessonNumber}>
                        <Text size="xs" weight="bold" color={theme.colors.gray.medium}>
                          {lessonIdx + 1}
                        </Text>
                      </View>

                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text
                          size="sm"
                          weight={lessonData.isActive ? 'bold' : '500'}
                          color={
                            lessonData.isUnlocked
                              ? theme.colors.text.primary
                              : theme.colors.gray.medium
                          }
                        >
                          {lessonData.lesson.title}
                        </Text>
                        <Text size="xs" variant="secondary">
                          {lessonData.lesson.exercises.length} exercícios · {lessonData.lesson.xpReward} XP
                        </Text>
                      </View>

                      <Feather
                        name={lessonIcon.name as any}
                        size={20}
                        color={lessonIcon.color}
                      />
                    </Pressable>
                  );
                })}
            </View>
          );
        })}
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
    padding: theme.spacing.md,
    paddingTop: 52,
  },
  banner: {
    paddingTop: 52,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  backBtn: {
    padding: 8,
    marginBottom: 8,
  },
  backBtnWhite: {
    padding: 4,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerProgress: {
    marginBottom: 12,
  },
  bannerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.round,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: theme.borderRadius.round,
  },
  scroll: {
    flex: 1,
  },
  descSection: {
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: '#ffffff',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionTitle: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginHorizontal: theme.spacing.md,
    marginBottom: 10,
    marginTop: 4,
  },
  moduleCard: {
    backgroundColor: '#ffffff',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    marginHorizontal: theme.spacing.md,
    marginBottom: 10,
    overflow: 'hidden',
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomColor: theme.colors.border,
  },
  moduleIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  lessonRowLocked: {
    opacity: 0.5,
  },
  lessonNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.gray.lightest,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
