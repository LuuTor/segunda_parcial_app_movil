import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from '@/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userType, setUserType] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        // Observa los cambios en el estado de autenticación
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
            if (user) {
                setCurrentUser(user);

                try {
                    //darle tiempo al register para guardar el dato primero antes de ir a buscarlo
                    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 segundo de espera
                    // Buscar el userType en Firestore
                    const userDocRef = doc(FIREBASE_FIRESTORE, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUserType(userData.usertype || null); // Asigna el userType si existe
                    } else {
                        console.error('Usuario no encontrado en Firestore');
                        setUserType(null);
                    }
                } catch (error) {
                    console.error('Error al obtener el tipo de usuario:', error);
                    setUserType(null);
                }
            } else {
                setCurrentUser(null);
                setUserType(null); // Reiniciar userType cuando no hay usuario autenticado
            }
            setLoading(false); // Detener el estado de carga
        });

        return () => unsubscribe(); // Desuscribirse del listener al desmontar
    }, []);

    return { currentUser, userType, loading };
};
