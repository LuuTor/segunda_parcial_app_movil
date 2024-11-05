import React, { useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import WeightEvolutionChart from '@/components/WeightEvolutionChart';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from '../../FirebaseConfig'; // Importa tus instancias configuradas
import { doc, getDoc } from 'firebase/firestore'; // Métodos para Firestore
import { useRouter } from 'expo-router'; // Para manejar la navegación

// Definimos el tipo para los datos del usuario
interface User {
    uid: string;
    nombre: string;
    email: string;
    userType: string;
}

const HomeScreen: React.FC = () => {
    const [user, setUser] = useState<User | null>(null); // Estado para almacenar la información del usuario
    const [loading, setLoading] = useState<boolean>(true); // Estado de carga para saber si estamos buscando datos
    const [refreshKey, setRefreshKey] = useState<number>(0); // Estado para el refresh del gráfico
    const router = useRouter(); // Para redirigir a la pantalla de pacientes

    // Función para recargar el gráfico de peso
    const reloadChart = useCallback(() => {
        setRefreshKey((prevKey) => prevKey + 1);
    }, []);

    // Función para obtener los datos del usuario desde Firestore
    const fetchUserData = async (uid: string): Promise<User | null> => {
        try {
            const userDocRef = doc(FIREBASE_FIRESTORE, 'users', uid); // Referencia al documento del usuario en Firestore
            const userDoc = await getDoc(userDocRef); // Obtén los datos del documento
            if (userDoc.exists()) {
                const userData = userDoc.data();
                return {
                    uid,
                    nombre: (userData?.displayName as string) || 'Usuario',
                    email: (userData?.email as string) || '',
                    userType: (userData?.userType as string) || 'default', // Asume un valor por defecto si no hay userType
                };
            } else {
                console.error('No se encontró el documento del usuario en Firestore.');
                return null;
            }
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            return null;
        }
    };

    // Función para manejar la autenticación y cargar datos del usuario desde Firestore
    const loadUser = async () => {
        const currentUser = FIREBASE_AUTH.currentUser; // Obtén el usuario actual
        if (currentUser) {
            const userData = await fetchUserData(currentUser.uid); // Carga los datos del usuario desde Firestore
            if (userData)
                userData.email = currentUser?.email ?? "";
            setUser(userData);
            setLoading(false); // Cambia el estado de carga una vez que se obtiene el usuario
        } else {
            console.error('No hay ningún usuario autenticado.');
            setLoading(false); // Cambia el estado de carga incluso si no hay usuario autenticado
        }
    };

    // Ejecuta la función loadUser cuando el componente se monta
    useEffect(() => {
        loadUser();
    }, []);

    // Utiliza useFocusEffect para recargar el gráfico al volver a la pantalla
    useFocusEffect(
        useCallback(() => {
            reloadChart(); // Recarga el gráfico de peso
        }, [reloadChart])
    );

    // Función para redirigir a la lista de pacientes
    const goToPatients = () => {
        router.push('../screens/pacientes'); // Redirige a la ruta de pacientes
    };
    const goToConsultas = () => {
        router.push('../screens/myConsultations'); // Redirige a la ruta de pacientes
    };

    // Muestra un indicador de carga mientras se obtiene la información del usuario
    if (loading) {
        return <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />;
    }

    if (!user) {
        return <Text>Error al cargar los datos del usuario.</Text>;
    }

    return (
        <View style={styles.container}>
            {/* Título de bienvenida */}
            <Text style={styles.welcomeTitle}>Bienvenido paciente, {user.nombre}</Text>
            <Text style={styles.userInfo}>{user.email}</Text>
            <Text style={styles.userInfo}>Tu tipo de usuario es: {user.userType}</Text>

            {/* Gráfico de evolución de peso */}
            <WeightEvolutionChart userEmail={user.email} refreshKey={refreshKey} />

            {/* Botón solo para doctores */}
            {user.userType === 'doctor' && (
                <Button title="Ir a lista de pacientes" onPress={goToPatients} color="#007BFF" />
            )}
            {/* Botón solo para pacientes */}
            {user.userType === 'paciente' && (
                <Button title="Ver mi historial de consultas" onPress={goToConsultas} color="#007BFF" />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    userInfo: {
        fontSize: 18,
        marginBottom: 20,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default HomeScreen;
