import { FIREBASE_FIRESTORE } from '@/FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
export interface Tarea {
    id: string;
    title: string;
    description: string;  // Nueva propiedad description
    completed: boolean;
}
// Función para obtener las tareas de un usuario dado su ID
export const fetchTareas = async (userId: string): Promise<Tarea[]> => {
    try {
        const userDocRef = doc(FIREBASE_FIRESTORE, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const data = userDoc.data();
            const tareas: Tarea[] = data?.tareas || [];
            return tareas.map((tarea: any) => ({
                id: tarea.id || '',
                title: tarea.title || 'Sin título',
                description: tarea.description || '', // Aseguramos que la descripción sea retornada
                completed: tarea.completed || false,
            }));
        } else {
            console.error('No se encontró el documento del usuario.');
            return [];
        }
    } catch (error) {
        console.error('Error al obtener las tareas: ', error);
        return [];
    }
};
// Función para agregar una tarea
export const agregarTarea = async (userId: string, nuevaTarea: Tarea): Promise<void> => {
    const userDocRef = doc(FIREBASE_FIRESTORE, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        const data = userDoc.data();
        const tareas: Tarea[] = data?.tareas || [];
        const updatedTareas = [...tareas, nuevaTarea];
        await updateDoc(userDocRef, { tareas: updatedTareas });
    }
};
// Función para actualizar una tarea
export const actualizarTarea = async (userId: string, tareaActualizada: Tarea): Promise<void> => {
    const userDocRef = doc(FIREBASE_FIRESTORE, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        const data = userDoc.data();
        const tareas: Tarea[] = data?.tareas || [];
        const updatedTareas = tareas.map((tarea) =>
            tarea.id === tareaActualizada.id ? tareaActualizada : tarea
        );
        await updateDoc(userDocRef, { tareas: updatedTareas });
    }
};
// Función para eliminar una tarea
export const eliminarTarea = async (userId: string, idTarea: string): Promise<void> => {
    const userDocRef = doc(FIREBASE_FIRESTORE, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        const data = userDoc.data();
        const tareas: Tarea[] = data?.tareas || [];
        const updatedTareas = tareas.filter((tarea) => tarea.id !== idTarea);
        await updateDoc(userDocRef, { tareas: updatedTareas });
    }
};