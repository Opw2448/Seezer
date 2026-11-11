import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import { colors } from './src/lib/theme';
import PlaylistDetailScreen from './src/screens/PlaylistDetailScreen';
import { PlayerProvider } from './src/context/PlayerContext';
import MiniPlayer from './src/components/MiniPlayer';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <PlayerProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Seezer',
              headerStyle: { backgroundColor: colors.card },
              headerTintColor: colors.foreground,
              }}
            />
            <Stack.Screen
            name="PlaylistDetail"
            component={PlaylistDetailScreen}
            options={{
              title: '',
              headerStyle: { backgroundColor: colors.card },
              headerTintColor: colors.foreground,
            }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <MiniPlayer />
      </PlayerProvider>
    </SafeAreaProvider>
  );
}