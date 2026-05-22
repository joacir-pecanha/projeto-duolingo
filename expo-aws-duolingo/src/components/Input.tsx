import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import styled from 'styled-components/native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';
import { Text } from './Text';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Feather.glyphMap;
  isPassword?: boolean;
}

const Container = styled.View`
  width: 100%;
  margin-bottom: 16px;
`;

const LabelText = styled(Text)`
  margin-bottom: 6px;
  font-weight: bold;
`;

interface InputWrapperProps {
  isFocused: boolean;
  hasError: boolean;
}

const InputWrapper = styled.View<InputWrapperProps>`
  flex-direction: row;
  align-items: center;
  height: 52px;
  border-width: 2px;
  border-radius: ${theme.borderRadius.md}px;
  background-color: ${theme.colors.gray.lightest};
  padding-horizontal: 14px;
  
  border-color: ${({ isFocused, hasError }: InputWrapperProps) => {
    if (hasError) return theme.colors.error.base;
    if (isFocused) return theme.colors.secondary.base;
    return theme.colors.gray.light;
  }};
`;

const StyledTextInput = styled.TextInput`
  flex: 1;
  height: 100%;
  color: ${theme.colors.text.primary};
  font-size: ${theme.fontSizes.md}px;
  padding-vertical: 8px;
`;

const IconButton = styled.Pressable`
  padding: 4px;
`;

const ErrorText = styled(Text)`
  margin-top: 4px;
`;

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  isPassword = false,
  secureTextEntry,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isSecure = isPassword && !showPassword;

  return (
    <Container style={style}>
      {label && (
        <LabelText size="sm" variant="secondary">
          {label}
        </LabelText>
      )}
      <InputWrapper isFocused={isFocused} hasError={!!error}>
        {leftIcon && (
          <Feather
            name={leftIcon}
            size={20}
            color={
              error
                ? theme.colors.error.base
                : isFocused
                ? theme.colors.secondary.base
                : theme.colors.gray.medium
            }
            style={{ marginRight: 10 }}
          />
        )}
        <StyledTextInput
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isSecure}
          placeholderTextColor={theme.colors.gray.medium}
          autoCapitalize="none"
          {...props}
        />
        {isPassword && (
          <IconButton onPress={() => setShowPassword((prev) => !prev)}>
            <Feather
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={theme.colors.gray.medium}
            />
          </IconButton>
        )}
      </InputWrapper>
      {error && (
        <ErrorText size="xs" variant="error" weight="500">
          {error}
        </ErrorText>
      )}
    </Container>
  );
};
