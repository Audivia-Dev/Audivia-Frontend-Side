import { COLORS } from '@/constants/theme';
import '../global.css';
import 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import InitialLayout from '@/components/InitialLayout';
import ClerkAndConvexProvider from '@/providers/ClerkAndConvexProvider';


export default function RootLayout() {

  return (
    <ClerkAndConvexProvider>
      <SafeAreaProvider>
        <SafeAreaView>
          <InitialLayout/>
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkAndConvexProvider>
   
  );
}
