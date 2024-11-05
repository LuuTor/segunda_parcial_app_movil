import React, { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { Button, Input, Layout, Text, Divider } from '@ui-kitten/components';
import { setMenuDiario, getPatientById, getMenuDiario } from '@/services/patientService';
import { useRoute, useNavigation } from '@react-navigation/native';
import commonStyles from '@/styles/styles';
import { Patient, Menu } from '@/services/patientService';
import { showToast } from '@/utils/toastUtils';

const DEFAULT_MEAL_OPTIONS = ['Sin restricciones'];
const DEFAULT_MEAL_DESCRIPTION = 'Opciones disponibles para esta comida.';

const AddSuggestedMenu: React.FC = () => {
    const route = useRoute();
    const { id } = route.params as { id: string };
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);
    const [patient, setPatient] = useState<Patient | null>(null);
    const [menuSugerido, setMenuSugerido] = useState<Menu>({
        desayuno: {
            opciones: DEFAULT_MEAL_OPTIONS,
            descripcion: DEFAULT_MEAL_DESCRIPTION,
        },
        refrigerioMatutino: {
            opciones: DEFAULT_MEAL_OPTIONS,
            descripcion: DEFAULT_MEAL_DESCRIPTION,
        },
        almuerzo: {
            opciones: DEFAULT_MEAL_OPTIONS,
            descripcion: DEFAULT_MEAL_DESCRIPTION,
        },
        merienda: {
            opciones: DEFAULT_MEAL_OPTIONS,
            descripcion: DEFAULT_MEAL_DESCRIPTION,
        },
        cena: {
            opciones: DEFAULT_MEAL_OPTIONS,
            descripcion: DEFAULT_MEAL_DESCRIPTION,
        },
    });

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const fetchedPatient = await getPatientById(id);
                setPatient(fetchedPatient);

                // Cargar menú diario existente si existe
                const existingMenu = await getMenuDiario(id);
                if (existingMenu) {
                    setMenuSugerido(existingMenu);
                }
            } catch (error) {
                console.error('Error al obtener el paciente:', error);
                Alert.alert('Error', 'No se pudo obtener los datos del paciente.');
            }
        };

        fetchPatient();
    }, [id]);

    const handleSubmit = async () => {
        setLoading(true);

        try {
            await setMenuDiario(id, menuSugerido);
            showToast('success', 'Éxito', 'Menú sugerido agregado exitosamente.');
            navigation.goBack();
        } catch (error) {
            console.error('Error al agregar menú sugerido:', error);
            showToast('error', 'Error', 'No se pudo agregar el menú sugerido.');
        } finally {
            setLoading(false);
        }
    };

    const handleChangeMeal = (meal: keyof Menu, value: string) => {
        setMenuSugerido(prev => ({
            ...prev,
            [meal]: {
                opciones: [value],
                descripcion: prev[meal].descripcion,
            },
        }));
    };

    return (
        <ScrollView>
            <Layout style={commonStyles.container}>
                <Text category="h5">{patient?.nombre ?? ""}</Text>

                <Text category="h6" style={{ marginTop: 16 }}>Sugerir Menú Diario</Text>

                {Object.keys(menuSugerido).map((meal) => (
                    <React.Fragment key={meal}>
                        <Input
                            label={meal.charAt(0).toUpperCase() + meal.slice(1)}
                            placeholder={`Sugerencia para ${meal}`}
                            value={menuSugerido[meal as keyof Menu].opciones[0]} // Usa la opción de menú
                            onChangeText={(value) => handleChangeMeal(meal as keyof Menu, value)}
                            style={commonStyles.input}
                        />
                        <Divider style={{ marginVertical: 16 }} />
                    </React.Fragment>
                ))}

                <Button
                    style={{ marginTop: 16 }}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Guardando...' : 'Guardar Menú Sugerido'}
                </Button>
            </Layout>
        </ScrollView>
    );
};

export default AddSuggestedMenu;
