// app/forgot-password.tsx
import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { Input, Button, Text, Layout } from '@ui-kitten/components';
import Toast from 'react-native-toast-message';
import { showToast } from '@/utils/toastUtils';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const router = useRouter();

    const handlePasswordReset = async () => {
        try {
            await sendPasswordResetEmail(FIREBASE_AUTH, email);
            Alert.alert("Correo enviado", `Revisa la bandeja de entrada de ${email} para restablecer tu contraseña.`);
            router.back(); // Redirige al login después de enviar el correo
        } catch (error: any) {
            let message = 'Error desconocido.';

            switch (error.code) {
                case 'auth/invalid-email':
                    message = 'El formato del correo electrónico no es válido. Verifica la dirección ingresada.';
                    break;
                case 'auth/user-not-found':
                    message = 'No existe ningún usuario registrado con este correo electrónico.';
                    break;
                case 'auth/too-many-requests':
                    message = 'Has intentado demasiadas veces en un corto período. Intenta nuevamente más tarde.';
                    break;
                default:
                    message = 'Se produjo un error inesperado. Por favor, intenta de nuevo.';
            }

            Alert.alert("Error al enviar correo", message);
        }
    };

    return (
        <Layout style={styles.container}>
            <Text category="h1" style={styles.title}>
                Recuperar Contraseña
            </Text>

            <Text category="label" style={styles.label}>Correo Electrónico</Text>
            <Input
                style={styles.input}
                placeholder="Ingresa tu correo electrónico"
                value={email}
                onChangeText={setEmail}
            />

            <Button style={styles.button} onPress={handlePasswordReset}>
                Enviar enlace de recuperación
            </Button>

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
});
