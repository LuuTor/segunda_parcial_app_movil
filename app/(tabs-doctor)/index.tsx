import React, { useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Card, Button, Tooltip } from '@ui-kitten/components';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { useRouter } from 'expo-router';
import { getStatistics } from '@/services/dashboardService'; // Asegúrate de importar el servicio de estadísticas

// Define el tipo de usuario
interface User {
    userId: string;
    displayName: string;
    userType: string;
    email: string;
    whatsappNumber?: string;
}

// Define el tipo para las estadísticas
interface Statistics {
    totalPacientes: number;
    ultimaConsulta: string;
    totalUsers: number;
    totalDoctors: number;
    totalPacientesUsers: number;
}

const HomeScreen: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [statistics, setStatistics] = useState<Statistics | null>(null);
    const [visibleTooltipIndex, setVisibleTooltipIndex] = useState<number | null>(null);
    const router = useRouter();

    // Función para cargar el usuario actual
    const loadUser = async () => {
        const currentUser = FIREBASE_AUTH.currentUser;
        if (currentUser) {
            const { uid, displayName, email } = currentUser;
            setUser({
                userId: uid,
                displayName: displayName || '',
                userType: 'doctor', // Cambia esto según la lógica de tu aplicación
                email: email || '',
                whatsappNumber: '', // Agrega la lógica para obtener el número si es necesario
            });
        } else {
            setUser(null);
        }
        setLoading(false);
    };

    // Función para cargar estadísticas
    const loadStatistics = async () => {
        const stats = await getStatistics();
        if (stats) {
            setStatistics(stats);
        } else {
            console.error('No se pudieron cargar las estadísticas');
        }
    };

    // Efecto que se ejecuta al montar el componente
    useEffect(() => {
        loadUser();
    }, []);

    // Efecto que se ejecuta cuando el componente está enfocado
    useFocusEffect(
        useCallback(() => {
            loadStatistics(); // Cargar estadísticas cada vez que el componente gana foco
        }, [])
    );

    // Verifica si se está cargando
    if (loading) {
        return <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />;
    }

    // Verifica si el usuario está cargado
    if (!user) {
        return <Text>Error al cargar los datos del usuario.</Text>;
    }

    // Función para formatear la fecha de manera legible
    const getFechaLegible = (fecha: Date): string => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        return fecha.toLocaleDateString('es-ES', options) + ' a las ' + fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeTitle}>Bienvenido doc, {user.displayName}</Text>
            <Text style={styles.userInfo}>{user.email}</Text>
            <Text style={styles.userInfo}>Tu tipo de usuario es: {user.userType}</Text>

            {/* Contenedor de desplazamiento para las tarjetas */}
            <ScrollView style={styles.statsContainer}>
                {statistics && (
                    <>
                        {/* Tarjeta de Cantidad de Pacientes */}
                        <Card style={styles.card} appearance="filled">
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>Cantidad de Pacientes</Text>
                                <Button
                                    size="tiny"
                                    appearance="ghost"
                                    onPress={() => setVisibleTooltipIndex(0)}
                                >
                                    ?
                                </Button>
                            </View>
                            <Text style={styles.cardValue}>{statistics.totalPacientes}</Text>
                            <Tooltip
                                anchor={() => <View />}
                                visible={visibleTooltipIndex === 0}
                                onBackdropPress={() => setVisibleTooltipIndex(null)}
                            >
                                Número total de pacientes registrados.
                            </Tooltip>
                        </Card>

                        {/* Tarjeta de Cantidad de Pacientes Usuarios de la App */}
                        <Card style={styles.card} appearance="filled">
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>Cantidad de Pacientes Usuarios de la App</Text>
                                <Button
                                    size="tiny"
                                    appearance="ghost"
                                    onPress={() => setVisibleTooltipIndex(1)}
                                >
                                    ?
                                </Button>
                            </View>
                            <Text style={styles.cardValue}>{statistics.totalPacientesUsers}</Text>
                            <Tooltip
                                anchor={() => <View />}
                                visible={visibleTooltipIndex === 1}
                                onBackdropPress={() => setVisibleTooltipIndex(null)}
                            >
                                Número de pacientes que utilizan la aplicación.
                            </Tooltip>
                        </Card>

                        {/* Tarjeta de Última Consulta Registrada */}
                        <Card style={styles.card} appearance="filled">
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>Última Consulta Registrada</Text>
                                <Button
                                    size="tiny"
                                    appearance="ghost"
                                    onPress={() => setVisibleTooltipIndex(2)}
                                >
                                    ?
                                </Button>
                            </View>
                            <Text style={styles.cardValue}>{getFechaLegible(new Date(statistics.ultimaConsulta))}</Text>
                            <Tooltip
                                anchor={() => <View />}
                                visible={visibleTooltipIndex === 2}
                                onBackdropPress={() => setVisibleTooltipIndex(null)}
                            >
                                La fecha y hora de la última consulta registrada.
                            </Tooltip>
                        </Card>

                        {/* Tarjeta de Total de Usuarios */}
                        <Card style={styles.card} appearance="filled">
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>Total de Usuarios</Text>
                                <Button
                                    size="tiny"
                                    appearance="ghost"
                                    onPress={() => setVisibleTooltipIndex(3)}
                                >
                                    ?
                                </Button>
                            </View>
                            <Text style={styles.cardValue}>{statistics.totalUsers}</Text>
                            <Tooltip
                                anchor={() => <View />}
                                visible={visibleTooltipIndex === 3}
                                onBackdropPress={() => setVisibleTooltipIndex(null)}
                            >
                                Número total de usuarios del sistema.
                            </Tooltip>
                        </Card>

                        {/* Tarjeta de Cantidad de Doctores */}
                        <Card style={styles.card} appearance="filled">
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>Cantidad de Doctores</Text>
                                <Button
                                    size="tiny"
                                    appearance="ghost"
                                    onPress={() => setVisibleTooltipIndex(4)}
                                >
                                    ?
                                </Button>
                            </View>
                            <Text style={styles.cardValue}>{statistics.totalDoctors}</Text>
                            <Tooltip
                                anchor={() => <View />}
                                visible={visibleTooltipIndex === 4}
                                onBackdropPress={() => setVisibleTooltipIndex(null)}
                            >
                                Número total de doctores registrados.
                            </Tooltip>
                        </Card>
                    </>
                )}
            </ScrollView>

            {/* Botones según tipo de usuario */}
            <Button onPress={() => router.push('/pacientes')} >Ir a lista de pacientes</Button>
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
    statsContainer: {
        flex: 1,
        // justifyContent: 'flex-start',
    },
    card: {
        marginBottom: 10, // Espaciado entre las tarjetas
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardValue: {
        fontSize: 24,
        marginTop: 10,
    },
});

export default HomeScreen;
