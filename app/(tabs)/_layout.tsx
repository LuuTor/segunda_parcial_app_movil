import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FIREBASE_AUTH, FIREBASE_FIRESTORE } from '@/FirebaseConfig'; // Asegúrate de tener configurados tu Firebase Auth y Firestore
import { doc, getDoc } from 'firebase/firestore';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const [userType, setUserType] = useState(null); // Estado para almacenar el userType
    const [loading, setLoading] = useState(true); // Estado para manejar la carga

    useEffect(() => {
        const fetchUserType = async () => {
            setLoading(true); // Inicia el estado de carga
            try {
                const user = FIREBASE_AUTH.currentUser; // Obtener el usuario logueado
                if (user) {
                    const userDoc = await getDoc(doc(FIREBASE_FIRESTORE, 'users', user.uid)); // Consultar Firestore
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUserType(userData.userType); // Guardar el userType en el estado
                    } else {
                        console.log("No existe el documento del usuario");
                    }
                } else {
                    console.log("No hay un usuario logueado");
                }
            } catch (error) {
                console.error("Error al obtener el tipo de usuario:", error);
            } finally {
                setLoading(false); // Finaliza el estado de carga
            }
        };

        fetchUserType(); // Llamar a la función para obtener el tipo de usuario
    }, []); // Ejecutar solo una vez al montar el componente

    if (loading) {
        return null; // O puedes retornar un componente de carga
    }

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors['light'].tint,
                headerShown: false, // Oculta la cabecera
            }}>
                <Tabs.Screen
                name="tareas" // Archivo contact.tsx dentro de (tabs)
                options={{
                    title: 'Tareas',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'checkbox' : 'checkbox-outline'} color={color} />
                    ),
                }}
            />

            {/* Pestaña de Inicio */}
            <Tabs.Screen
                name="index" // Archivo index.tsx dentro de (tabs)
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                    ),
                }}
            />

            {/* Pestaña de Menú */}
            <Tabs.Screen
                name="menu" // Archivo menu.tsx dentro de (tabs)
                options={{
                    title: 'Menú',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'pizza' : 'pizza-outline'} color={color} />
                    ),
                }}
            />

            {/* Pestaña de Contacto */}
            <Tabs.Screen
                name="contact" // Archivo contact.tsx dentro de (tabs)
                options={{
                    title: 'Contacto',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'logo-whatsapp' : 'logo-whatsapp'} color={color} />
                    ),
                }}
            />

            {/* Pestaña de Perfil */}
            <Tabs.Screen
                name="profile" // Archivo profile.tsx dentro de (tabs)
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
                    ),
                }}
            />

        </Tabs>
    );
}
