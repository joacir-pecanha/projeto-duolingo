import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';
import { Text } from './Text';

type FeedbackState = 'idle' | 'correct' | 'incorrect';

interface FeedbackBarProps {
  state: FeedbackState;
  explanation?: string;
  onContinue: () => void;
  continueLabel?: string;
}

export const FeedbackBar: React.FC<FeedbackBarProps> = ({
  state,
  explanation,
  onContinue,
  continueLabel = 'Continuar',
}) => {
  const slideAnim = useRef(new Animated.Value(120)).current;

  useEffect(() => {
    if (state !== 'idle') {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 60,
        friction: 8,
      }).start();
    } else {
      slideAnim.setValue(120);
    }
  }, [state, slideAnim]);

  if (state === 'idle') return null;

  const isCorrect = state === 'correct';

  const bg = isCorrect ? theme.colors.primary.light : theme.colors.error.light;
  const borderColor = isCorrect ? theme.colors.primary.base : theme.colors.error.base;
  const btnBg = isCorrect ? theme.colors.primary.base : theme.colors.error.base;
  const iconName = isCorrect ? 'check-circle' : 'x-circle';
  const titleText = isCorrect ? '¡Correto! 🎉' : 'Incorreto 😅';
  const titleColor = isCorrect ? theme.colors.primary.shadow : theme.colors.error.shadow;

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: bg, borderTopColor: borderColor, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {/* Title row */}
      <View style={styles.titleRow}>
        <Feather name={iconName} size={22} color={titleColor} />
        <Text size="md" weight="800" color={titleColor} style={{ marginLeft: 8 }}>
          {titleText}
        </Text>
      </View>

      {/* Explanation */}
      {explanation && (
        <Text size="sm" variant="secondary" style={styles.explanation}>
          {explanation}
        </Text>
      )}

      {/* Continue Button */}
      <Pressable
        onPress={onContinue}
        style={[styles.continueBtn, { backgroundColor: btnBg }]}
      >
        <Text size="md" weight="bold" color="#ffffff">
          {continueLabel}
        </Text>
        <Feather name="chevron-right" size={18} color="#ffffff" style={{ marginLeft: 4 }} />
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 3,
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
    gap: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  explanation: {
    lineHeight: 20,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    marginTop: 4,
  },
});
