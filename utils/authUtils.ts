import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_FIRESTORE, FIREBASE_AUTH } from '@/FirebaseConfig';
import { useRouter } from 'expo-router';
import { showToast } from '@/utils/toastUtils';

export const verificarUserTypeYRedirigir = async () => {
    const router = useRouter();

    // Obtener el usuario actual de Firebase Authentication
    const currentUser = FIREBASE_AUTH.currentUser;
    console.log(currentUser);
    if (currentUser) {
        try {
            // Obtener el documento del usuario en Firestore
            const userDocRef = doc(FIREBASE_FIRESTORE, 'users', currentUser.uid);
            const userDoc = await getDoc(userDocRef);
            
            console.log(userDoc);
            if (userDoc.exists()) {
                const userData = userDoc.data();

                // Verificar el tipo de usuario y redirigir a la ruta correspondiente
                if (userData.userType === 'doctor') {
                    router.replace('/(tabs-doctor)');
                } else if (userData.userType === 'paciente') {
                    router.replace('/(tabs)');
                } else {
                    showToast('error', 'Error', 'Tipo de usuario no válido.');
                }
            } else {
                showToast('error', 'Error', 'No se encontró el usuario en Firestore.');
            }
        } catch (error) {
            showToast('error', 'Error', 'Error al obtener el tipo de usuario.');
        }
    } else {
        showToast('error', 'Error', 'Usuario no autenticado.');
    }
};
