import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where, Timestamp } from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from '@/FirebaseConfig';
import { formatDateToString } from '@/utils/dateUtils';

// Definición de tipos para el paciente
export interface Consulta {
    id: string;  // identificador de consulta
    fecha: string;  // Se guarda como Date o timestamp
    detalle: string; // Descripción del motivo de la consulta
    peso: number;    // Peso del paciente en kg
    altura: number;  // Altura del paciente en cm
    presionArterial: string;  // Presión arterial del paciente
    cintura: number;  // Circunferencia de la cintura en cm
    cadera: number;   // Circunferencia de la cadera en cm
    torax: number;    // Circunferencia del tórax en cm
    notas: string;    // Notas adicionales sobre la consulta
}

export interface Menu {
    desayuno: {
        opciones: string[];  // Lista de opciones para el desayuno
        descripcion: string;  // Descripción de lo que puede comer
    };
    refrigerioMatutino: {
        opciones: string[];
        descripcion: string;
    };
    almuerzo: {
        opciones: string[];
        descripcion: string;
    };
    merienda: {
        opciones: string[];
        descripcion: string;
    };
    cena: {
        opciones: string[];
        descripcion: string;
    };
}

const DEFAULT_MEAL_SUGGESTION = 'Sin restricciones';

export interface Patient {
    id?: string;
    nombre: string;
    email: string;
    fechaNacimiento: string;
    consultas?: Consulta[];
    menuDiario?: Menu;  // Nuevo campo para almacenar el menú diario
}

export const addPatient = async (data: Patient) => {
    return await addDoc(collection(FIREBASE_FIRESTORE, 'pacientes'), data);
};

export const listPatients = async (): Promise<Patient[]> => {
    const querySnapshot = await getDocs(collection(FIREBASE_FIRESTORE, 'pacientes'));

    return querySnapshot.docs.map(doc => {
        const data = doc.data() as Omit<Patient, 'id'>; // Aseguramos que el retorno cumpla con la estructura de Patient
        return {
            id: doc.id,
            ...data,
            consultas: data.consultas ?? [] // Valor por defecto si no existe
        };
    });
};

export const getPatientById = async (id: string): Promise<Patient | null> => {
    const docRef = doc(FIREBASE_FIRESTORE, 'pacientes', id);
    const docSnap = await getDoc(docRef);

    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Patient : null;
};

export const updatePatient = async (id: string, data: Omit<Patient, 'id'>) => {
    const docRef = doc(FIREBASE_FIRESTORE, 'pacientes', id);
    return await updateDoc(docRef, data);
};

export const deletePatient = async (id: string) => {
    const docRef = doc(FIREBASE_FIRESTORE, 'pacientes', id);
    return await deleteDoc(docRef);
};

export const addConsultationToPatient = async (id: string, consulta: Omit<Consulta, 'id'>) => {
    const patient = await getPatientById(id);
    if (!patient) throw new Error('Paciente no encontrado');

    // Asegúrate de que consultas es un array
    patient.consultas = patient.consultas ?? [];

    const fechaActual = formatDateToString(new Date());

    // Crear un ID único para la consulta
    const consultaId = doc(collection(FIREBASE_FIRESTORE, 'pacientes', id, 'consultas')).id;

    // Agregar la consulta a la lista de consultas con el nuevo ID
    patient.consultas.push({
        ...consulta,
        id: consultaId, // Asigna el ID generado a la consulta
        fecha: fechaActual // Guardar la fecha como timestamp del momento de la consulta
    });

    await updatePatient(id, patient);
};
// Servicio para eliminar consulta por ID
export const deleteConsultaById = async (patientId: string, consultaId: string): Promise<Patient | null> => {
    try {
        const patient = await getPatientById(patientId);

        // Verificamos si el paciente existe y si tiene consultas
        if (!patient || !patient.consultas || patient.consultas.length === 0) {
            throw new Error('El paciente no existe o no tiene consultas.');
        }

        // Buscar el índice de la consulta por ID
        const consultaIndex = patient.consultas.findIndex(consulta => consulta.id === consultaId);

        // Verificamos que la consulta exista
        if (consultaIndex === -1) {
            throw new Error('Consulta no encontrada.');
        }

        // Eliminar la consulta por ID
        patient.consultas.splice(consultaIndex, 1);

        // Actualizar el paciente en Firestore
        await updatePatient(patientId, patient);
        return patient; // Retornar el paciente actualizado
    } catch (error) {
        console.error('Error al eliminar la consulta:', error);
        return null; // Devolvemos null si ocurre algún error
    }
};

// Servicio para eliminar consulta
export const deleteConsultaByIndex = async (patientId: string, index: number): Promise<Patient | null> => {
    try {
        const patient = await getPatientById(patientId);

        // Verificamos si el paciente existe y si tiene consultas
        if (!patient || !patient.consultas || patient.consultas.length === 0) {
            throw new Error('El paciente no existe o no tiene consultas.');
        }

        // Verificamos que el índice esté dentro del rango válido
        if (index < 0 || index >= patient.consultas.length) {
            throw new Error('Índice de consulta no válido.');
        }

        // Eliminar la consulta por índice
        patient.consultas.splice(index, 1);

        // Retornar el paciente actualizado
        await updatePatient(patientId, patient); // Asegúrate de actualizar el paciente en Firestore
        return patient;
    } catch (error) {
        console.error('Error al eliminar la consulta:', error);
        return null; // Devolvemos null si ocurre algún error
    }
};

export const getPatientByEmail = async (email: string): Promise<Patient | null> => {
    try {
        const q = query(collection(FIREBASE_FIRESTORE, 'pacientes'), where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null; // Si no hay resultados
        }

        const docSnapshot = querySnapshot.docs[0]; // Si hay resultados, tomamos el primero
        return { id: docSnapshot.id, ...docSnapshot.data() } as Patient;
    } catch (error) {
        console.error('Error al obtener paciente por email:', error);
        return null;
    }
};

// Función para establecer el menú diario de un paciente
export const setMenuDiario = async (patientId: string, menu: Menu) => {
    const patient = await getPatientById(patientId);
    if (!patient) throw new Error('Paciente no encontrado');

    // Establecer el menú diario en el paciente
    patient.menuDiario = menu;

    // Actualizar el paciente en Firestore
    await updatePatient(patientId, patient);
};

// Función para obtener el menú diario de un paciente
export const getMenuDiario = async (patientId: string): Promise<Menu | null> => {
    const patient = await getPatientById(patientId);
    if (!patient) return null;

    return patient.menuDiario ?? null; // Retornar el menú diario o null si no existe
};
