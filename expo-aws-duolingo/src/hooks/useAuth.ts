import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth';
import { useAuthStore } from '../store/useAuthStore';

export const useAuth = () => {
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (data) => {
      setSession(data.user, data.token);
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ name, email, password }: { name: string; email: string; password: string }) =>
      authService.register(name, email, password),
    onSuccess: (data) => {
      setSession(data.user, data.token);
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
