import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from '../FirebaseConfig';
import { updateProfile as updateUserProfile, updatePassword as updateUserPassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { useRouter } from 'expo-router';
import { Button, Input, Layout, Text } from '@ui-kitten/components';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const ProfileScreen: React.FC = () => {
    const router = useRouter();

    const user = FIREBASE_AUTH.currentUser;
    const [name, setName] = useState<string>(user?.displayName || '');
    const [password, setPassword] = useState<string>('');
    const [currentPassword, setCurrentPassword] = useState<string>(''); // Estado para la contraseña actual
    const [whatsappNumber, setWhatsappNumber] = useState<string>(''); // Estado para el número de WhatsApp

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const db = getFirestore();
                const userDoc = await getDoc(doc(db, 'users', user.uid));

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setName(userData?.displayName || '');
                    setWhatsappNumber(userData?.whatsappNumber || ''); // Obtener el número de WhatsApp
                }
            }
        };

        fetchUserData();
    }, [user]);

    // Función para validar el número de WhatsApp
    const validateWhatsAppNumber = (number: string) => {
        const regex = /^595[0-9]{9,12}$/; // Formato: 595 seguido de 9 a 12 dígitos
        return regex.test(number);
    };

    const reauthenticate = async (currentPassword: string) => {
        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        const credential = EmailAuthProvider.credential(user.email!, currentPassword);
        try {
            // Usar reauthenticateWithCredential aquí
            await reauthenticateWithCredential(user, credential);
            return true; // Reautenticación exitosa
        } catch (error) {
            console.error('Error de reautenticación:', error);
            return false; // Falló la reautenticación
        }
    };

    const updateProfile = async () => {
        if (!validateWhatsAppNumber(whatsappNumber)) {
            Alert.alert('Error', 'Formato aceptado para WhatsApp 595978654321');
            return;
        }

        try {
            if (user) {
                await updateUserProfile(user, {
                    displayName: name,
                });

                // Actualizar el número de WhatsApp en Firestore
                await setDoc(doc(FIREBASE_FIRESTORE, 'users', user.uid), {
                    displayName: name,
                    whatsappNumber: whatsappNumber, // Guardar solo el número
                }, { merge: true });

                Alert.alert('Perfil actualizado con éxito', '', [
                    {
                        text: 'Aceptar',
                        onPress: () => router.push('/(tabs)/profile'),
                    },
                ]);
            } else {
                Alert.alert('Error', 'No hay usuario autenticado.');
            }
        } catch (error) {
            const errorMessage = error instanceof FirebaseError ? error.message : 'Error desconocido';
            Alert.alert('Error', errorMessage);
        }
    };

    const updatePassword = async () => {
        if (password.length < 6) {
            Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        // Intentar reautenticar al usuario
        const isReauthenticated = await reauthenticate(currentPassword);
        if (!isReauthenticated) {
            Alert.alert('Error', 'La reautenticación falló. Verifica tu contraseña actual.');
            return;
        }

        try {
            if (user) {
                await updateUserPassword(user, password); // Utiliza la función updatePassword importada
                Alert.alert('Contraseña actualizada con éxito', '', [
                    {
                        text: 'Aceptar',
                        onPress: () => router.push('/(tabs)/profile'), // Navegar de regreso a la pantalla de perfil
                    },
                ]);
                setPassword('');
                setCurrentPassword(''); // Limpiar la contraseña actual después de actualizar
            } else {
                Alert.alert('Error', 'No hay usuario autenticado.');
            }
        } catch (error) {
            const errorMessage =
                error instanceof FirebaseError ? error.message : 'Error desconocido';
            Alert.alert('Error', errorMessage);
        }
    };

    return (
        <Layout style={styles.container}>
            <Text category='h1' style={styles.title}>Mis Datos</Text>
            {user ? (
                <>
                    <Text>Email: {user.email ?? ""}</Text>
                    <Text category='s1' style={styles.label}>Nombre</Text>
                    <Input
                        placeholder="Nombre"
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                    />
                    <Text category='s1' style={styles.label}>Número WhatsApp</Text>
                    <Input
                        placeholder="(Ej. 595987654321)" // Placeholder con ejemplo
                        value={whatsappNumber}
                        onChangeText={setWhatsappNumber}
                        style={styles.input}
                        keyboardType="numeric" // Solo permite entrada numérica
                    />
                    <Button style={styles.button} onPress={updateProfile}>Actualizar Perfil</Button>

                    <Text category='h4' style={styles.title}>Actualizar contraseña</Text>

                    <Text category='s1' style={styles.label}>Contraseña Actual</Text>
                    <Input
                        placeholder="Contraseña Actual"
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        secureTextEntry // Hace que el texto de la contraseña no se muestre
                        style={styles.input}
                    />
                    <Text category='s1' style={styles.label}>Nueva Contraseña</Text>
                    <Input
                        placeholder="Nueva Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry // Hace que el texto de la contraseña no se muestre
                        style={styles.input}
                    />
                    <Button style={styles.button} onPress={updatePassword}>Actualizar Contraseña</Button>
                </>
            ) : (
                <Text>No hay usuario autenticado.</Text>
            )}
        </Layout>
    );
};

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
    input: {
        marginBottom: 10,
    },
    button: {
        marginTop: 10,
        marginBottom: 20,
        width: '100%',
    },
    label: {
        alignSelf: 'flex-start',
        marginBottom: 5,
        fontWeight: "bold",
    },
});

export default ProfileScreen;
