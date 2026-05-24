import React from 'react';
import { ScrollView, View, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useCourse } from '../../src/hooks/useCourse';
import { LessonNode } from '../../src/components/LessonNode';
import { Text } from '../../src/components/Text';
import { theme } from '../../src/theme';

export default function TrailScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const router = useRouter();
  const courseData = useCourse(courseId ?? '');

  if (!courseData) {
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Curso não encontrado.</Text>
      </View>
    );
  }

  const { course, modules } = courseData;

  // Flatten all lessons across all modules into a single ordered list
  const allLessons = modules.flatMap((m) =>
    m.lessons.map((ls) => ({ ...ls, module: m.module }))
  );

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: course.color }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color="#ffffff" />
        </Pressable>
        <View style={styles.headerContent}>
          <Feather name={course.icon as any} size={24} color="#ffffff" style={{ marginRight: 10 }} />
          <View>
            <Text size="lg" weight="800" color="#ffffff">
              Trilha {course.shortTitle}
            </Text>
            <Text size="xs" color="rgba(255,255,255,0.85)" weight="500">
              {courseData.completedLessons}/{courseData.totalLessons} lições concluídas
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Module groups */}
        {modules.map((modData, modIdx) => {
          const { module, lessons } = modData;

          return (
            <View key={module.id}>
              {/* Module Banner */}
              <View style={[styles.moduleBanner, { backgroundColor: module.color + '18' }]}>
                <View style={[styles.moduleDot, { backgroundColor: module.color }]}>
                  <Feather name={module.icon as any} size={14} color="#ffffff" />
                </View>
                <Text size="sm" weight="800" color={module.color}>
                  Módulo {modIdx + 1}: {module.title}
                </Text>
              </View>

              {/* Lessons in this module */}
              {lessons.map((lessonData, lessonIdx) => {
                const nodeState = lessonData.isCompleted
                  ? 'completed'
                  : lessonData.isActive
                  ? 'active'
                  : 'locked';

                const isLastInModule = lessonIdx === lessons.length - 1;

                return (
                  <LessonNode
                    key={lessonData.lesson.id}
                    title={lessonData.lesson.title}
                    icon={lessonData.lesson.icon}
                    state={nodeState}
                    moduleColor={module.color}
                    order={lessonIdx + 1}
                    isLast={isLastInModule && modIdx === modules.length - 1}
                    onPress={() => router.push(`/lesson/${lessonData.lesson.id}` as any)}
                  />
                );
              })}

              {/* Separator between modules */}
              {modIdx < modules.length - 1 && (
                <View style={styles.moduleConnector}>
                  <View style={styles.connectorLine} />
                  <View style={[styles.moduleEndBadge, { backgroundColor: module.color + '22', borderColor: module.color }]}>
                    <Feather name="check" size={12} color={module.color} />
                    <Text size="xs" weight="bold" color={module.color} style={{ marginLeft: 4 }}>
                      Fim do Módulo {modIdx + 1}
                    </Text>
                  </View>
                  <View style={styles.connectorLine} />
                </View>
              )}
            </View>
          );
        })}

        {/* Trail Complete Footer */}
        <View style={styles.trailEndContainer}>
          <View style={[styles.trailEndCircle, { borderColor: course.color }]}>
            <Text style={{ fontSize: 32 }}>🏆</Text>
          </View>
          <Text size="md" weight="800" align="center" style={{ marginTop: 10 }}>
            {courseData.percentComplete === 100
              ? `Trilha ${course.shortTitle} Concluída!`
              : `Meta: Completar ${course.shortTitle}`}
          </Text>
          <Text size="sm" variant="secondary" align="center">
            {courseData.completedLessons} de {courseData.totalLessons} lições
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingTop: 52,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  backBtn: {
    alignSelf: 'flex-start',
    padding: 4,
    marginBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: theme.spacing.md,
    paddingBottom: 60,
  },
  moduleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.md,
    marginVertical: 12,
    padding: 10,
    borderRadius: theme.borderRadius.md,
  },
  moduleDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  moduleConnector: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  connectorLine: {
    width: 2,
    height: 16,
    backgroundColor: theme.colors.gray.light,
  },
  moduleEndBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: theme.borderRadius.round,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginVertical: 4,
  },
  trailEndContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    marginTop: 16,
  },
  trailEndCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
