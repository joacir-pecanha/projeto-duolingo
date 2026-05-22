export const theme = {
  colors: {
    primary: {
      base: '#58CC02',
      shadow: '#46A302',
      light: '#D7F5C5',
    },
    secondary: {
      base: '#1CB0F6',
      shadow: '#1899D6',
      light: '#DDF4FF',
    },
    accent: {
      base: '#FF9600',
      shadow: '#E68500',
      light: '#FFE8D1',
    },
    error: {
      base: '#EA2B2B',
      shadow: '#C21A1A',
      light: '#FFD8D8',
    },
    gray: {
      lightest: '#F7F7F7',
      light: '#E5E5E5',
      medium: '#AFAFAF',
      dark: '#777777',
      darkest: '#3C3C3C',
    },
    text: {
      primary: '#3C3C3C',
      secondary: '#777777',
      light: '#AFAFAF',
      inverse: '#FFFFFF',
    },
    background: '#FFFFFF',
    card: '#FFFFFF',
    border: '#E5E5E5',
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    round: 9999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
};

export type ThemeType = typeof theme;
