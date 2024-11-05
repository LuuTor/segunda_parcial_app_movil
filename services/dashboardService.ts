import { FIREBASE_FIRESTORE } from "@/FirebaseConfig";
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

// Función para obtener estadísticas
export const getStatistics = async () => {
    const pacientesRef = collection(FIREBASE_FIRESTORE, 'pacientes');
    const usersRef = collection(FIREBASE_FIRESTORE, 'users');

    try {
        // Obtener todos los pacientes
        const pacientesSnapshot = await getDocs(pacientesRef);
        const pacientesData = pacientesSnapshot.docs.map(doc => doc.data());

        // Contar la cantidad de pacientes
        const totalPacientes = pacientesData.length;

        // Obtener la última consulta registrada
        const consultas = pacientesData.flatMap(paciente => paciente.consultas);
        const ultimaConsulta = consultas.reduce((latest, consulta) => {
            if(!consulta) return false; // ignorar si la consulta es falsy
            
            // Divide la fecha en partes (DD, MM, YYYY) y la hora (HH, mm)
            const [datePart, timePart] = consulta.fecha.split(' ');
            const [day, month, year] = datePart.split('-').map(Number);
            const [hour, minute] = timePart.split(':').map(Number);

            // Crea un objeto Date utilizando el formato YYYY-MM-DDTHH:mm
            const fechaConsulta = new Date(year, month - 1, day, hour, minute); // Meses en JavaScript son 0-indexados

            return fechaConsulta > latest ? fechaConsulta : latest;
        }, new Date(0)); // Inicializa con una fecha muy antigua

        // Obtener todos los usuarios
        const usersSnapshot = await getDocs(usersRef);
        const usersData = usersSnapshot.docs.map(doc => doc.data());

        // Contar la cantidad de usuarios y por tipo
        const totalUsers = usersData.length;
        const totalDoctors = usersData.filter(user => user.userType === 'doctor').length;
        const totalPacientesUsers = usersData.filter(user => user.userType === 'paciente').length;

        return {
            totalPacientes,
            ultimaConsulta: ultimaConsulta.toISOString(), // Retorna en formato ISO
            totalUsers,
            totalDoctors,
            totalPacientesUsers,
        };
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        return null;
    }
};
