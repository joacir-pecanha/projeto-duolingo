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
  margin-top: ${theme.spacing.sm}px;
`;

const FormContainer = styled.View`
  padding-horizontal: ${theme.spacing.lg}px;
  width: 100%;
  margin-bottom: 24px;
`;

const Title = styled(Text)`
  margin-bottom: 20px;
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

const FooterTextLink = styled.Pressable`
  margin-top: 20px;
  align-items: center;
`;

export default function Register() {
  const router = useRouter();
  const { register, isRegistering, registerError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const validateForm = () => {
    let isValid = true;
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);

    if (!name.trim()) {
      setNameError('O nome é obrigatório.');
      isValid = false;
    }

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

    if (!confirmPassword) {
      setConfirmPasswordError('Confirme sua senha.');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('As senhas não coincidem.');
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      // Redirect is handled by NavigationGuard in _layout.tsx
    } catch {
      // Error is caught by react-query and returned as registerError
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
            <Mascot message="Crie sua conta para começar a ganhar XP e manter sua ofensiva!" />
          </HeaderContainer>

          <FormContainer>
            <Title size="xl" weight="800" align="center">
              CRIAR CONTA
            </Title>

            {registerError && (
              <ErrorBanner>
                <Text weight="bold" size="sm" color={theme.colors.error.base} align="center">
                  {registerError}
                </Text>
              </ErrorBanner>
            )}

            <Input
              label="Nome"
              placeholder="Digite seu nome completo"
              value={name}
              onChangeText={setName}
              error={nameError || undefined}
              leftIcon="user"
              editable={!isRegistering}
            />

            <Input
              label="E-mail"
              placeholder="Digite seu e-mail"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              error={emailError || undefined}
              leftIcon="mail"
              editable={!isRegistering}
            />

            <Input
              label="Senha"
              placeholder="Digite uma senha forte"
              value={password}
              onChangeText={setPassword}
              error={passwordError || undefined}
              leftIcon="lock"
              isPassword
              editable={!isRegistering}
            />

            <Input
              label="Confirmar Senha"
              placeholder="Confirme a senha digitada"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={confirmPasswordError || undefined}
              leftIcon="check-square"
              isPassword
              editable={!isRegistering}
            />

            <Button variant="primary" onPress={handleRegister} loading={isRegistering}>
              Criar minha conta
            </Button>

            <FooterTextLink onPress={() => router.push('/(auth)/login')}>
              <Text size="sm" color={theme.colors.gray.dark} weight="500">
                Já tem uma conta?{' '}
                <Text weight="bold" color={theme.colors.secondary.base}>
                  Fazer Login
                </Text>
              </Text>
            </FooterTextLink>
          </FormContainer>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeContainer>
  );
}
