import React, { useState } from 'react';
import { Alert, View, StyleSheet } from 'react-native';
import PatientForm from '@/components/PacienteForm';
import { addPatient } from '@/services/patientService';
import { useColorScheme } from 'react-native';
import { getColors } from '../colors';
import { useNavigation } from 'expo-router';
import { showToast } from '@/utils/toastUtils';

const AddPatient: React.FC = () => {
    const colorScheme = useColorScheme();
    // const colors = getColors(colorScheme === 'dark');
    const colors = getColors(false);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false); // Estado para manejar la carga


    const handleAddPatient = async (data: { nombre: string; email: string; fechaNacimiento: string }) => {
        try {
            // setLoading(true); // Activar el estado de carga
            await addPatient(data);
            showToast('success', 'Paciente agregado', 'El paciente ha sido agregado exitosamente! 🎉');
            
        } catch (error) {
            console.error('Error al agregar paciente:', error);
            showToast('error', 'Error al agregar paciente', 'Hubo un problema al agregar el paciente. 😢');
        } finally{
            // setLoading(false);
        }
    };

    // Aquí definimos el estilo dinámico
    const dynamicStyles = {
        container: {
            flex: 1,
            padding: 16,
            backgroundColor: colors.background,
        },
    };

    return (
        <View style={dynamicStyles.container}>
            <PatientForm
                initialValues={{ nombre: '', email: '', fechaNacimiento: "" }} // Valores iniciales vacíos
                onSubmit={handleAddPatient}
                submitButtonLabel="Agregar Paciente"
                colors={colors} // Asegúrate de pasar los colores también
            />
        </View>
    );
};



export default AddPatient;
