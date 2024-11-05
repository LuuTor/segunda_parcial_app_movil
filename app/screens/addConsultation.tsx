import React, { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { Button, Input, Layout, Text, Divider } from '@ui-kitten/components';
import { addConsultationToPatient, getPatientById } from '@/services/patientService';
import { useRoute, useNavigation } from '@react-navigation/native';
import commonStyles from '@/styles/styles';
import { Consulta, Patient } from '@/services/patientService';
import { formatDateToString } from '@/utils/dateUtils';
import { showToast } from '@/utils/toastUtils';

const AddConsultation: React.FC = () => {
    const route = useRoute();
    const { id } = route.params as { id: string };
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false); // Estado para manejar la carga
    const [motivo, setMotivo] = useState('');
    const [peso, setPeso] = useState('');
    const [altura, setAltura] = useState('');
    const [presionArterial, setPresionArterial] = useState('');
    const [cintura, setCintura] = useState('');
    const [cadera, setCadera] = useState('');
    const [torax, setTorax] = useState('');
    const [notas, setNotas] = useState('');
    const [patient, setPatient] = useState<Patient | null>(null); // Estado para almacenar el paciente

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const fetchedPatient = await getPatientById(id);
                setPatient(fetchedPatient);
            } catch (error) {
                console.error('Error al obtener el paciente:', error);
                Alert.alert('Error', 'No se pudo obtener los datos del paciente.');
            }
        };

        fetchPatient();
    }, [id]);

    const handleSubmit = async () => {
        if (!motivo || !peso || !altura || !presionArterial || !cintura || !cadera || !torax) {
            Alert.alert('Error', 'Todos los campos son obligatorios.');
            return;
        }
        const fechaActual = formatDateToString(new Date());
        
        setLoading(true); // Activar el estado de carga

        const consulta: Consulta = {
            fecha: fechaActual,   // Se guarda como timestamp del momento actual
            detalle: motivo,     // Usamos "detalle" para guardar el motivo de la consulta
            peso: parseFloat(peso),   // Convertir el peso a número
            altura: parseFloat(altura), // Convertir la altura a número
            presionArterial,     // Guardar la presión arterial
            cintura: parseFloat(cintura),  // Medida de cintura
            cadera: parseFloat(cadera),    // Medida de cadera
            torax: parseFloat(torax),      // Medida de tórax
            notas                // Guardar las notas adicionales
        };

        try {
            // Lógica para agregar la consulta al paciente
            await addConsultationToPatient(id, consulta);
            showToast('success', 'Éxito', 'Consulta agregada exitosamente.');
            navigation.goBack();
        } catch (error) {
            console.error('Error al agregar consulta:', error);
            showToast('error', 'Error', 'No se pudo agregar la consulta.');
        } finally {
            setLoading(false); // Restablecer el estado de carga
        }
    };

    return (
        <ScrollView>
            <Layout style={commonStyles.container}>
                <Text category="h5">{patient?.nombre ?? ""}</Text>

                {/* Sección de motivo y notas */}
                <Text category="h6" style={{ marginTop: 16 }}>Detalles de la Consulta</Text>
                <Input
                    label="Motivo de la consulta"
                    placeholder="Motivo"
                    value={motivo}
                    onChangeText={setMotivo}
                    style={commonStyles.input}
                />
                <Input
                    label="Notas"
                    placeholder="Notas adicionales"
                    value={notas}
                    onChangeText={setNotas}
                    style={commonStyles.input}
                />

                <Divider style={{ marginVertical: 16 }} />

                {/* Sección de medidas corporales */}
                <Text category="h6">Medidas Corporales</Text>

                <Input
                    label="Peso (kg)"
                    placeholder="Peso en kilogramos"
                    value={peso}
                    keyboardType="numeric"
                    onChangeText={setPeso}
                    style={commonStyles.input}
                />
                <Input
                    label="Altura (cm)"
                    placeholder="Altura en centímetros"
                    value={altura}
                    keyboardType="numeric"
                    onChangeText={setAltura}
                    style={commonStyles.input}
                />
                <Input
                    label="Presión Arterial"
                    placeholder="Ej: 120/80"
                    value={presionArterial}
                    onChangeText={setPresionArterial}
                    style={commonStyles.input}
                />
                <Input
                    label="Circunferencia de Cintura (cm)"
                    placeholder="Medida de cintura en cm"
                    value={cintura}
                    keyboardType="numeric"
                    onChangeText={setCintura}
                    style={commonStyles.input}
                />
                <Input
                    label="Circunferencia de Cadera (cm)"
                    placeholder="Medida de cadera en cm"
                    value={cadera}
                    keyboardType="numeric"
                    onChangeText={setCadera}
                    style={commonStyles.input}
                />
                <Input
                    label="Circunferencia de Tórax (cm)"
                    placeholder="Medida de tórax en cm"
                    value={torax}
                    keyboardType="numeric"
                    onChangeText={setTorax}
                    style={commonStyles.input}
                />

                <Button
                    style={{ marginTop: 16 }}
                    onPress={handleSubmit}
                    disabled={loading} // Desactivar el botón si loading es true
                >
                    {loading ? 'Guardando...' : 'Guardar Consulta'}
                </Button>
            </Layout>
        </ScrollView>
    );
};

export default AddConsultation;
