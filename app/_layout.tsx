import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { ApplicationProvider } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';
import Toast from 'react-native-toast-message'; // Importa Toast


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme(); // Detecta si el esquema de color es oscuro o claro
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const hideSplashScreen = async () => {
      if (loaded) {
        await SplashScreen.hideAsync();
      }
    };
    hideSplashScreen();
  }, [loaded]);

  if (!loaded) {
    return null;
  }
// aqui se deben declarar los componentes que se van a estar usando en la app, como por ejemplo el toast
  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      {/* <ApplicationProvider {...eva} theme={colorScheme === 'dark' ? eva.dark : eva.light}> */}
      <ApplicationProvider {...eva} theme={ eva.light}>
        <ThemeProvider value={DefaultTheme}>
        {/* <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}> */}
          <View style={{ flex: 1 }}>
            {/* Definir el layout de Stack */}
            <Stack>
              {/* Pantallas que se usarán */}
              <Stack.Screen name="index" options={{ title: 'Inicio', headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Panel del Paciente' }} />
              <Stack.Screen name="(tabs-doctor)" options={{ headerShown: false, title: 'Panel de Doctor' }} />

              <Stack.Screen name="editProfile" options={{ title: 'Editar Perfil' }} />
              
              <Stack.Screen name="register" options={{ title: 'Registrarse' }} />
              <Stack.Screen name="login" options={{ title: 'Iniciar sesión'}} />
              <Stack.Screen name="forgotPassword" options={{ title: 'Recuperar contraseña'}} />
              
              <Stack.Screen name="screens/editPatient" options={{ title: 'Editar Paciente' }} />
              <Stack.Screen name="screens/viewPatient" options={{ title: 'Ver Paciente' }} />
              <Stack.Screen name="screens/addPatient" options={{ title: 'Agregar Paciente' }} />
              <Stack.Screen name="screens/addConsultation" options={{ title: 'Agregar Consulta' }} />
              <Stack.Screen name="screens/myConsultations" options={{ title: 'Mis consultas' }} />
              <Stack.Screen name="screens/viewConsultation" options={{ title: 'Ver Consulta' }} />
              {/* Puedes agregar más pantallas aquí */}
            </Stack>
          </View>
        </ThemeProvider>
      </ApplicationProvider>
      <Toast />
    </View>
  );
}
