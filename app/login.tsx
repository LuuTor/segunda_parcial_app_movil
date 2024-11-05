// app/login.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useRouter } from 'expo-router';
import { Input, Button, Text, Layout } from '@ui-kitten/components';
import Toast from 'react-native-toast-message';
import { showToast } from '@/utils/toastUtils';
import { useAuth } from '@/hooks/useAuth';
import { FIREBASE_APP, FIREBASE_FIRESTORE } from '../FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { currentUser, userType, loading } = useAuth();


    const handleLogin = async () => {
        try {
            // Intentar iniciar sesión con el correo y la contraseña
            await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
            showToast('success', 'Login exitoso', 'Has iniciado sesión correctamente.');

            // Obtener el usuario actual
            const currentUser = FIREBASE_AUTH.currentUser;
            if (currentUser) {
                // Obtener el documento del usuario desde Firestore
                const userDocRef = doc(FIREBASE_FIRESTORE, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();

                    // Verificar el tipo de usuario y redirigir a la ruta correspondiente
                    if (userData.userType === 'doctor') {
                        router.replace('/(tabs-doctor)');
                    } else if (userData.userType === 'paciente') {
                        router.replace('/(tabs)');
                    } else {
                        showToast('error', 'Error', 'Tipo de usuario no válido.');
                    }
                } else {
                    showToast('error', 'Error', 'No se encontró el usuario.');
                }
            }
        } catch (error: any) {
            switch (error.code) {
                case 'auth/user-not-found':
                    showToast('error', 'Usuario no encontrado', 'No hay ninguna cuenta registrada con este correo electrónico.');
                    break;
                case 'auth/wrong-password':
                    showToast('error', 'Contraseña incorrecta', 'La contraseña que has ingresado es incorrecta. Por favor, inténtalo de nuevo.');
                    break;
                case 'auth/invalid-email':
                    showToast('error', 'Correo electrónico inválido', 'El formato del correo electrónico ingresado es incorrecto.');
                    break;
                case 'auth/too-many-requests':
                    showToast('error', 'Demasiados intentos fallidos', 'Has realizado demasiados intentos de inicio de sesión. Intenta de nuevo más tarde.');
                    break;
                case 'auth/user-disabled':
                    showToast('error', 'Usuario deshabilitado', 'Tu cuenta ha sido deshabilitada. Comunícate con el soporte para más información.');
                    break;
                case 'auth/invalid-credential':
                    showToast('error', 'Credenciales inválidas', 'Las credenciales proporcionadas son inválidas. Por favor, verifica tu correo y contraseña.');
                    break;
                default:
                    showToast('error', 'Error al iniciar sesión', 'Ocurrió un error inesperado. Por favor, intenta nuevamente.');
            }
        }
    };

    return (
        <Layout style={styles.container}>
            <Text category="h1" style={styles.title}>
                Iniciar Sesión
            </Text>

            <Text category="label" style={styles.label}>Correo Electrónico</Text>
            <Input
                style={styles.input}
                placeholder="Correo Electrónico"
                value={email}
                onChangeText={setEmail}
            />

            <Text category="label" style={styles.label}>Contraseña</Text>
            <Input
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Button style={styles.button} onPress={handleLogin}>
                Iniciar Sesión
            </Button>

            <Link href="/register" style={styles.link}>
                No tienes cuenta? Regístrate
            </Link>

            <Link href="/forgotPassword" style={styles.link}>
                ¿Olvidaste tu contraseña?
            </Link>

            {/* Componente Toast para mostrar notificaciones */}
            <Toast />
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        marginBottom: 20,
    },
    label: {
        alignSelf: 'flex-start',
        marginBottom: 5,
    },
    input: {
        width: '100%',
        marginBottom: 15,
    },
    button: {
        marginTop: 20,
        width: '100%',
    },
    link: {
        marginTop: 20,
        color: '#3498db',
        textDecorationLine: 'underline',
    },
});
