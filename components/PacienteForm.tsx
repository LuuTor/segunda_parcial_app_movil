import React, { useState } from 'react';
import { View } from 'react-native';
import { Input, Button, Datepicker } from '@ui-kitten/components';
import commonStyles from '@/styles/styles'; // Importa los estilos comunes
import { Patient } from '@/services/patientService';
import { useNavigation } from 'expo-router';
import { formatDateToString } from '@/utils/dateUtils';


interface PatientFormProps {
    initialValues: Patient;
    onSubmit: (values: Patient) => Promise<void>;
    submitButtonLabel: string;
    colors?: {}
}

const PatientForm: React.FC<PatientFormProps> = ({ initialValues, onSubmit, submitButtonLabel }) => {
    const [nombre, setNombre] = React.useState(initialValues.nombre);
    const [email, setEmail] = React.useState(initialValues.email);
    const [loading, setLoading] = useState(false); // Estado para manejar la carga
    const navigation = useNavigation();
    const [fechaNacimiento, setFechaNacimiento] = React.useState(initialValues.fechaNacimiento);
    let dateObject = new Date();
    
    if(fechaNacimiento.length > 0){
        const consultaFecha = fechaNacimiento.split(' ')[0]; // Separar solo la fecha
        const [day, month, year] = consultaFecha.split('-'); // Separar día, mes y año
        const formattedDate = `${year}-${month}-${day}`; // Convertir al formato 'YYYY-MM-DD'
        dateObject = new Date(formattedDate); // Convertir a objeto Date
    }

    const handleSubmit = async () => {
        setLoading(true); // Activar el estado de carga
        await onSubmit({ nombre, email, fechaNacimiento });
        setLoading(false);
        navigation.goBack();
    };

    return (
        <View>
            <Input
                label="Nombre"
                value={nombre}
                onChangeText={setNombre}
                style={commonStyles.input}
                placeholder="Ingrese el nombre"
            />
            <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={commonStyles.input}
                placeholder="Ingrese el email"
            />

            <Datepicker
                style={{
                    paddingHorizontal: 12,
                    marginBottom: 20,
                    borderColor: '#ccc',
                }}
                label={"Fecha de nacimiento"}
                date={dateObject} min={new Date(1940, 0, 0)}
                onSelect={nextDate => setFechaNacimiento(formatDateToString(nextDate, false))}
            />
            <Button
                onPress={handleSubmit}
                disabled={loading} // Desactivar el botón si loading es true
            >
                {loading ? 'Cargando...' : submitButtonLabel}
            </Button>
        </View>
    );
};

export default PatientForm;
