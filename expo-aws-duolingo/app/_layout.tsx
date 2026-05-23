import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components/native';
import { theme } from '../src/theme';
import { useAuthStore } from '../src/store/useAuthStore';
import { ActivityIndicator, View } from 'react-native';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function NavigationGuard() {
  const { isAuthenticated, isLoading, initializeSession } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // Run session restoration on mount
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  useEffect(() => {
    if (isLoading) return;

    const segmentList = segments as string[];
    const inAuthGroup = segmentList[0] === '(auth)';
    const onRootIndex = segmentList.length === 0 || segmentList[0] === '';

    if (!isAuthenticated) {
      if (!inAuthGroup) {
        // Not logged in -> force login screen
        router.replace('/(auth)/login');
      }
    } else {
      // Logged in
      if (inAuthGroup || onRootIndex) {
        // If in login/register screens or on the root loading screen, redirect to the trail
        router.replace('/trail/expo' as any);
      }
    }
  }, [isAuthenticated, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary.base} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="course/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="trail/[courseId]" options={{ headerShown: false }} />
      <Stack.Screen name="lesson/[lessonId]" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <NavigationGuard />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
