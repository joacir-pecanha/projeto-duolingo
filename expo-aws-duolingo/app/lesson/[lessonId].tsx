import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { getLessonById, getNextLessonId } from '../../src/data/courses';
import { useLesson } from '../../src/hooks/useLesson';
import { useGamification } from '../../src/hooks/useGamification';
import { useProgressStore } from '../../src/store/useProgressStore';
import { ExerciseCard } from '../../src/components/ExerciseCard';
import { FeedbackBar } from '../../src/components/FeedbackBar';
import { XPModal } from '../../src/components/XPModal';
import { ProgressBar } from '../../src/components/ProgressBar';
import { Text } from '../../src/components/Text';
import { Button } from '../../src/components/Button';
import { theme } from '../../src/theme';
import { GamificationResult } from '../../src/hooks/useGamification';

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();

  const lessonData = getLessonById(lessonId ?? '');
  const { completeLesson } = useProgressStore();
  const { processLessonCompletion, currentLevel } = useGamification();

  const [showModal, setShowModal] = useState(false);
  const [gamificationResult, setGamificationResult] = useState<GamificationResult | null>(null);

  const lessonHook = useLesson(lessonData?.lesson ?? {
    id: '',
    moduleId: '',
    title: '',
    description: '',
    icon: 'star',
    order: 0,
    xpReward: 0,
    exercises: [],
  });

  if (!lessonData) {
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Lição não encontrada.</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text color={theme.colors.secondary.base}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  const { lesson, module, course } = lessonData;

  const {
    currentExercise,
    currentExerciseIndex,
    totalExercises,
    progress,
    selectedAnswer,
    selectedBool,
    orderedSteps,
    associationLeft,
    associationMatches,
    feedback,
    correctCount,
    xpEarned,
    isFinished,
    canSubmit,
    selectAnswer,
    selectBool,
    selectAssociationLeft,
    selectAssociationRight,
    moveStep,
    checkAnswer,
    nextExercise,
    buildResult,
  } = lessonHook;

  const handleCheck = () => {
    checkAnswer();
  };

  const handleNext = async () => {
    if (isFinished || currentExerciseIndex === totalExercises - 1) {
      // Last exercise submitted — show modal
      const result = buildResult();
      await completeLesson(result);
      const gamResult = processLessonCompletion(result);
      setGamificationResult(gamResult);
      setShowModal(true);
    } else {
      nextExercise();
    }
  };

  // After completing last exercise and pressing feedback "Continuar"
  const handleFeedbackContinue = () => {
    if (currentExerciseIndex === totalExercises - 1) {
      const result = buildResult();
      completeLesson(result).then(() => {
        const gamResult = processLessonCompletion(result);
        setGamificationResult(gamResult);
        setShowModal(true);
      });
    } else {
      nextExercise();
    }
  };

  const handleModalContinue = () => {
    setShowModal(false);
    const nextId = getNextLessonId(course.id, lesson.id);
    if (nextId) {
      router.replace(`/lesson/${nextId}` as any);
    } else {
      router.replace(`/trail/${course.id}` as any);
    }
  };

  const handleExit = () => {
    Alert.alert(
      'Sair da lição?',
      'Seu progresso atual será perdido.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <View style={styles.root}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={handleExit} style={styles.exitBtn}>
          <Feather name="x" size={22} color={theme.colors.gray.dark} />
        </Pressable>

        <View style={styles.progressWrapper}>
          <ProgressBar
            progress={progress}
            color={course.color}
            height={10}
            animated
          />
        </View>

        <View style={styles.xpChip}>
          <Feather name="zap" size={12} color={theme.colors.accent.base} />
          <Text size="xs" weight="bold" style={{ marginLeft: 2 }}>
            {xpEarned} XP
          </Text>
        </View>
      </View>

      {/* Lesson info */}
      <View style={[styles.lessonInfo, { borderBottomColor: course.color + '44' }]}>
        <Text size="xs" variant="secondary" weight="500">
          {module.title} · Lição {lesson.order}
        </Text>
        <Text size="md" weight="800">
          {lesson.title}
        </Text>
      </View>

      {/* Exercise counter */}
      <View style={styles.counterRow}>
        <Text size="xs" variant="secondary">
          Questão {currentExerciseIndex + 1} de {totalExercises}
        </Text>
        <Text size="xs" weight="bold" color={course.color}>
          {currentExercise?.type === 'multiple-choice' && '📋 Múltipla Escolha'}
          {currentExercise?.type === 'true-false' && '⚖️ Verdadeiro ou Falso'}
          {currentExercise?.type === 'complete-code' && '💻 Completar Código'}
          {currentExercise?.type === 'association' && '🔗 Associação'}
          {currentExercise?.type === 'order-steps' && '📊 Ordenar Etapas'}
        </Text>
      </View>

      {/* Exercise */}
      <ScrollView
        style={styles.exerciseScroll}
        contentContainerStyle={styles.exerciseContent}
        keyboardShouldPersistTaps="handled"
      >
        {currentExercise && (
          <ExerciseCard
            exercise={currentExercise}
            selectedAnswer={selectedAnswer}
            onSelectAnswer={selectAnswer}
            selectedBool={selectedBool}
            onSelectBool={selectBool}
            associationLeft={associationLeft}
            associationMatches={associationMatches}
            onSelectAssociationLeft={selectAssociationLeft}
            onSelectAssociationRight={selectAssociationRight}
            orderedSteps={orderedSteps}
            onMoveStep={moveStep}
            feedbackState={feedback}
          />
        )}
      </ScrollView>

      {/* Submit button (only shown in idle state) */}
      {feedback === 'idle' && (
        <View style={styles.submitArea}>
          <Button
            variant={canSubmit() ? 'primary' : 'disabled'}
            onPress={canSubmit() ? handleCheck : undefined}
            disabled={!canSubmit()}
          >
            Verificar
          </Button>
        </View>
      )}

      {/* Feedback Bar (slides up after answer) */}
      <FeedbackBar
        state={feedback}
        explanation={currentExercise?.explanation}
        onContinue={handleFeedbackContinue}
        continueLabel={
          currentExerciseIndex === totalExercises - 1 ? 'Ver Resultado' : 'Continuar'
        }
      />

      {/* XP Modal on completion */}
      {gamificationResult && (
        <XPModal
          visible={showModal}
          xpEarned={gamificationResult.xpEarned}
          correctCount={correctCount}
          totalQuestions={totalExercises}
          lessonTitle={lesson.title}
          leveledUp={gamificationResult.leveledUp}
          newLevel={gamificationResult.newLevel}
          onContinue={handleModalContinue}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 52,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 10,
    gap: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  exitBtn: {
    padding: 4,
  },
  progressWrapper: {
    flex: 1,
  },
  xpChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.accent.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.round,
  },
  lessonInfo: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 2,
    gap: 2,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    backgroundColor: theme.colors.gray.lightest,
  },
  exerciseScroll: {
    flex: 1,
  },
  exerciseContent: {
    paddingTop: theme.spacing.lg,
    paddingBottom: 120, // space for feedback bar
  },
  submitArea: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    paddingTop: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});
