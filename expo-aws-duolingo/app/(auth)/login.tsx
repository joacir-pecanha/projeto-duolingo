import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import styled from 'styled-components/native';
import { useAuth } from '../../src/hooks/useAuth';
import { Mascot } from '../../src/components/Mascot';
import { Text } from '../../src/components/Text';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { theme } from '../../src/theme';

const SafeContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const HeaderContainer = styled.View`
  align-items: center;
  margin-top: ${theme.spacing.md}px;
`;

const FormContainer = styled.View`
  padding-horizontal: ${theme.spacing.lg}px;
  width: 100%;
`;

const Title = styled(Text)`
  margin-bottom: 24px;
`;

const ForgotPasswordLink = styled.Pressable`
  align-self: flex-end;
  margin-bottom: 24px;
`;

const ErrorBanner = styled.View`
  background-color: ${theme.colors.error.light};
  border-width: 2px;
  border-color: ${theme.colors.error.base};
  border-radius: ${theme.borderRadius.md}px;
  padding: ${theme.spacing.md}px;
  margin-bottom: 20px;
  width: 100%;
`;

const Divider = styled.View`
  height: 20px;
`;

export default function Login() {
  const router = useRouter();
  const { login, isLoggingIn, loginError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validateForm = () => {
    let isValid = true;
    setEmailError(null);
    setPasswordError(null);

    const emailTrim = email.trim();
    if (!emailTrim) {
      setEmailError('O e-mail é obrigatório.');
      isValid = false;
    } else {
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(emailTrim)) {
        setEmailError('Digite um e-mail válido.');
        isValid = false;
      }
    }

    if (!password) {
      setPasswordError('A senha é obrigatória.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('A senha deve ter no mínimo 6 caracteres.');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      await login({ email: email.trim(), password });
      // Redirect is handled by NavigationGuard in _layout.tsx
    } catch {
      // Error is caught by react-query and returned as loginError
    }
  };

  return (
    <SafeContainer>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
        >
          <HeaderContainer>
            <Mascot message="Olá! Pronto para dominar Expo e AWS hoje?" />
          </HeaderContainer>

          <FormContainer>
            <Title size="xl" weight="800" align="center">
              ENTRAR
            </Title>

            {loginError && (
              <ErrorBanner>
                <Text weight="bold" size="sm" color={theme.colors.error.base} align="center">
                  {loginError}
                </Text>
              </ErrorBanner>
            )}

            <Input
              label="E-mail"
              placeholder="Digite seu e-mail"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              error={emailError || undefined}
              leftIcon="mail"
              editable={!isLoggingIn}
            />

            <Input
              label="Senha"
              placeholder="Digite sua senha"
              value={password}
              onChangeText={setPassword}
              error={passwordError || undefined}
              leftIcon="lock"
              isPassword
              editable={!isLoggingIn}
            />

            <ForgotPasswordLink onPress={() => router.push('/(auth)/forgot-password')}>
              <Text weight="bold" size="sm" color={theme.colors.secondary.base}>
                Esqueci minha senha
              </Text>
            </ForgotPasswordLink>

            <Button variant="primary" onPress={handleLogin} loading={isLoggingIn}>
              Entrar
            </Button>

            <Divider />

            <Button
              variant="ghost"
              onPress={() => router.push('/(auth)/register')}
              disabled={isLoggingIn}
            >
              Criar Conta
            </Button>
          </FormContainer>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeContainer>
  );
}
