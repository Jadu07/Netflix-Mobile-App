import { StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Rounded, Spacing } from '../constants/theme';
import { Typography } from './Typography';

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  style,
  icon
}) => {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        style
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon}
      <Typography
        variant={isPrimary ? 'button' : 'utilityButton'}
        color={isPrimary ? Colors.onPrimary : Colors.onDark}
        style={icon ? { marginLeft: Spacing.sm } : {}}
      >
        {title}
      </Typography>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Rounded.sm,
  },
  primary: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  secondary: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
  }
});
