import React, { useEffect, useState } from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
import { Alert, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getPatientById, Consulta, Patient } from '@/services/patientService';
import commonStyles from '@/styles/styles';
import { formatDate } from '@/utils/dateUtils'; // Utilitario para formatear fechas
import { LinearGradient } from 'react-native-svg';

const ViewConsultation: React.FC = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { patientId, consultaId } = route.params as { patientId: string, consultaId: string };
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
    const [consulta, setConsulta] = useState<Consulta | null>(null);

    // Función para obtener los datos del paciente
    const fetchPatient = async () => {
        try {
            const fetchedPatient = await getPatientById(patientId);
            if (!fetchedPatient) {
                Alert.alert('Error', 'Paciente no encontrado.');
                return;
            }

            // Almacena el paciente en el estado
            setPatient(fetchedPatient);
            const consultaEncontrada = fetchedPatient.consultas?.find(consulta => consulta.id === consultaId);

            if (consultaEncontrada) {
                setConsulta(consultaEncontrada);
            } else {
                Alert.alert('Error', 'Consulta no encontrada.');
            }
        } catch (error) {   
            console.error('Error al obtener el paciente:', error);
            Alert.alert('Error', 'No se pudo obtener los detalles del paciente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatient();
    }, [patientId, consultaId]);

    if (loading) {
        return (
            <Layout style={commonStyles.loadingContainer}>
                <ActivityIndicator size="large" />
            </Layout>
        );
    }

    if (!consulta || !patient) {
        return (
            <Layout style={commonStyles.emptyContainer}>
                <Text category="h6">Consulta no encontrada.</Text>
            </Layout>
        );
    }

    return (
        <Layout style={commonStyles.container}>
            <Layout style={commonStyles.card}>
                <Text category="h5">Detalles de la Consulta</Text>
                <Text>Paciente: {patient.nombre}</Text>
                <Text>Fecha: {(consulta.fecha)}</Text>
                <Text>Detalle: {consulta.detalle}</Text>

                {/* Mostrar los nuevos campos de la consulta */}
                <Text>Peso: {consulta.peso} kg</Text>
                <Text>Altura: {consulta.altura} cm</Text>
                <Text>Presión Arterial: {consulta.presionArterial}</Text>
                <Text>Cintura: {consulta.cintura} cm</Text>
                <Text>Cadera: {consulta.cadera} cm</Text>
                <Text>Tórax: {consulta.torax} cm</Text>
                <Text>Notas: {consulta.notas}</Text>
            </Layout>

            <Button style={{ marginTop: 10 }} onPress={() => navigation.goBack()}>
                Volver
            </Button>
        </Layout>
    );
};

export default ViewConsultation;
