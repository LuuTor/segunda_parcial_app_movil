import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, FlatList, Alert } from 'react-native';
import { Text, Layout, Button, Card, Divider } from '@ui-kitten/components';
import { FIREBASE_AUTH } from '@/FirebaseConfig';
import { getPatientByEmail, Patient, Consulta } from '@/services/patientService';
import { formatDateToString } from '@/utils/dateUtils';
import { useRouter } from 'expo-router';

const MyConsultations: React.FC = () => {
    const [currentUser, setUser] = useState<any>(null);
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter(); // Usamos useRouter para la navegación

    // Función para cargar el usuario actual
    const loadUser = async () => {
        const currentUser = FIREBASE_AUTH.currentUser;
        if (currentUser) {
            setUser(currentUser);
        }
    };

    const fetchPatientByEmail = async (email: string) => {
        try {
            const fetchedPatient = await getPatientByEmail(email);
            if (!fetchedPatient) {
                throw new Error('Paciente no encontrado.');
            }
            setPatient(fetchedPatient);
        } catch (error) {
            console.error('Error al obtener paciente:', error);
            Alert.alert('Error', 'No se pudo obtener el paciente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    useEffect(() => {
        if (currentUser?.email) {
            fetchPatientByEmail(currentUser.email);
        }
    }, [currentUser]);

    if (loading) {
        return (
            <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </Layout>
        );
    }

    if (!patient) {
        return (
            <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text category="h6">No se encontraron consultas.</Text>
            </Layout>
        );
    }

    return (
        <Layout style={{ flex: 1, padding: 16 }}>
            <Text category="h5" style={{ marginBottom: 20, textAlign: 'center' }}>
                Mis Consultas
            </Text>

            {patient.consultas && patient.consultas.length > 0 ? (
                <FlatList
                    data={patient.consultas.slice().reverse()} // Mostramos las consultas en orden inverso
                    keyExtractor={(item) => item.id} // Aseguramos que cada consulta tenga un id único
                    renderItem={({ item }: { item: Consulta }) => (
                        <Card style={{ marginBottom: 16 }} disabled={true}>
                            <Text category="h6">Fecha: {formatDateToString(new Date(item.fecha))}</Text>
                            <Text category="s1">Detalle: {item.detalle}</Text>
                            <Text category="s1">Peso: {item.peso} kg</Text>
                            <Button
                                style={{ marginTop: 10 }}
                                onPress={() => router.push({ pathname: '../screens/viewConsultation', params: { patientId: patient.id, consultaId: item.id } })}>
                                Ver Detalles
                            </Button>
                        </Card>
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }} // Espacio adicional al final para mejor scroll
                />
            ) : (
                <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    <Text>No tienes consultas registradas.</Text>
                </Layout>
            )}
        </Layout>
    );
};

export default MyConsultations;
