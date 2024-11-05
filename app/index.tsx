import React, { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Layout, Text, Button } from '@ui-kitten/components';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from '../FirebaseConfig'; // Asegúrate de importar tu configuración de Firebase
import { doc, getDoc } from 'firebase/firestore';
import { showToast } from '@/utils/toastUtils';

interface UserData {
  displayName: string;
  email: string;
  userType: string;
}

export default function HomeScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged(user => {
      setIsLoggedIn(!!user); // true si hay un usuario, false si no
    });

    // Limpiar el suscriptor cuando se desmonte el componente
    return () => unsubscribe();
  }, []);

  const handleContinue = async () => {
    const currentUser = FIREBASE_AUTH.currentUser;

    if (!currentUser) {
      showToast('error', 'Error', 'No se encontró el usuario autenticado.');
      return;
    }

    try {
      // Obtener el documento del usuario desde Firestore
      const userDocRef = doc(FIREBASE_FIRESTORE, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        showToast('error', 'Error', 'No se encontró el usuario en Firestore.');
        return;
      }

      const userData = userDoc.data() as UserData;

      // Verificar el tipo de usuario y redirigir a la ruta correspondiente
      if (userData.userType === 'doctor') {
        router.replace('/(tabs-doctor)');
      } else if (userData.userType === 'paciente') {
        router.replace('/(tabs)');
      } else {
        showToast('error', 'Error', 'Tipo de usuario no válido.');
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      showToast('error', 'Error', 'Ocurrió un error al obtener los datos del usuario.');
    }
  };

  return (
    <Layout style={styles.container}>
      <Image
        source={{ uri: 'https://www.zarla.com/images/zarla-reto-keto-1x1-2400x2400-20220329-dyp3gqpvvbh7ch3xqxxx.png?crop=1:1,smart&width=250&dpr=2' }}
        style={styles.logo}
      />
      <Text category="h1" style={styles.title}>
        Bienvenido a Nutricionista App
      </Text>
      <Text category="s1" style={styles.subtitle}>
        Tu aliado en salud y bienestar
      </Text>

      {isLoggedIn ? (
        <Button style={styles.button} onPress={handleContinue}>
          Continuar a la Aplicación
        </Button>
      ) : (
        <Link href="/login" style={styles.link}>
          <Text category="label" style={styles.linkText}>
            Ir a Login
          </Text>
        </Link>
      )}
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9', // Fondo de la pantalla
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginTop: 20,
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
  },
  linkText: {
    color: '#3498db',
    textDecorationLine: 'underline',
  },
});
