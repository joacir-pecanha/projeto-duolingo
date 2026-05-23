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
  margin-bottom: 16px;
`;

const InstructionText = styled(Text)`
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

const SuccessBanner = styled.View`
  background-color: ${theme.colors.primary.light};
  border-width: 2px;
  border-color: ${theme.colors.primary.base};
  border-radius: ${theme.borderRadius.md}px;
  padding: ${theme.spacing.md}px;
  margin-bottom: 24px;
  width: 100%;
`;

const Divider = styled.View`
  height: 20px;
`;

export default function ForgotPassword() {
  const router = useRouter();
  const { forgotPassword, isSendingForgotPassword, forgotPasswordError, forgotPasswordSuccess } =
    useAuth();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  const validateForm = () => {
    setEmailError(null);
    const emailTrim = email.trim();

    if (!emailTrim) {
      setEmailError('O e-mail é obrigatório.');
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(emailTrim)) {
      setEmailError('Digite um e-mail válido.');
      return false;
    }

    return true;
  };

  const handleForgotPassword = async () => {
    if (!validateForm()) return;

    try {
      await forgotPassword(email.trim());
    } catch {
      // Error handled by react-query
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
            <Mascot
              expression={forgotPasswordSuccess ? 'happy' : 'studious'}
              message={
                forgotPasswordSuccess
                  ? 'Tudo certo! Dê uma olhadinha na sua caixa de entrada.'
                  : 'Não se preocupe! Acontece com os melhores desenvolvedores.'
              }
            />
          </HeaderContainer>

          <FormContainer>
            <Title size="xl" weight="800" align="center">
              RECUPERAR SENHA
            </Title>

            {!forgotPasswordSuccess ? (
              <>
                <InstructionText size="sm" color={theme.colors.text.secondary} align="center">
                  Insera seu e-mail cadastrado e enviaremos as instruções para você redefinir sua senha.
                </InstructionText>

                {forgotPasswordError && (
                  <ErrorBanner>
                    <Text weight="bold" size="sm" color={theme.colors.error.base} align="center">
                      {forgotPasswordError}
                    </Text>
                  </ErrorBanner>
                )}

                <Input
                  label="E-mail"
                  placeholder="Digite seu e-mail de cadastro"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                  error={emailError || undefined}
                  leftIcon="mail"
                  editable={!isSendingForgotPassword}
                />

                <Button
                  variant="primary"
                  onPress={handleForgotPassword}
                  loading={isSendingForgotPassword}
                >
                  Enviar Link
                </Button>

                <Divider />

                <Button
                  variant="ghost"
                  onPress={() => router.push('/(auth)/login')}
                  disabled={isSendingForgotPassword}
                >
                  Voltar ao Login
                </Button>
              </>
            ) : (
              <>
                <SuccessBanner>
                  <Text weight="bold" size="sm" color={theme.colors.primary.shadow} align="center">
                    E-mail enviado! Verifique seu lixo eletrônico ou caixa de entrada para o link de redefinição.
                  </Text>
                </SuccessBanner>

                <Button variant="secondary" onPress={() => router.push('/(auth)/login')}>
                  Voltar ao Login
                </Button>
              </>
            )}
          </FormContainer>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeContainer>
  );
}
