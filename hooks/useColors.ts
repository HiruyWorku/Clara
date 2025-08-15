import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';

export function useColors() {
  const colorScheme = useColorScheme();
  return Colors[colorScheme === 'dark' ? 'dark' : 'light'];
}
