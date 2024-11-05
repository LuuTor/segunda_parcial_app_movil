// doctorsService.ts
import { FIREBASE_FIRESTORE } from '@/FirebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

export interface Doctor {
    id: string;
    name: string;
    whatsapp: string;
}

export const fetchDoctors = async (): Promise<Doctor[]> => {
    try {
        const q = query(collection(FIREBASE_FIRESTORE, 'users'), where('userType', '==', 'doctor'));
        const querySnapshot = await getDocs(q);

        const fetchedDoctors: Doctor[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            fetchedDoctors.push({
                id: doc.id,
                name: data.displayName || 'Nombre no disponible', // Maneja null
                whatsapp: data.whatsappNumber || 'Número no disponible', // Maneja null
            });
        });

        return fetchedDoctors;
    } catch (error) {
        console.error('Error fetching doctors: ', error);
        return []; // Retorna un array vacío en caso de error
    }
};
