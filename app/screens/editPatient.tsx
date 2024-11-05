import React, { useEffect, useState } from 'react';
import { View, Alert, Text, StyleSheet, useColorScheme, TextInput } from 'react-native';
import PatientForm from '@/components/PacienteForm';
import { getPatientById, updatePatient } from '@/services/patientService';
import { useRoute } from '@react-navigation/native';
import { getColors } from '../colors'; // Asegúrate de que esta ruta sea correcta
import createStyles from '../createStyles';
import { showToast } from '@/utils/toastUtils';

const EditPatient: React.FC = () => {
    const route = useRoute();
    const { id } = route.params as { id: string }; // Obtener id de los parámetros de la ruta
    const [initialValues, setInitialValues] = useState<any>(null);

    const colorScheme = useColorScheme();
    const colors = getColors(false);
    const styles = createStyles(colors);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const data = await getPatientById(id);
                if (data && 'nombre' in data && 'email' in data ) {
                    setInitialValues(data);
                } else {
                    throw new Error('Datos del paciente incompletos');
                }
            } catch (error) {
                console.error('Error al obtener el paciente:', error);
                showToast('error', 'Error', 'No se pudo obtener los detalles del paciente.');
            }
        };
        fetchPatient();
    }, [id]);

    const handleUpdatePatient = async (data: { nombre: string; email: string; fechaNacimiento: string }) => {
        try {
            await updatePatient(id, data);
            showToast('success', 'Paciente Actualizado', 'El paciente fue actualizado con éxito.');
        } catch (error) {
            console.error('Error al actualizar paciente:', error);
            showToast('error', 'Error al actualizar paciente', 'Hubo un problema al actualizar el paciente. 😢');
        }
    };

    if (!initialValues) {
        return <Text style={styles.loadingText}>Cargando...</Text>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Paciente</Text>
            <PatientForm
                initialValues={initialValues}
                onSubmit={handleUpdatePatient}
                submitButtonLabel="Actualizar Paciente"
                colors={colors} // Pasar colores al componente de formulario
            />
        </View>
    );
};

export default EditPatient;
