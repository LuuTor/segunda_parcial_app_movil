import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Layout, Text, Input, Button } from '@ui-kitten/components';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from '../FirebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter, Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '@/utils/toastUtils';
import Toast from 'react-native-toast-message';

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState(''); // Estado para el nombre
    const [whatsappNumber, setWhatsappNumber] = useState(''); // Estado para el número de WhatsApp
    const [userType, setUserType] = useState<'doctor' | 'paciente'>('paciente');
    const router = useRouter();

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            showToast('error', 'Error', 'Las contraseñas no coinciden.');
            return;
        }

        // Validar el número de WhatsApp
        const regex = /^595[0-9]{9,12}$/; // Formato: 595 seguido de 9 a 12 dígitos
        if (!regex.test(whatsappNumber)) {
            showToast('error', 'Error', 'Formato aceptado para WhatsApp: 595978654321');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
            const user = userCredential.user;

            // Actualizar el perfil del usuario en Firebase Auth
            await updateProfile(user, {
                displayName: name,
            });

            // Guardar los datos del usuario en Firestore
            await setDoc(doc(FIREBASE_FIRESTORE, 'users', user.uid), {
                userId: user.uid,
                userType: userType,
                displayName: name,
                whatsappNumber: whatsappNumber,
                createdAt: new Date(),
            });

            setUserType(userType);

            Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada correctamente.');

            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setName(""); // Limpiar el campo de nombre
            setWhatsappNumber(""); // Limpiar el campo de WhatsApp
            await AsyncStorage.setItem('userEmail', email);

            router.push('/login');
        } catch (error: any) {
            let message = 'Error desconocido';

            switch (error.code) {
                case 'auth/email-already-in-use':
                    message = 'El correo electrónico ya está en uso por otra cuenta.';
                    break;
                case 'auth/invalid-email':
                    message = 'El correo electrónico proporcionado no es válido.';
                    break;
                case 'auth/operation-not-allowed':
                    message = 'El registro de usuarios está deshabilitado temporalmente.';
                    break;
                case 'auth/weak-password':
                    message = 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
                    break;
                default:
                    message = 'Se produjo un error inesperado. Por favor, intenta de nuevo.';
            }

            Alert.alert('Error', message);
        }
    };

    return (
        <Layout style={styles.container}>
            <Text category="h1" style={styles.title}>Crear Cuenta</Text>

            <Text category="label" style={styles.label}>Nombre</Text>
            <Input
                style={styles.input}
                placeholder="Nombre"
                value={name}
                onChangeText={setName}
            />

            <Text category="label" style={styles.label}>Correo Electrónico</Text>
            <Input
                style={styles.input}
                placeholder="Correo Electrónico"
                value={email}
                onChangeText={setEmail}
            />

            <Text category="label" style={styles.label}>Número WhatsApp</Text>
            <Input
                style={styles.input}
                placeholder="(Ej. 595987654321)"
                value={whatsappNumber}
                onChangeText={setWhatsappNumber}
                keyboardType="numeric" // Solo permite entrada numérica
            />

            <Text category="label" style={styles.label}>Contraseña</Text>
            <Input
                style={styles.input}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Text category="label" style={styles.label}>Confirmar Contraseña</Text>
            <Input
                style={styles.input}
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />

            <View style={styles.userTypeContainer}>
                <Button
                    appearance={userType === 'doctor' ? 'filled' : 'outline'}
                    onPress={() => setUserType('doctor')}
                    style={styles.userTypeButton}
                >
                    Doctor
                </Button>
                <Button
                    appearance={userType === 'paciente' ? 'filled' : 'outline'}
                    onPress={() => setUserType('paciente')}
                    style={styles.userTypeButton}
                >
                    Paciente
                </Button>
            </View>

            <Button style={styles.button} onPress={handleRegister}>
                Registrarse
            </Button>

            <Link href="/login" style={styles.link}>
                ¿Ya tienes una cuenta? Inicia Sesión
            </Link>

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
        backgroundColor: '#f9f9f9',
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
    userTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginVertical: 15,
    },
    userTypeButton: {
        width: '48%',
    },
});
