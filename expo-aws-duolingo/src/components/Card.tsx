import React from 'react';
import styled from 'styled-components/native';
import { theme } from '../theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  style?: any;
}

const getCardBorderColor = (variant: 'default' | 'primary' | 'secondary' | 'accent') => {
  switch (variant) {
    case 'primary':
      return {
        border: theme.colors.primary.shadow,
        bg: theme.colors.primary.light,
      };
    case 'secondary':
      return {
        border: theme.colors.secondary.shadow,
        bg: theme.colors.secondary.light,
      };
    case 'accent':
      return {
        border: theme.colors.accent.shadow,
        bg: theme.colors.accent.light,
      };
    case 'default':
    default:
      return {
        border: theme.colors.gray.light,
        bg: theme.colors.card,
      };
  }
};

interface StyledCardProps {
  borderColor: string;
  bgColor: string;
}

const StyledCard = styled.View<StyledCardProps>`
  background-color: ${({ bgColor }: StyledCardProps) => bgColor};
  border-width: 2px;
  border-bottom-width: 4px;
  border-color: ${({ borderColor }: StyledCardProps) => borderColor};
  border-radius: ${theme.borderRadius.lg}px;
  padding: ${theme.spacing.md}px;
  margin-bottom: ${theme.spacing.md}px;
  width: 100%;
`;

export const Card: React.FC<CardProps> = ({ children, variant = 'default', style }) => {
  const colors = getCardBorderColor(variant);

  return (
    <StyledCard borderColor={colors.border} bgColor={colors.bg} style={style}>
      {children}
    </StyledCard>
  );
};
