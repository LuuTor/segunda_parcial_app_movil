import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Layout, Text, Spinner } from '@ui-kitten/components';
import { LineChart } from 'react-native-chart-kit';
import { listPatients } from '@/services/patientService'; // Asegúrate de que esta ruta sea correcta

const findPatientByEmail = async (email: string) => {
    const patients = await listPatients(); // Recupera todos los pacientes
    return patients.find((patient) => {
        return patient.email === email;
    }); // Encuentra el paciente por email
};

const prepareDataForChart = (consultas: Array<{ fecha: string, peso: number }>) => {
    if (!consultas || consultas.length === 0) return { labels: [], data: [] };

    // Tomar solo las últimas 4 consultas
    const recentConsultas = consultas.slice(-4);
    const labels: string[] = [];
    const data: number[] = [];

    recentConsultas.forEach(consulta => {
        const [date] = consulta.fecha.split(' '); // Separar fecha
        const [day, month, year] = date.split('-'); // Descomponer la fecha
        const formattedDate = `${year}-${month}-${day}`; // Formato ISO para el gráfico

        labels.push(formattedDate); // Agregar fecha al eje X
        data.push(consulta.peso); // Agregar peso al conjunto de datos
    });

    return { labels, data };
};

const WeightEvolutionChart = ({ userEmail, refreshKey }: { userEmail: string; refreshKey: number }) => {
    const [chartData, setChartData] = useState<{ labels: string[], data: number[] }>({ labels: [], data: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPatientData = async () => {
            setLoading(true); // Muestra el indicador de carga
            const patient = await findPatientByEmail(userEmail);
            if (patient) {
                if (patient.consultas) {
                    const { labels, data } = prepareDataForChart(patient.consultas);
                    setChartData({ labels, data });
                }
            }
            setLoading(false); // Oculta el indicador de carga
        };

        loadPatientData();
    }, [userEmail, refreshKey]); // Agrega refreshKey a las dependencias

    return (
        <Layout style={styles.container}>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    <Text category="h5" style={styles.title}>Evolución del Peso</Text>
                    {chartData.labels.length > 0 ? (
                        <>
                            <LineChart
                                data={{
                                    labels: chartData.labels,
                                    datasets: [
                                        {
                                            data: chartData.data,
                                            color: (opacity = 1) => `rgba(34, 202, 236, ${opacity})`, // Color de la línea
                                            strokeWidth: 2,
                                        },
                                    ],
                                }}
                                width={Dimensions.get('window').width - 40} // Ajusta el ancho del gráfico
                                height={220}
                                chartConfig={{
                                    backgroundColor: '#ffffff',
                                    backgroundGradientFrom: '#ffffff',
                                    backgroundGradientTo: '#ffffff',
                                    decimalPlaces: 2,
                                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                    style: {
                                        borderRadius: 16,
                                    },
                                }}
                                bezier
                                style={{
                                    marginVertical: 8,
                                    borderRadius: 16,
                                }}
                            />
                            <Text category="s1" style={styles.legend}>Peso (kg)</Text>
                        </>
                    ) : (
                        <Text>No hay datos disponibles para mostrar.</Text>
                    )}
                </>
            )}
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        marginBottom: 10,
        fontWeight: 'bold',
    },
    legend: {
        marginTop: 10,
        fontStyle: 'italic',
        color: '#666',
    },
});

export default WeightEvolutionChart;
