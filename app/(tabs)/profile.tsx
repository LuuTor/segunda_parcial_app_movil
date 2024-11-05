import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Avatar, Button, Layout, Text } from '@ui-kitten/components';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from '../../FirebaseConfig'; // Asegúrate de importar Firestore correctamente
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';

export default function ProfileScreen() {
    const [user, setUser] = useState<any>(null);
    const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);
    const router = useRouter();

    // Función para cargar el usuario actual y su número de WhatsApp
    const loadUser = async () => {
        const currentUser = FIREBASE_AUTH.currentUser;
        if (currentUser) {
            setUser(currentUser);

            // Obtener el número de WhatsApp desde Firestore
            const userDoc = doc(FIREBASE_FIRESTORE, 'users', currentUser.uid); // Cambia 'users' por el nombre de tu colección
            const docSnapshot = await getDoc(userDoc);

            if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                setWhatsappNumber(userData.whatsappNumber || null);
            } else {
                console.log("No se encontró el documento del usuario.");
            }
        }
    };

    // Usar useFocusEffect para cargar el usuario cuando la pantalla está enfocada
    useFocusEffect(
        React.useCallback(() => {
            loadUser();
        }, [])
    );

    const handleSignOut = async () => {
        try {
            await signOut(FIREBASE_AUTH);
            Alert.alert('Sesión cerrada', 'Has cerrado sesión con éxito.');
            router.replace('/login');
        } catch (error) {
            Alert.alert('Error', 'No se pudo cerrar sesión. Intenta de nuevo.');
        }
    };

    if (!user) {
        return (
            <Layout style={styles.container}>
                <Text style={styles.loadingText}>Cargando perfil...</Text>
            </Layout>
        );
    }

    return (
        <Layout style={styles.container}>
            <View style={styles.avatarContainer}>
                <Avatar
                    source={{ uri: user.photoURL || 'https://via.placeholder.com/150' }} // Placeholder si no hay foto
                    style={styles.avatar}
                />
            </View>
            <Text style={styles.title}>{user.displayName || "Nombre no disponible"}</Text>
            <View style={styles.infoSection}>
                <Text style={styles.label}>Nombre:</Text>
                <Text style={styles.info}>{user.displayName || "Nombre no disponible"}</Text>
            </View>
            <View style={styles.infoSection}>
                <Text style={styles.label}>Correo:</Text>
                <Text style={styles.info}>{user.email}</Text>
            </View>
            <View style={styles.infoSection}>
                <Text style={styles.label}>WhatsApp:</Text>
                <Text style={styles.info}>{whatsappNumber || "no ingresado"}</Text>
            </View>
            <View style={styles.infoSection}>
                <Text style={styles.label}>Fecha de registro:</Text>
                <Text style={styles.info}>
                    {new Date(user.metadata.creationTime).toLocaleString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true,
                    })}
                </Text>
            </View>
            <Button
                style={styles.editButton}
                onPress={() => router.push('/editProfile')}
            >
                Editar mis datos
            </Button>
            <View style={styles.signOutButton}>
                <Button
                    style={styles.logoutButton}
                    onPress={handleSignOut}
                    appearance='outline' // Cambia el botón a tipo outline
                    status='basic' // Define el color del texto
                >
                    Cerrar Sesión
                </Button>
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f7f9fc',
    },
    avatarContainer: {
        marginVertical: 20,
    },
    avatar: {
        width: 100,
        height: 100,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#2c3e50',
    },
    loadingText: {
        fontSize: 18,
        color: '#7f8c8d',
    },
    infoSection: {
        marginBottom: 20,
        alignItems: 'flex-start',
        width: '100%',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#34495e',
    },
    info: {
        fontSize: 18,
        color: '#7f8c8d',
        marginTop: 5,
    },
    editButton: {
        marginTop: 20,
        width: '100%',
    },
    signOutButton: {
        marginTop: 'auto', // Sitúa el botón de cerrar sesión al fondo
        width: '100%',
        paddingBottom: 20,
    },
    logoutButton: {
        borderColor: '#e74c3c', // Color del borde
        borderWidth: 1, // Ancho del borde
        backgroundColor: 'transparent', // Fondo transparente
        color: '#e74c3c', // Color del texto
    },
});
