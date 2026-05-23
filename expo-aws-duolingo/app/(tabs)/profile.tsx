import React from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useAuth } from '../../src/hooks/useAuth';
import { Text } from '../../src/components/Text';
import { Card } from '../../src/components/Card';
import { Button } from '../../src/components/Button';
import { theme } from '../../src/theme';

const SafeContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${theme.colors.gray.lightest};
`;

const ProfileHeader = styled.View`
  background-color: ${theme.colors.background};
  align-items: center;
  padding: ${theme.spacing.lg}px;
  border-bottom-width: 2px;
  border-color: ${theme.colors.border};
`;

const AvatarContainer = styled.View`
  width: 80px;
  height: 80px;
  background-color: ${theme.colors.secondary.light};
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  border-width: 3px;
  border-color: ${theme.colors.secondary.base};
  margin-bottom: ${theme.spacing.sm}px;
`;

const StatsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: ${theme.spacing.md}px;
`;

const StatCard = styled(Card)`
  width: 48%;
  padding: 12px;
  align-items: center;
  margin-bottom: ${theme.spacing.md}px;
`;

const SectionTitle = styled(Text)`
  margin-left: ${theme.spacing.md}px;
  margin-bottom: ${theme.spacing.sm}px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
`;

const AchievementRow = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  border-width: 2px;
  border-bottom-width: 4px;
  border-color: ${theme.colors.border};
  border-radius: ${theme.borderRadius.md}px;
  padding: 14px;
  margin-horizontal: ${theme.spacing.md}px;
  margin-bottom: 12px;
`;

interface MedalIconContainerProps {
  unlocked: boolean;
}

const MedalIconContainer = styled.View<MedalIconContainerProps>`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${({ unlocked }: MedalIconContainerProps) =>
    unlocked ? theme.colors.accent.light : theme.colors.gray.light};
  justify-content: center;
  align-items: center;
  margin-right: 14px;
  border-width: 2px;
  border-color: ${({ unlocked }: MedalIconContainerProps) =>
    unlocked ? theme.colors.accent.base : theme.colors.gray.medium};
`;

const AchievementDetails = styled.View`
  flex: 1;
`;

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const { logout } = useAuth();

  const achievements = [
    {
      id: '1',
      title: 'Primeiros Passos',
      description: 'Concluiu a primeira aula de Expo',
      icon: 'award',
      unlocked: true,
    },
    {
      id: '2',
      title: 'Mestre da Nuvem',
      description: 'Conclua o curso completo de AWS',
      icon: 'cloud',
      unlocked: false,
    },
    {
      id: '3',
      title: 'Foco Total',
      description: 'Mantenha uma ofensiva de 5 dias',
      icon: 'zap',
      unlocked: user ? user.streak >= 5 : false,
    },
    {
      id: '4',
      title: 'Super Dev',
      description: 'Acumule 1000 XP no total',
      icon: 'cpu',
      unlocked: false,
    },
  ];

  return (
    <SafeContainer>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        <ProfileHeader>
          <AvatarContainer>
            <Feather name="user" size={44} color={theme.colors.secondary.base} />
          </AvatarContainer>
          <Text size="lg" weight="800">
            {user?.name || 'Desenvolvedor'}
          </Text>
          <Text size="sm" variant="secondary" style={{ marginBottom: 16 }}>
            {user?.email || 'email@exemplo.com'}
          </Text>
          <Button
            variant="ghost"
            style={{ width: '60%', height: 42 }}
            onPress={logout}
          >
            Sair da Conta
          </Button>
        </ProfileHeader>

        <StatsGrid>
          <StatCard>
            <Feather name="zap" size={24} color={theme.colors.accent.base} style={{ marginBottom: 6 }} />
            <Text weight="bold" size="lg">
              {user?.xp || 0}
            </Text>
            <Text size="xs" variant="secondary">
              XP Total
            </Text>
          </StatCard>

          <StatCard>
            <Feather name="activity" size={24} color={theme.colors.primary.base} style={{ marginBottom: 6 }} />
            <Text weight="bold" size="lg">
              {user?.streak || 0}
            </Text>
            <Text size="xs" variant="secondary">
              Ofensiva Diária
            </Text>
          </StatCard>
        </StatsGrid>

        <SectionTitle size="sm" variant="secondary" weight="800">
          Minhas Conquistas
        </SectionTitle>

        {achievements.map((item) => (
          <AchievementRow key={item.id}>
            <MedalIconContainer unlocked={item.unlocked}>
              <Feather
                name={item.icon as any}
                size={22}
                color={item.unlocked ? theme.colors.accent.base : theme.colors.gray.dark}
              />
            </MedalIconContainer>
            <AchievementDetails>
              <Text weight="bold" size="md" color={item.unlocked ? theme.colors.text.primary : theme.colors.text.light}>
                {item.title}
              </Text>
              <Text size="sm" variant="secondary">
                {item.description}
              </Text>
            </AchievementDetails>
            {item.unlocked ? (
              <Feather name="check-circle" size={20} color={theme.colors.primary.base} />
            ) : (
              <Feather name="lock" size={20} color={theme.colors.gray.medium} />
            )}
          </AchievementRow>
        ))}
      </ScrollView>
    </SafeContainer>
  );
}
