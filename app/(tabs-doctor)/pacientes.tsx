import React, { useState } from 'react';
import { View, Text, Button, FlatList, Alert, ActivityIndicator, useColorScheme, TextInput } from 'react-native';
import { listPatients, deletePatient, Patient } from '@/services/patientService';
import { useFocusEffect, useRouter } from 'expo-router';
import { getColors } from '../colors'; // Asegúrate de que esta ruta sea correcta
import commonStyles from '@/styles/styles'; // Importa los estilos comunes
import { showToast } from '@/utils/toastUtils';

const ListPatients = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>(''); // Estado para el buscador
    const router = useRouter();
    const colorScheme = useColorScheme(); // Detectar el modo de color actual
    const colors = getColors(colorScheme === 'dark'); // Obtener colores según el modo

    // Función para cargar los pacientes
    const fetchPatients = async () => {
        try {
            const data: Patient[] = await listPatients();
            const formattedData = data.map(patient => ({
                id: patient.id,
                nombre: patient.nombre || 'Sin nombre',
                email: patient.email || 'Sin Email',
                fechaNacimiento: patient.fechaNacimiento || "",
            }));
            setPatients(formattedData);
        } catch (error) {
            console.error('Error al cargar pacientes:', error);
            Alert.alert('Error', 'No se pudo cargar la lista de pacientes.');
        } finally {
            setLoading(false);
        }
    };

    // Usar useFocusEffect para cargar los pacientes cuando la pantalla está enfocada
    useFocusEffect(
        React.useCallback(() => {
            fetchPatients();
        }, [])
    );

    // Función para eliminar un paciente
    const handleDeletePatient = async (id: string) => {
        // Mostrar un diálogo de confirmación
        Alert.alert(
            'Confirmar Eliminación',
            '¿Estás seguro de que deseas eliminar este paciente?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel', // Botón para cancelar
                },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deletePatient(id);
                            setPatients(prev => prev.filter(p => p.id !== id));
                            showToast('success', 'Paciente eliminado', 'El paciente ha sido eliminado con éxito.');
                        } catch (error) {
                            console.error('Error al eliminar paciente:', error);
                            showToast('error', 'Error al eliminar paciente', 'Hubo un problema al eliminar el paciente. 😢');
                        }
                    },
                },
            ],
            { cancelable: true } // Permitir que se cierre el diálogo al tocar fuera de él
        );
    };

    if (loading) {
        return (
            <View style={commonStyles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (patients.length === 0) {
        return (
            <View style={commonStyles.emptyContainer}>
                <Text style={commonStyles.emptyText}>No hay pacientes disponibles.</Text>
                <Button title="Agregar Paciente" onPress={() => router.push('../screens/addPatient')} color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            {/* Header */}
            <View style={commonStyles.header}>
                <Text style={commonStyles.headerTitle}>PACIENTES</Text>
                <Button
                    title="Agregar Paciente"
                    onPress={() => router.push('../screens/addPatient')}
                    color={colors.primary}
                />
            </View>

            {/* Buscador */}
            <TextInput
                style={commonStyles.searchInput}
                placeholder="Buscar pacientes..."
                placeholderTextColor="#A9A9A9" // Color del placeholder
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            {/* Lista de Pacientes */}
            <FlatList
                data={patients.filter(patient => patient.nombre.toLowerCase().includes(searchQuery.toLowerCase()))} // Filtra por el nombre
                keyExtractor={(item) => item.id || item.nombre} // Usar nombre como fallback si id es undefined
                renderItem={({ item }) => (
                    <View style={commonStyles.card}>
                        <Text style={commonStyles.title}>{item.nombre}</Text>
                        <Text style={commonStyles.info}>{item.email}</Text>
                        <Text style={commonStyles.info}>Fecha de Nacimiento: {item.fechaNacimiento.toString() ??""}</Text>
                        <View style={commonStyles.buttonContainer}>
                            <Button
                                title="Ver Detalles"
                                onPress={() => router.push({ pathname: '../screens/viewPatient', params: { id: item.id } })}
                                color={colors.secondary}
                            />
                            <Button title="Eliminar" onPress={() => handleDeletePatient(item.id ?? '')} color={colors.danger} />
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

export default ListPatients;
