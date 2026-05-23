import React from 'react';
import { Pressable, StyleSheet, View, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';
import { Text } from './Text';
import {
  Exercise,
  MultipleChoiceExercise,
  TrueFalseExercise,
  AssociationExercise,
  CompleteCodeExercise,
  OrderStepsExercise,
} from '../types/course';

interface ExerciseCardProps {
  exercise: Exercise;
  // Multiple choice / complete-code
  selectedAnswer?: number | null;
  onSelectAnswer?: (index: number) => void;
  // True-false
  selectedBool?: boolean | null;
  onSelectBool?: (val: boolean) => void;
  // Association
  associationLeft?: string | null;
  associationMatches?: Record<string, string>;
  onSelectAssociationLeft?: (item: string) => void;
  onSelectAssociationRight?: (item: string) => void;
  // Order-steps
  orderedSteps?: number[];
  onMoveStep?: (from: number, to: number) => void;
  // Feedback state (locks selection)
  feedbackState?: 'idle' | 'correct' | 'incorrect';
}

// ─── Sub-components ────────────────────────────────────────

const OptionButton: React.FC<{
  label: string;
  isSelected: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  disabled?: boolean;
  onPress: () => void;
}> = ({ label, isSelected, isCorrect, isWrong, disabled, onPress }) => {
  let bg = '#ffffff';
  let borderColor = theme.colors.border;
  let textColor = theme.colors.text.primary;

  if (isCorrect) {
    bg = theme.colors.primary.light;
    borderColor = theme.colors.primary.base;
    textColor = theme.colors.primary.shadow;
  } else if (isWrong) {
    bg = theme.colors.error.light;
    borderColor = theme.colors.error.base;
    textColor = theme.colors.error.shadow;
  } else if (isSelected) {
    bg = theme.colors.secondary.light;
    borderColor = theme.colors.secondary.base;
    textColor = theme.colors.secondary.shadow;
  }

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={[
        styles.optionBtn,
        { backgroundColor: bg, borderColor, borderBottomWidth: isSelected ? 4 : 2 },
      ]}
    >
      <Text size="sm" weight={isSelected ? 'bold' : '500'} color={textColor}>
        {label}
      </Text>
    </Pressable>
  );
};

// ─── Main Component ────────────────────────────────────────

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  selectedAnswer,
  onSelectAnswer,
  selectedBool,
  onSelectBool,
  associationLeft,
  associationMatches = {},
  onSelectAssociationLeft,
  onSelectAssociationRight,
  orderedSteps = [],
  onMoveStep,
  feedbackState = 'idle',
}) => {
  const locked = feedbackState !== 'idle';

  const renderMultipleChoice = (ex: MultipleChoiceExercise) => (
    <View style={styles.optionsList}>
      {ex.options.map((option, idx) => {
        const isSelected = selectedAnswer === idx;
        const isCorrect = locked && idx === ex.correctIndex;
        const isWrong = locked && isSelected && idx !== ex.correctIndex;
        return (
          <OptionButton
            key={idx}
            label={option}
            isSelected={isSelected}
            isCorrect={isCorrect}
            isWrong={isWrong}
            disabled={locked}
            onPress={() => onSelectAnswer?.(idx)}
          />
        );
      })}
    </View>
  );

  const renderTrueFalse = (ex: TrueFalseExercise) => {
    const trueCorrect = locked && ex.correctAnswer === true;
    const falseCorrect = locked && ex.correctAnswer === false;
    return (
      <View style={styles.tfRow}>
        <Pressable
          onPress={locked ? undefined : () => onSelectBool?.(true)}
          style={[
            styles.tfBtn,
            {
              backgroundColor:
                trueCorrect
                  ? theme.colors.primary.light
                  : selectedBool === true
                  ? theme.colors.secondary.light
                  : '#fff',
              borderColor:
                trueCorrect
                  ? theme.colors.primary.base
                  : selectedBool === true
                  ? theme.colors.secondary.base
                  : theme.colors.border,
            },
          ]}
        >
          <Feather
            name="check"
            size={20}
            color={trueCorrect ? theme.colors.primary.base : theme.colors.text.secondary}
          />
          <Text size="md" weight="bold" style={{ marginLeft: 8 }}>
            Verdadeiro
          </Text>
        </Pressable>
        <Pressable
          onPress={locked ? undefined : () => onSelectBool?.(false)}
          style={[
            styles.tfBtn,
            {
              backgroundColor:
                falseCorrect
                  ? theme.colors.primary.light
                  : selectedBool === false
                  ? theme.colors.secondary.light
                  : '#fff',
              borderColor:
                falseCorrect
                  ? theme.colors.primary.base
                  : selectedBool === false
                  ? theme.colors.secondary.base
                  : theme.colors.border,
            },
          ]}
        >
          <Feather
            name="x"
            size={20}
            color={falseCorrect ? theme.colors.primary.base : theme.colors.text.secondary}
          />
          <Text size="md" weight="bold" style={{ marginLeft: 8 }}>
            Falso
          </Text>
        </Pressable>
      </View>
    );
  };

  const renderCompleteCode = (ex: CompleteCodeExercise) => (
    <View>
      <View style={styles.codeBlock}>
        <Text size="sm" style={styles.codeText}>
          {ex.codePrefix}
        </Text>
        <View
          style={[
            styles.codeBlank,
            selectedAnswer !== null
              ? { borderColor: theme.colors.secondary.base, backgroundColor: theme.colors.secondary.light }
              : {},
          ]}
        >
          <Text size="sm" color={theme.colors.secondary.shadow} weight="bold">
            {selectedAnswer != null ? ex.options[selectedAnswer] : '___'}
          </Text>
        </View>
        <Text size="sm" style={styles.codeText}>
          {ex.codeSuffix}
        </Text>
      </View>
      <View style={styles.optionsList}>
        {ex.options.map((opt, idx) => {
          const isSelected = selectedAnswer === idx;
          const isCorrect = locked && idx === ex.correctIndex;
          const isWrong = locked && isSelected && idx !== ex.correctIndex;
          return (
            <OptionButton
              key={idx}
              label={opt}
              isSelected={isSelected}
              isCorrect={isCorrect}
              isWrong={isWrong}
              disabled={locked}
              onPress={() => onSelectAnswer?.(idx)}
            />
          );
        })}
      </View>
    </View>
  );

  const renderAssociation = (ex: AssociationExercise) => {
    const matchedRights = Object.values(associationMatches);
    return (
      <View style={styles.assocContainer}>
        {/* Left column */}
        <View style={styles.assocColumn}>
          {ex.pairs.map((pair) => {
            const isMatched = associationMatches[pair.left] !== undefined;
            const isSelected = associationLeft === pair.left;
            return (
              <Pressable
                key={pair.left}
                onPress={locked || isMatched ? undefined : () => onSelectAssociationLeft?.(pair.left)}
                style={[
                  styles.assocItem,
                  isSelected && styles.assocItemSelected,
                  isMatched && styles.assocItemMatched,
                ]}
              >
                <Text size="xs" weight="bold" color={isMatched ? theme.colors.primary.shadow : theme.colors.text.primary}>
                  {pair.left}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Arrow */}
        <View style={styles.assocArrow}>
          <Feather name="arrow-right" size={20} color={theme.colors.gray.medium} />
        </View>

        {/* Right column */}
        <View style={styles.assocColumn}>
          {ex.pairs.map((pair) => {
            const isMatched = matchedRights.includes(pair.right);
            const matchedByLeft = Object.entries(associationMatches).find(
              ([, v]) => v === pair.right
            )?.[0];
            const isCorrectMatch = locked && matchedByLeft === pair.left;
            return (
              <Pressable
                key={pair.right}
                onPress={locked || isMatched || !associationLeft ? undefined : () => onSelectAssociationRight?.(pair.right)}
                style={[
                  styles.assocItem,
                  isMatched && (isCorrectMatch ? styles.assocItemCorrect : styles.assocItemMatched),
                  !isMatched && associationLeft ? styles.assocItemHighlight : {},
                ]}
              >
                <Text size="xs" weight="bold">
                  {pair.right}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  };

  const renderOrderSteps = (ex: OrderStepsExercise) => (
    <View style={styles.optionsList}>
      {orderedSteps.map((originalIdx, displayIdx) => (
        <View key={originalIdx} style={styles.stepRow}>
          <View style={styles.stepHandle}>
            <Text size="xs" weight="bold" color={theme.colors.gray.medium}>
              {displayIdx + 1}
            </Text>
          </View>
          <View style={styles.stepContent}>
            <Text size="sm" weight="500">
              {ex.steps[originalIdx]}
            </Text>
          </View>
          <View style={styles.stepButtons}>
            {displayIdx > 0 && (
              <Pressable
                onPress={locked ? undefined : () => onMoveStep?.(displayIdx, displayIdx - 1)}
                style={styles.stepArrowBtn}
              >
                <Feather name="chevron-up" size={18} color={theme.colors.secondary.base} />
              </Pressable>
            )}
            {displayIdx < orderedSteps.length - 1 && (
              <Pressable
                onPress={locked ? undefined : () => onMoveStep?.(displayIdx, displayIdx + 1)}
                style={styles.stepArrowBtn}
              >
                <Feather name="chevron-down" size={18} color={theme.colors.secondary.base} />
              </Pressable>
            )}
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Question */}
      <Text size="lg" weight="800" style={styles.question}>
        {exercise.question}
      </Text>

      {/* Exercise-specific UI */}
      {exercise.type === 'multiple-choice' && renderMultipleChoice(exercise as MultipleChoiceExercise)}
      {exercise.type === 'true-false' && renderTrueFalse(exercise as TrueFalseExercise)}
      {exercise.type === 'complete-code' && renderCompleteCode(exercise as CompleteCodeExercise)}
      {exercise.type === 'association' && renderAssociation(exercise as AssociationExercise)}
      {exercise.type === 'order-steps' && renderOrderSteps(exercise as OrderStepsExercise)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  question: {
    marginBottom: theme.spacing.lg,
    lineHeight: 28,
  },
  optionsList: {
    gap: 10,
  },
  optionBtn: {
    borderWidth: 2,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  tfRow: {
    gap: 12,
  },
  tfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  codeBlock: {
    backgroundColor: '#1E1E1E',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  codeText: {
    fontFamily: 'monospace',
    color: '#D4D4D4',
    lineHeight: 22,
  },
  codeBlank: {
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginVertical: 4,
    alignSelf: 'flex-start',
    minWidth: 80,
    alignItems: 'center',
  },
  assocContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  assocColumn: {
    flex: 1,
    gap: 8,
  },
  assocItem: {
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    padding: 10,
    backgroundColor: '#ffffff',
    minHeight: 44,
    justifyContent: 'center',
  },
  assocItemSelected: {
    borderColor: theme.colors.secondary.base,
    backgroundColor: theme.colors.secondary.light,
  },
  assocItemMatched: {
    borderColor: theme.colors.primary.base,
    backgroundColor: theme.colors.primary.light,
  },
  assocItemCorrect: {
    borderColor: theme.colors.primary.base,
    backgroundColor: theme.colors.primary.light,
  },
  assocItemHighlight: {
    borderColor: theme.colors.accent.base,
    borderStyle: 'dashed',
  },
  assocArrow: {
    width: 24,
    alignItems: 'center',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  stepHandle: {
    width: 36,
    height: 52,
    backgroundColor: theme.colors.gray.lightest,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: theme.borderRadius.md - 2,
    borderBottomLeftRadius: theme.borderRadius.md - 2,
  },
  stepContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  stepButtons: {
    flexDirection: 'column',
    paddingRight: 8,
    gap: 2,
  },
  stepArrowBtn: {
    padding: 2,
  },
});
