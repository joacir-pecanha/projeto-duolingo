import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';
import { Text } from './Text';
import { ProgressBar } from './ProgressBar';

interface XPModalProps {
  visible: boolean;
  xpEarned: number;
  correctCount: number;
  totalQuestions: number;
  lessonTitle: string;
  leveledUp?: boolean;
  newLevel?: number;
  onContinue: () => void;
}

export const XPModal: React.FC<XPModalProps> = ({
  visible,
  xpEarned,
  correctCount,
  totalQuestions,
  lessonTitle,
  leveledUp = false,
  newLevel,
  onContinue,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const xpCountAnim = useRef(new Animated.Value(0)).current;
  const [displayXP, setDisplayXP] = React.useState(0);

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0.7);
      opacityAnim.setValue(0);
      xpCountAnim.setValue(0);

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 6,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(xpCountAnim, {
          toValue: xpEarned,
          duration: 1200,
          useNativeDriver: false,
        }),
      ]).start();

      const listener = xpCountAnim.addListener(({ value }) => {
        setDisplayXP(Math.round(value));
      });
      return () => xpCountAnim.removeListener(listener);
    }
  }, [visible, xpEarned, scaleAnim, opacityAnim, xpCountAnim]);

  const accuracy = totalQuestions > 0
    ? Math.round((correctCount / totalQuestions) * 100)
    : 0;

  const getAccuracyColor = () => {
    if (accuracy >= 80) return theme.colors.primary.base;
    if (accuracy >= 50) return theme.colors.accent.base;
    return theme.colors.error.base;
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.card,
            { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
          ]}
        >
          {/* Trophy */}
          <View style={styles.trophyContainer}>
            <View style={styles.trophyCircle}>
              <Text style={{ fontSize: 52 }}>🏆</Text>
            </View>
          </View>

          <Text size="xl" weight="800" align="center" style={{ marginBottom: 4 }}>
            Lição Concluída!
          </Text>
          <Text size="sm" variant="secondary" align="center" style={{ marginBottom: 20 }}>
            {lessonTitle}
          </Text>

          {/* XP Earned */}
          <View style={styles.xpBadge}>
            <Feather name="zap" size={20} color={theme.colors.accent.base} />
            <Text size="xl" weight="800" color={theme.colors.accent.base} style={{ marginLeft: 6 }}>
              +{displayXP} XP
            </Text>
          </View>

          {/* Level up badge */}
          {leveledUp && (
            <View style={styles.levelUpBadge}>
              <Feather name="award" size={14} color="#ffffff" />
              <Text size="xs" weight="bold" color="#ffffff" style={{ marginLeft: 4 }}>
                Level Up! → Nível {newLevel}
              </Text>
            </View>
          )}

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text size="lg" weight="800" color={theme.colors.primary.base}>
                {correctCount}
              </Text>
              <Text size="xs" variant="secondary">
                Acertos
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text size="lg" weight="800" color={getAccuracyColor()}>
                {accuracy}%
              </Text>
              <Text size="xs" variant="secondary">
                Precisão
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text size="lg" weight="800" color={theme.colors.secondary.base}>
                {totalQuestions}
              </Text>
              <Text size="xs" variant="secondary">
                Questões
              </Text>
            </View>
          </View>

          {/* Accuracy bar */}
          <View style={{ marginBottom: 20 }}>
            <ProgressBar
              progress={accuracy}
              color={getAccuracyColor()}
              height={10}
              animated
            />
          </View>

          {/* Continue Button */}
          <Pressable style={styles.continueBtn} onPress={onContinue}>
            <Text size="md" weight="bold" color="#ffffff">
              Continuar
            </Text>
            <Feather name="chevron-right" size={18} color="#ffffff" style={{ marginLeft: 6 }} />
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  trophyContainer: {
    marginBottom: 16,
  },
  trophyCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.colors.accent.light,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.accent.base,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.accent.light,
    borderWidth: 2,
    borderColor: theme.colors.accent.base,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.round,
    marginBottom: 12,
  },
  levelUpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary.base,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.round,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.gray.lightest,
    borderRadius: theme.borderRadius.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary.base,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: theme.borderRadius.md,
    width: '100%',
  },
});
