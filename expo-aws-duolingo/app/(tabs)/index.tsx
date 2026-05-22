import React from 'react';
import { ScrollView, View } from 'react-native';
import styled from 'styled-components/native';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useAuth } from '../../src/hooks/useAuth';
import { Mascot } from '../../src/components/Mascot';
import { Text } from '../../src/components/Text';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { theme } from '../../src/theme';

const SafeContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${theme.colors.gray.lightest};
`;

const Header = styled.View`
  background-color: ${theme.colors.background};
  border-bottom-width: 2px;
  border-color: ${theme.colors.border};
  padding: ${theme.spacing.md}px;
`;

const ProfileRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const StatsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${theme.colors.gray.lightest};
  padding: 10px;
  border-radius: ${theme.borderRadius.md}px;
  border-width: 1px;
  border-color: ${theme.colors.border};
`;

const StatItem = styled.View`
  flex-direction: row;
  align-items: center;
`;

const BodyContainer = styled.View`
  padding: ${theme.spacing.md}px;
`;

const SectionTitle = styled(Text)`
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
`;

const ProgressBarBackground = styled.View`
  height: 12px;
  background-color: ${theme.colors.gray.light};
  border-radius: 6px;
  margin-vertical: 10px;
  width: 100%;
  overflow: hidden;
`;

interface ProgressBarFillProps {
  progress: number;
  color: string;
}

const ProgressBarFill = styled.View<ProgressBarFillProps>`
  height: 100%;
  width: ${({ progress }: ProgressBarFillProps) => `${progress}%`};
  background-color: ${({ color }: ProgressBarFillProps) => color};
  border-radius: 6px;
`;

const CourseHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuth();

  return (
    <SafeContainer>
      <Header>
        <ProfileRow>
          <View>
            <Text size="sm" variant="secondary" weight="500">
              Bem-vindo de volta,
            </Text>
            <Text size="lg" weight="800">
              {user?.name || 'Desenvolvedor'}
            </Text>
          </View>
          <Button
            variant="ghost"
            style={{ width: 'auto', height: 42, paddingHorizontal: 12 }}
            onPress={logout}
          >
            <Feather name="log-out" size={18} color={theme.colors.error.base} />
          </Button>
        </ProfileRow>

        <StatsRow>
          <StatItem>
            <Feather name="zap" size={18} color={theme.colors.accent.base} style={{ marginRight: 6 }} />
            <Text weight="bold" size="sm">
              {user?.xp || 0} XP
            </Text>
          </StatItem>
          <StatItem>
            <Feather name="award" size={18} color={theme.colors.secondary.base} style={{ marginRight: 6 }} />
            <Text weight="bold" size="sm">
              Nível {user?.level || 1}
            </Text>
          </StatItem>
          <StatItem>
            <Feather name="activity" size={18} color={theme.colors.primary.base} style={{ marginRight: 6 }} />
            <Text weight="bold" size="sm">
              🔥 {user?.streak || 0} dias
            </Text>
          </StatItem>
        </StatsRow>
      </Header>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <BodyContainer>
          <Mascot
            expression="happy"
            message={`Que excelente ver você aqui, ${
              user?.name?.split(' ')[0] || 'dev'
            }! Qual trilha tecnológica vamos vencer hoje?`}
          />

          <SectionTitle size="sm" variant="secondary" weight="800">
            Minhas Trilhas
          </SectionTitle>

          {/* Course 1 Card */}
          <Card>
            <CourseHeader>
              <Text size="md" weight="800" color={theme.colors.primary.shadow}>
                Curso 1: Expo Framework
              </Text>
              <Text size="xs" weight="bold" color={theme.colors.primary.base}>
                25% concluído
              </Text>
            </CourseHeader>
            <Text size="sm" variant="secondary">
              Aprenda a construir aplicativos móveis profissionais de alta performance nativos para Android e iOS a partir de um único código TypeScript.
            </Text>

            <ProgressBarBackground>
              <ProgressBarFill progress={25} color={theme.colors.primary.base} />
            </ProgressBarBackground>

            <Button
              variant="primary"
              style={{ marginTop: 10 }}
              onPress={() => console.log('Iniciar trilha Expo')}
            >
              Continuar Aprendizado
            </Button>
          </Card>

          {/* Course 2 Card */}
          <Card>
            <CourseHeader>
              <Text size="md" weight="800" color={theme.colors.secondary.shadow}>
                Curso 2: AWS Cloud Computing
              </Text>
              <Text size="xs" weight="bold" color={theme.colors.secondary.base}>
                0% concluído
              </Text>
            </CourseHeader>
            <Text size="sm" variant="secondary">
              Domine os conceitos fundamentais da nuvem Amazon Web Services. Entenda IAM, S3, EC2, Lambdas, APIs sem servidor e banco de dados DynamoDB.
            </Text>

            <ProgressBarBackground>
              <ProgressBarFill progress={0} color={theme.colors.secondary.base} />
            </ProgressBarBackground>

            <Button
              variant="secondary"
              style={{ marginTop: 10 }}
              onPress={() => console.log('Iniciar trilha AWS')}
            >
              Começar Trilha
            </Button>
          </Card>
        </BodyContainer>
      </ScrollView>
    </SafeContainer>
  );
}
