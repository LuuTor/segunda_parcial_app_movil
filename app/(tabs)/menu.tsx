import React, { useEffect, useState } from 'react';
import { FlatList, Alert } from 'react-native';
import { Layout, Text, Card, Spinner } from '@ui-kitten/components';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getPatientByEmail, Patient } from '@/services/patientService';
import commonStyles from '@/styles/styles';
import { FIREBASE_AUTH } from '@/FirebaseConfig';
import { useFocusEffect } from 'expo-router';

const ViewConsultation: React.FC = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);

    // Función para obtener los datos del paciente
    const fetchPatient = async () => {
        try {
            const currentUser = FIREBASE_AUTH.currentUser;

            const fetchedPatient = await getPatientByEmail(currentUser?.email ?? "");
            if (!fetchedPatient) {
                Alert.alert('Error', 'Paciente no encontrado.');
                return;
            }

            // Almacena el paciente en el estado
            setPatient(fetchedPatient);
        } catch (error) {
            console.error('Error al obtener el paciente:', error);
            Alert.alert('Error', 'No se pudo obtener los detalles del paciente.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(() => {
        fetchPatient();
    });

    if (loading) {
        return (
            <Layout style={commonStyles.loadingContainer}>
                <Spinner size="large" />
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

    const { menuDiario } = patient;

    if (!menuDiario) {
        return (
            <Layout style={commonStyles.emptyContainer}>
                <Text category="h6">No hay menú diario disponible.</Text>
            </Layout>
        );
    }

    const menuItems = [
        { title: 'Desayuno', opciones: menuDiario.desayuno.opciones, descripcion: menuDiario.desayuno.descripcion },
        { title: 'Refrigerio Matutino', opciones: menuDiario.refrigerioMatutino.opciones, descripcion: menuDiario.refrigerioMatutino.descripcion },
        { title: 'Almuerzo', opciones: menuDiario.almuerzo.opciones, descripcion: menuDiario.almuerzo.descripcion },
        { title: 'Merienda', opciones: menuDiario.merienda.opciones, descripcion: menuDiario.merienda.descripcion },
        { title: 'Cena', opciones: menuDiario.cena.opciones, descripcion: menuDiario.cena.descripcion },
    ];

    const renderCard = ({ item }: { item: { title: string, opciones: string[], descripcion: string } }) => (
        <Card style={commonStyles.card}>
            <Text category="h6">{item.title}</Text>
            <Text category="p1">Opciones: {item.opciones.join(', ')}</Text>
            <Text category="p2">Descripción: {item.descripcion}</Text>
        </Card>
    );

    return (
        <Layout style={commonStyles.container}>
            <Text category="h5" style={commonStyles.title}>Menú Diario Sugerido</Text>

            <FlatList
                data={menuItems}
                renderItem={renderCard}
                keyExtractor={(item) => item.title}
                contentContainerStyle={{ paddingBottom: 20 }} // Espacio extra para el desplazamiento
            />
        </Layout>
    );
};

export default ViewConsultation;
