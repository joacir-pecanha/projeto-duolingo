import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { authService } from '../services/auth';
import { useAuthStore } from '../store/useAuthStore';

export const useAuth = () => {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: async (data) => {
      await setSession(data.user, data.token);
      router.replace('/trail/expo' as any);
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ name, email, password }: { name: string; email: string; password: string }) =>
      authService.register(name, email, password),
    onSuccess: async (data) => {
      await setSession(data.user, data.token);
      router.replace('/trail/expo' as any);
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });

  const logout = async () => {
    await clearSession();
  };

  return {
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error ? (loginMutation.error as Error).message : null,

    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error ? (registerMutation.error as Error).message : null,

    forgotPassword: forgotPasswordMutation.mutateAsync,
    isSendingForgotPassword: forgotPasswordMutation.isPending,
    forgotPasswordError: forgotPasswordMutation.error
      ? (forgotPasswordMutation.error as Error).message
      : null,
    forgotPasswordSuccess: forgotPasswordMutation.isSuccess,

    logout,
  };
};
