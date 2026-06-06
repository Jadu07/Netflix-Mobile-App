import { Text } from 'react-native';
import { Colors, Typography as ThemeTypography } from '../constants/theme';

export const Typography = ({ 
  variant = 'body', 
  color = Colors.onDark, 
  style, 
  children, 
  numberOfLines 
}) => {
  const textStyle = {
    ...ThemeTypography[variant],
    color,
  };

  return (
    <Text 
      style={[textStyle, style]} 
      numberOfLines={numberOfLines}
    >
      {children}
    </Text>
  );
};
