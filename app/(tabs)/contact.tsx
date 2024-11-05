import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Linking, ActivityIndicator, FlatList } from 'react-native';
import { Text, Card, Button, Icon } from '@ui-kitten/components';
import { fetchDoctors, Doctor } from '@/services/doctorsService'; // Asegúrate de que esta ruta sea correcta

export default function ExploreScreen() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true); // Para mostrar un indicador de carga

    useEffect(() => {
        const loadDoctors = async () => {
            const fetchedDoctors = await fetchDoctors();
            setDoctors(fetchedDoctors);
            setLoading(false); // Termina la carga
        };

        loadDoctors();
    }, []); // Dependencias vacías para que solo se ejecute una vez al montar

    const handleWhatsAppClick = (number: string) => {
        const url = `https://wa.me/${number}`;
        Linking.openURL(url);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const renderDoctorCard = ({ item }: { item: Doctor }) => (
        <Card key={item.id} style={styles.card} status='primary'>
            <View style={styles.cardContent}>
                <Text style={styles.doctorName}>{item.name}</Text>
                <Button
                    style={styles.button}
                    onPress={() => handleWhatsAppClick(item.whatsapp)}
                    appearance='outline'
                    status='success'
                >
                    {item.whatsapp}
                </Button>
            </View>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Text category='h1' style={styles.title}>Contactar Nutricionistas</Text>
            <Text style={{ marginBottom: 20 }}>Aquí encontrarás los datos de contacto para los nutricionistas registrados</Text>

            <FlatList
                data={doctors}
                renderItem={renderDoctorCard}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 20 }} // Espacio adicional al final para mejor scroll
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        marginBottom: 20,
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 8, // Espacio entre el ícono y el texto
    },
    card: {
        marginBottom: 15,
        padding: 15,
    },
    cardContent: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    doctorName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10, // Espacio entre el nombre y el botón
    },
    button: {
        marginTop: 5,
        width: '100%', // Para que el botón ocupe todo el ancho
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
