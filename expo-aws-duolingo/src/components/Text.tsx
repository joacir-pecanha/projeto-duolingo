import styled from 'styled-components/native';
import { theme } from '../theme';

interface TextProps {
  size?: keyof typeof theme.fontSizes | number;
  color?: string;
  weight?: 'normal' | 'bold' | '500' | '600' | '700' | '800';
  align?: 'left' | 'center' | 'right';
  variant?: 'primary' | 'secondary' | 'light' | 'inverse' | 'success' | 'error';
}

export const Text = styled.Text<TextProps>`
  font-size: ${({ size }: TextProps) => {
    if (typeof size === 'number') return `${size}px`;
    const key = (size || 'md') as keyof typeof theme.fontSizes;
    return `${theme.fontSizes[key]}px`;
  }};
  
  font-weight: ${({ weight }: TextProps) => weight || 'normal'};
  text-align: ${({ align }: TextProps) => align || 'left'};
  
  color: ${({ color, variant }: TextProps) => {
    if (color) return color;
    switch (variant) {
      case 'secondary':
        return theme.colors.text.secondary;
      case 'light':
        return theme.colors.text.light;
      case 'inverse':
        return theme.colors.text.inverse;
      case 'success':
        return theme.colors.primary.base;
      case 'error':
        return theme.colors.error.base;
      case 'primary':
      default:
        return theme.colors.text.primary;
    }
  }};
`;
