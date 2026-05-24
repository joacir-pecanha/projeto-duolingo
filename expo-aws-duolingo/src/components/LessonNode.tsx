import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';
import { Text } from './Text';

type NodeState = 'locked' | 'active' | 'completed';

interface LessonNodeProps {
  title: string;
  icon: string;
  state: NodeState;
  moduleColor: string;
  order: number;
  onPress?: () => void;
  isLast?: boolean;
}

export const LessonNode: React.FC<LessonNodeProps> = ({
  title,
  icon,
  state: nodeState,
  moduleColor,
  order,
  onPress,
  isLast = false,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (nodeState === 'active') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.12,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [nodeState, pulseAnim]);

  const isLocked = nodeState === 'locked';
  const isCompleted = nodeState === 'completed';
  const isActive = nodeState === 'active';

  const circleColor = isLocked
    ? theme.colors.gray.light
    : isCompleted
    ? moduleColor
    : moduleColor;

  const shadowColor = isLocked
    ? theme.colors.gray.medium
    : isCompleted
    ? moduleColor + 'AA'
    : moduleColor + 'DD';

  const iconColor = isLocked ? theme.colors.gray.medium : '#ffffff';

  return (
    <View style={styles.container}>
      {/* Connector line above (except when it's the first) */}
      <View
        style={[
          styles.connectorLine,
          {
            backgroundColor: isCompleted || isActive
              ? moduleColor + '60'
              : theme.colors.gray.light,
          },
        ]}
      />

      {/* Node */}
      <View style={styles.nodeRow}>
        {/* Left label */}
        <View style={styles.labelLeft}>
          <Text
            size="xs"
            weight="bold"
            color={isLocked ? theme.colors.gray.medium : theme.colors.text.secondary}
          >
            {String(order).padStart(2, '0')}
          </Text>
        </View>

        {/* Circle */}
        <Animated.View
          style={[
            styles.circleWrapper,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <Pressable
            onPress={isLocked ? undefined : onPress}
            style={[
              styles.circle,
              {
                backgroundColor: circleColor,
                borderColor: shadowColor,
                opacity: isLocked ? 0.5 : 1,
              },
            ]}
          >
            {isCompleted ? (
              <Feather name="check" size={22} color="#ffffff" />
            ) : isLocked ? (
              <Feather name="lock" size={20} color={iconColor} />
            ) : (
              <Feather name={icon as any} size={22} color={iconColor} />
            )}
          </Pressable>
          {isActive && (
            <View style={[styles.activeRing, { borderColor: moduleColor }]} />
          )}
        </Animated.View>

        {/* Right label */}
        <View style={styles.labelRight}>
          <Text
            size="sm"
            weight={isActive ? 'bold' : '500'}
            color={
              isLocked
                ? theme.colors.gray.medium
                : isActive
                ? theme.colors.text.primary
                : theme.colors.text.secondary
            }
            numberOfLines={2}
          >
            {title}
          </Text>
          {isCompleted && (
            <Text size="xs" color={moduleColor} weight="bold">
              ✓ Concluída
            </Text>
          )}
          {isActive && (
            <Text size="xs" color={moduleColor} weight="bold">
              ▶ Iniciar
            </Text>
          )}
        </View>
      </View>

      {/* Connector line below */}
      {!isLast && (
        <View
          style={[
            styles.connectorLine,
            {
              backgroundColor: isCompleted
                ? moduleColor + '60'
                : theme.colors.gray.light,
            },
          ]}
        />
      )}
    </View>
  );
};

const CIRCLE_SIZE = 64;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  connectorLine: {
    width: 3,
    height: 24,
    borderRadius: 2,
  },
  nodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: theme.spacing.md,
  },
  labelLeft: {
    width: 28,
    alignItems: 'flex-end',
    marginRight: 12,
  },
  circleWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeRing: {
    position: 'absolute',
    width: CIRCLE_SIZE + 12,
    height: CIRCLE_SIZE + 12,
    borderRadius: (CIRCLE_SIZE + 12) / 2,
    borderWidth: 3,
    opacity: 0.4,
  },
  labelRight: {
    flex: 1,
    marginLeft: 14,
  },
});
