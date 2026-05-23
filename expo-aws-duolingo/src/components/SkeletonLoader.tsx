import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { theme } from '../theme';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: object;
}

const SkeletonItem: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
}) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [shimmer]);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.8],
  });

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: theme.colors.gray.light,
          opacity,
        },
        style,
      ]}
    />
  );
};

// ─── Preset skeletons ────────────────────────────────────────

export const SkeletonCard: React.FC = () => (
  <View style={styles.card}>
    <View style={styles.bannerSkeleton} />
    <View style={styles.cardBody}>
      <SkeletonItem width="80%" height={20} style={{ marginBottom: 8 }} />
      <SkeletonItem width="100%" height={12} style={{ marginBottom: 4 }} />
      <SkeletonItem width="60%" height={12} style={{ marginBottom: 16 }} />
      <SkeletonItem width="100%" height={12} borderRadius={6} style={{ marginBottom: 16 }} />
      <View style={styles.btnRow}>
        <SkeletonItem width="35%" height={38} borderRadius={12} />
        <SkeletonItem width="40%" height={38} borderRadius={12} />
      </View>
    </View>
  </View>
);

export const SkeletonText: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <View style={{ gap: 8 }}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonItem key={i} width={i === lines - 1 ? '60%' : '100%'} height={14} />
    ))}
  </View>
);

export { SkeletonItem };

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  bannerSkeleton: {
    height: 80,
    backgroundColor: theme.colors.gray.light,
  },
  cardBody: {
    padding: theme.spacing.md,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
