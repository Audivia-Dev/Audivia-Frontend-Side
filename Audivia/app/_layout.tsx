import '../global.css';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/contexts/AuthContext';
import LayoutContent from '@/contexts/LayoutContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <LayoutContent/>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
