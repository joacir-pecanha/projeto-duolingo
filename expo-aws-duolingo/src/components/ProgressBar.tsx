import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { Text } from './Text';

interface ProgressBarProps {
  progress: number; // 0–100
  color?: string;
  trackColor?: string;
  height?: number;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = theme.colors.primary.base,
  trackColor = theme.colors.gray.light,
  height = 12,
  showLabel = false,
  label,
  animated = true,
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const clampedProgress = Math.min(100, Math.max(0, progress));
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: clampedProgress,
        duration: 600,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(clampedProgress);
    }
  }, [progress, animated, animatedWidth]);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View>
      {(showLabel || label) && (
        <View style={styles.labelRow}>
          {label && (
            <Text size="xs" variant="secondary" weight="500">
              {label}
            </Text>
          )}
          {showLabel && (
            <Text size="xs" weight="bold" color={color}>
              {Math.round(progress)}%
            </Text>
          )}
        </View>
      )}
      <View
        style={[
          styles.track,
          { backgroundColor: trackColor, height, borderRadius: height / 2 },
        ]}
      >
        <Animated.View
          style={[
            styles.fill,
            {
              width: widthInterpolated,
              backgroundColor: color,
              borderRadius: height / 2,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
});
