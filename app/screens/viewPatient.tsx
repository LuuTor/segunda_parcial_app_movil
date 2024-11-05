import React, { useState } from 'react';
import { View, ActivityIndicator, Alert, FlatList } from 'react-native';
import { Button, Text, Layout } from '@ui-kitten/components';
import { getPatientById, deleteConsultaByIndex, Patient, Consulta, updatePatient, deleteConsultaById } from '@/services/patientService';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import commonStyles from '@/styles/styles';
import { useRouter } from 'expo-router';
import { showToast } from '@/utils/toastUtils';

const ViewPatient: React.FC = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params as { id: string };
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchPatient = async () => {
        try {
            const data = await getPatientById(id);
            if (data && 'nombre' in data && 'email' in data) {
                setPatient(data as Patient);
            } else {
                throw new Error('Datos del paciente incompletos');
            }
        } catch (error) {
            console.error('Error al obtener el paciente:', error);
            Alert.alert('Error', 'No se pudo obtener los detalles del paciente.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteConsulta = (consultaId: string) => {
        Alert.alert(
            'Confirmar eliminación',
            '¿Estás seguro de que deseas eliminar esta consulta?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            if (patient) {
                                const updatedPatient = await deleteConsultaById(patient.id ?? "", consultaId);

                                if (updatedPatient && typeof updatedPatient === 'object' && 'id' in updatedPatient) {
                                    if (patient.id && updatePatient) {
                                        updatePatient(patient.id, updatedPatient);
                                        showToast('success', 'Consulta eliminada', 'La consulta ha sido eliminada con éxito.');
                                    }
                                } else {
                                    console.error('Error: updatedPatient no es un tipo válido de Patient.');
                                }

                                fetchPatient(); // Refresca los datos del paciente
                            }

                        } catch (error) {
                            console.error('Error al eliminar la consulta:', error);
                            showToast('error', 'Error al eliminar consulta', 'Hubo un problema al eliminar la consulta. 😢');
                        }
                    },
                },
            ]
        );
    };

    useFocusEffect(
        React.useCallback(() => {
            setLoading(true);
            fetchPatient();
        }, [id])
    );

    if (loading) {
        return (
            <Layout style={commonStyles.loadingContainer}>
                <ActivityIndicator size="large" />
            </Layout>
        );
    }

    if (!patient) {
        return (
            <Layout style={commonStyles.emptyContainer}>
                <Text category="h6">Paciente no encontrado.</Text>
            </Layout>
        );
    }

    return (
        <Layout style={commonStyles.container}>
            <Layout style={commonStyles.card}>
                <Text category="h5">Perfil del Paciente</Text>
                <Text>Nombre: {patient.nombre}</Text>
                <Text>Email: {patient.email}</Text>
                <Text>Fecha de nacimiento: {patient.fechaNacimiento ? patient.fechaNacimiento.toString() : ""}</Text>

                <Button
                    style={{ marginTop: 10, alignSelf: 'flex-start', paddingHorizontal: 8 }}
                    onPress={() => router.push({ pathname: '../screens/editPatient', params: { id: patient.id } })}
                >
                    Editar Datos
                </Button>
                <Button
                    style={{ marginTop: 10, alignSelf: 'flex-start', paddingHorizontal: 8 }}
                    onPress={() => router.push({ pathname: '../screens/addConsultation', params: { id: id } })}>
                    Agregar Consulta
                </Button>
                <Button
                    style={{ marginTop: 10, alignSelf: 'flex-start', paddingHorizontal: 8 }}
                    onPress={() => router.push({ pathname: '../screens/addSuggestedMenu', params: { id: id } })}>
                    Menú Sugerido
                </Button>
            </Layout>

            {patient.consultas && patient.consultas.length > 0 ? (
                <Layout style={commonStyles.card}>
                    <Text category="h6">Consultas</Text>
                    <FlatList
                        data={patient.consultas.slice().reverse()}
                        keyExtractor={(item) => item.id} // Asegúrate de que cada consulta tenga un id único
                        renderItem={({ item }: { item: Consulta }) => (
                            <View style={commonStyles.card}>
                                <Text>Fecha: {item.fecha.toString()}</Text>
                                <Text>Detalle: {item.detalle}</Text>
                                <Text>Peso: {item.peso + " kg"}</Text>
                                <Button
                                    size="small"
                                    style={{ marginTop: 10 }}
                                    onPress={() => router.push({ pathname: '../screens/viewConsultation', params: { patientId: patient.id, consultaId: item.id } })}
                                >
                                    Ver Detalles
                                </Button>

                                <Button
                                    size="small"
                                    status="danger"
                                    style={{ marginTop: 10 }}
                                    onPress={() => handleDeleteConsulta(item.id)} // Usar id de consulta
                                >
                                    Eliminar Consulta
                                </Button>
                            </View>
                        )}
                    />
                </Layout>
            ) : (
                <Layout style={commonStyles.card}>
                    <Text>No hay consultas registradas.</Text>
                </Layout>
            )}

        </Layout>
    );
};

export default ViewPatient;
