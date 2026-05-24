import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';
import { Text } from './Text';
import { ProgressBar } from './ProgressBar';
import { CourseWithProgress } from '../hooks/useCourse';

interface CourseCardProps {
  courseData: CourseWithProgress;
  onPress: () => void;
  onTrailPress: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  courseData,
  onPress,
  onTrailPress,
}) => {
  const { course, percentComplete, completedLessons, totalLessons } = courseData;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const isStarted = completedLessons > 0;

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.card, { borderColor: course.shadowColor }]}
      >
        {/* Header Banner */}
        <View style={[styles.banner, { backgroundColor: course.color }]}>
          <View style={[styles.iconCircle, { backgroundColor: course.shadowColor }]}>
            <Feather name={course.icon as any} size={28} color="#ffffff" />
          </View>
          <View style={styles.bannerText}>
            <Text size="lg" weight="800" color="#ffffff">
              {course.shortTitle}
            </Text>
            <Text size="xs" color="rgba(255,255,255,0.85)" weight="500">
              {totalLessons} lições · {course.modules.length} módulos
            </Text>
          </View>
          <View style={styles.xpBadge}>
            <Text size="xs" weight="bold" color="#ffffff">
              {completedLessons}/{totalLessons}
            </Text>
          </View>
        </View>

        {/* Body */}
        <View style={styles.body}>
          <Text size="sm" variant="secondary" style={{ marginBottom: 12 }}>
            {course.description.substring(0, 90)}…
          </Text>

          <ProgressBar
            progress={percentComplete}
            color={course.color}
            showLabel
            animated
          />

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Pressable
              onPress={onTrailPress}
              style={[styles.actionBtn, { borderColor: course.color }]}
            >
              <Feather name="map" size={14} color={course.color} style={{ marginRight: 4 }} />
              <Text size="xs" weight="bold" color={course.color}>
                Ver Trilha
              </Text>
            </Pressable>

            <Pressable
              onPress={onPress}
              style={[styles.primaryBtn, { backgroundColor: course.color }]}
            >
              <Text size="sm" weight="bold" color="#ffffff">
                {isStarted ? 'Continuar' : 'Começar'}
              </Text>
              <Feather name="chevron-right" size={16} color="#ffffff" style={{ marginLeft: 4 }} />
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderBottomWidth: 5,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bannerText: {
    flex: 1,
  },
  xpBadge: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  body: {
    padding: theme.spacing.md,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.md,
  },
});
