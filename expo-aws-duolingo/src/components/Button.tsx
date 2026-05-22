import React, { useState } from 'react';
import { Pressable, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../theme';
import { Text } from './Text';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'error' | 'ghost' | 'disabled';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: any;
}

const getVariantColors = (variant: ButtonVariant) => {
  switch (variant) {
    case 'secondary':
      return {
        bg: theme.colors.secondary.base,
        shadow: theme.colors.secondary.shadow,
        text: theme.colors.text.inverse,
      };
    case 'accent':
      return {
        bg: theme.colors.accent.base,
        shadow: theme.colors.accent.shadow,
        text: theme.colors.text.inverse,
      };
    case 'error':
      return {
        bg: theme.colors.error.base,
        shadow: theme.colors.error.shadow,
        text: theme.colors.text.inverse,
      };
    case 'ghost':
      return {
        bg: 'transparent',
        shadow: 'transparent',
        text: theme.colors.secondary.base,
        border: theme.colors.border,
      };
    case 'disabled':
      return {
        bg: theme.colors.gray.light,
        shadow: theme.colors.gray.light,
        text: theme.colors.gray.medium,
      };
    case 'primary':
    default:
      return {
        bg: theme.colors.primary.base,
        shadow: theme.colors.primary.shadow,
        text: theme.colors.text.inverse,
      };
  }
};

const ButtonContainer = styled.View`
  height: 52px;
  position: relative;
  width: 100%;
`;

interface ShadowLayerProps {
  bgColor: string;
  borderRadius: number;
}

const ShadowLayer = styled.View<ShadowLayerProps>`
  position: absolute;
  top: 4px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ bgColor }: ShadowLayerProps) => bgColor};
  border-radius: ${({ borderRadius }: ShadowLayerProps) => `${borderRadius}px`};
`;

interface ContentLayerProps {
  bgColor: string;
  borderColor?: string;
  borderRadius: number;
  isPressed: boolean;
}

const ContentLayer = styled.View<ContentLayerProps>`
  position: absolute;
  top: ${({ isPressed }: ContentLayerProps) => (isPressed ? '4px' : '0px')};
  left: 0;
  right: 0;
  height: 48px;
  background-color: ${({ bgColor }: ContentLayerProps) => bgColor};
  border-radius: ${({ borderRadius }: ContentLayerProps) => `${borderRadius}px`};
  border-width: ${({ borderColor }: ContentLayerProps) => (borderColor ? '2px' : '0px')};
  border-color: ${({ borderColor }: ContentLayerProps) => borderColor || 'transparent'};
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const activeVariant = disabled || loading ? 'disabled' : variant;
  const colors = getVariantColors(activeVariant);
  const borderRadius = theme.borderRadius.md;

  const handlePressIn = () => {
    if (!disabled && !loading) {
      setIsPressed(true);
    }
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  return (
    <Pressable
      onPress={disabled || loading ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[{ width: '100%' }, style]}
    >
      <ButtonContainer>
        {/* Only show shadow layer for non-ghost and non-pressed buttons */}
        {variant !== 'ghost' && !isPressed && (
          <ShadowLayer bgColor={colors.shadow} borderRadius={borderRadius} />
        )}
        <ContentLayer
          bgColor={colors.bg}
          borderColor={colors.border}
          borderRadius={borderRadius}
          isPressed={isPressed}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.text} />
          ) : typeof children === 'string' ? (
            <Text
              weight="bold"
              size="md"
              color={colors.text}
              style={{ textTransform: 'uppercase', letterSpacing: 0.8 }}
            >
              {children}
            </Text>
          ) : (
            children
          )}
        </ContentLayer>
      </ButtonContainer>
    </Pressable>
  );
};
