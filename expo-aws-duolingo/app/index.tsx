import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { theme } from '../src/theme';

export default function Index() {
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
