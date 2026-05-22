import React from 'react';
import styled from 'styled-components/native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';
import { Text } from './Text';

interface MascotProps {
  message?: string;
  expression?: 'happy' | 'studious' | 'surprised';
}

const Container = styled.View`
  align-items: center;
  justify-content: center;
  margin-vertical: ${theme.spacing.lg}px;
  width: 100%;
`;

const MascotBody = styled.View`
  width: 84px;
  height: 84px;
  background-color: ${theme.colors.primary.base};
  border-radius: 42px;
  border-width: 4px;
  border-bottom-width: 8px;
  border-color: ${theme.colors.primary.shadow};
  justify-content: center;
  align-items: center;
  position: relative;
`;

const EyeRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 44px;
  margin-bottom: 4px;
`;

const Eye = styled.View`
  width: 16px;
  height: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
`;

interface PupilProps {
  expression: string;
}

const Pupil = styled.View<PupilProps>`
  width: 8px;
  height: 8px;
  background-color: ${theme.colors.text.primary};
  border-radius: 4px;
  transform: ${({ expression }: PupilProps) => {
    if (expression === 'studious') return 'translateY(1px)';
    return 'none';
  }};
`;

const Beak = styled.View`
  width: 12px;
  height: 8px;
  background-color: ${theme.colors.accent.base};
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
`;

const Badge = styled.View`
  position: absolute;
  bottom: -4px;
  right: -4px;
  background-color: ${theme.colors.secondary.base};
  border-width: 2px;
  border-color: #ffffff;
  border-radius: 12px;
  width: 26px;
  height: 26px;
  justify-content: center;
  align-items: center;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.2;
  shadow-radius: 1.41px;
`;

const SpeechBubble = styled.View`
  background-color: #ffffff;
  border-width: 2px;
  border-color: ${theme.colors.border};
  border-radius: ${theme.borderRadius.md}px;
  padding-horizontal: ${theme.spacing.md}px;
  padding-vertical: ${theme.spacing.sm}px;
  margin-top: ${theme.spacing.md}px;
  max-width: 85%;
  align-items: center;
  position: relative;
`;

const SpeechBubbleArrow = styled.View`
  position: absolute;
  top: -10px;
  left: 50%;
  margin-left: -5px;
  width: 0;
  height: 0;
  border-left-width: 8px;
  border-left-color: transparent;
  border-right-width: 8px;
  border-right-color: transparent;
  border-bottom-width: 10px;
  border-bottom-color: ${theme.colors.border};
`;

const SpeechBubbleArrowInner = styled.View`
  position: absolute;
  top: -7px;
  left: 50%;
  margin-left: -4px;
  width: 0;
  height: 0;
  border-left-width: 7px;
  border-left-color: transparent;
  border-right-width: 7px;
  border-right-color: transparent;
  border-bottom-width: 9px;
  border-bottom-color: #ffffff;
`;

export const Mascot: React.FC<MascotProps> = ({ message, expression = 'happy' }) => {
  return (
    <Container>
      <MascotBody>
        <EyeRow>
          <Eye>
            <Pupil expression={expression} />
          </Eye>
          <Eye>
            <Pupil expression={expression} />
          </Eye>
        </EyeRow>
        <Beak />
        <Badge>
          <Feather name="cloud" size={14} color="#ffffff" />
        </Badge>
      </MascotBody>

      {message && (
        <SpeechBubble>
          <SpeechBubbleArrow />
          <SpeechBubbleArrowInner />
          <Text weight="bold" size="sm" align="center" color={theme.colors.text.primary}>
            {message}
          </Text>
        </SpeechBubble>
      )}
    </Container>
  );
};
