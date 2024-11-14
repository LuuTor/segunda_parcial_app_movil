import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Alert, TextInput } from 'react-native';
import { Text, Card, Button } from '@ui-kitten/components';
import { fetchTareas, agregarTarea, actualizarTarea, eliminarTarea, Tarea } from '@/services/tareaService';
import { FIREBASE_AUTH } from '@/FirebaseConfig';
export default function TareasScreen() {
    const [tareas, setTareas] = useState<Tarea[]>([]);
    const [loading, setLoading] = useState(true);
    const [nuevaTarea, setNuevaTarea] = useState('');
    const [nuevaDescripcion, setNuevaDescripcion] = useState(''); // Nuevo campo de descripción
    const [userId, setUserId] = useState<string | null>(null);
    const [editandoTareaId, setEditandoTareaId] = useState<string | null>(null);  // Tarea en edición
    const [tareaEditada, setTareaEditada] = useState<string>('');  // Título editado temporalmente
    const [descripcionEditada, setDescripcionEditada] = useState<string>('');  // Descripción editada temporalmente
    const [busqueda, setBusqueda] = useState('');  // Estado para la búsqueda
    useEffect(() => {
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
            setUserId(user.uid);
            loadTareas(user.uid);
        } else {
            console.error("No hay usuario autenticado.");
        }
    }, []);
    const loadTareas = async (uid: string) => {
        const fetchedTareas = await fetchTareas(uid);
        setTareas(fetchedTareas);
        setLoading(false);
    };
    const generarIdUnico = (): string => {
        return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    };
    const agregarNuevaTarea = async () => {
        if (!nuevaTarea || nuevaTarea.length === 0) {
            Alert.alert('Error', 'Se debe ingresar un título para la tarea.');
            return;
        }

        if (!nuevaTarea || !userId) return;
        const nuevaTareaObj: Tarea = {
            id: generarIdUnico(),
            title: nuevaTarea,
            description: nuevaDescripcion,  // Agregar descripción
            completed: false,
        };
        await agregarTarea(userId, nuevaTareaObj);
        setTareas((prevTareas) => [...prevTareas, nuevaTareaObj]);
        setNuevaTarea(''); // Limpiar el campo de título
        setNuevaDescripcion(''); // Limpiar el campo de descripción
        Alert.alert('OK', 'Tarea agregada.');
    };
    const completarTarea = async (id: string) => {
        if (!userId) return;
        const tarea = tareas.find((t) => t.id === id);
        if (tarea) {
            const tareaActualizada = { ...tarea, completed: !tarea.completed };
            await actualizarTarea(userId, tareaActualizada);
            setTareas((prevTareas) =>
                prevTareas.map((t) => (t.id === id ? tareaActualizada : t))
            );
        }
    };
    const eliminarTareaConfirmacion = (id: string) => {
        if (!userId) return;
        Alert.alert('Eliminar tarea', '¿Estás seguro de que deseas eliminar esta tarea?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    await eliminarTarea(userId, id);
                    setTareas((prevTareas) => prevTareas.filter((t) => t.id !== id));
                    Alert.alert('OK', 'Tarea eliminada.');
                },
            },
        ]);
    };
    // Habilitar modo de edición para una tarea
    const habilitarEdicion = (tarea: Tarea) => {
        setEditandoTareaId(tarea.id);  // Establecemos qué tarea está en edición
        setTareaEditada(tarea.title);  // Inicializamos el valor del input con el título actual
        setDescripcionEditada(tarea.description);  // Inicializamos la descripción
    };
    // Guardar cambios de edición
    const guardarEdicion = async (id: string) => {
        if (!userId) return;
        const tareaActualizada = { id, title: tareaEditada, description: descripcionEditada, completed: false };  // Actualizamos el título y descripción
        await actualizarTarea(userId, tareaActualizada);
        setTareas((prevTareas) =>
            prevTareas.map((t) => (t.id === id ? { ...t, title: tareaEditada, description: descripcionEditada } : t))
        );
        setEditandoTareaId(null);  // Salimos del modo edición
    };
    // Filtrar tareas por título
    const tareasFiltradas = tareas.filter(tarea =>
        tarea.title.toLowerCase().includes(busqueda.toLowerCase())
    );
    
    const renderTareaCard = ({ item }: { item: Tarea }) => (
        <Card key={item.id} style={styles.card} status={item.completed ? 'success' : 'danger'}>
            <View style={styles.cardContent}>
                {/* Modo de edición */}
                {editandoTareaId === item.id ? (
                    <>
                        <TextInput
                            style={styles.inputEdit}
                            value={tareaEditada}
                            onChangeText={setTareaEditada}
                            placeholder="Editar título"
                        />
                        <TextInput
                            style={styles.inputEdit}
                            value={descripcionEditada}
                            onChangeText={setDescripcionEditada}
                            placeholder="Editar descripción"
                        />
                        <Button
                            style={styles.button}
                            onPress={() => guardarEdicion(item.id)}
                            appearance='outline'
                            status='primary'
                        >
                            Guardar
                        </Button>
                    </>
                ) : (
                    <>
                        <Text style={styles.tareaTitle}>{item.title}</Text>
                        <Text style={styles.tareaDescription}>{item.description}</Text>
                        <Button
                            style={styles.button}
                            onPress={() => completarTarea(item.id)}
                            appearance='outline'
                            status={item.completed ? 'success' : 'warning'}
                        >
                            {item.completed ? 'Completada' : 'Pendiente'}
                        </Button>
                        <Button
                            style={styles.buttonEdit}
                            onPress={() => habilitarEdicion(item)}
                            status="info"
                            appearance='outline'
                        >
                            Editar
                        </Button>
                        <Button
                            style={styles.buttonDelete}
                            onPress={() => eliminarTareaConfirmacion(item.id)}
                            status="danger"
                            appearance='ghost'
                        >
                            Eliminar
                        </Button>
                    </>
                )}
            </View>
        </Card>
    );
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <Text category='h1' style={styles.title}>Mis Tareas</Text>
            {/* Campo de búsqueda */}
            <TextInput
                style={styles.input}
                placeholder="Buscar por título"
                value={busqueda}
                onChangeText={setBusqueda}
            />


            
            <Text category='h5' style={styles.title}>Agregar</Text>
            <TextInput
                style={styles.input}
                placeholder="Agregar nueva tarea"
                value={nuevaTarea}
                onChangeText={setNuevaTarea}
            />
            <TextInput
                style={styles.input}
                placeholder="Agregar descripción"
                value={nuevaDescripcion}
                onChangeText={setNuevaDescripcion}
            />
            <Button onPress={agregarNuevaTarea} style={styles.addButton}>
                Agregar Tarea
            </Button>
            <FlatList
                data={tareasFiltradas}
                renderItem={renderTareaCard}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 20 }}
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
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
    },
    inputEdit: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 10,
    },
    addButton: {
        marginBottom: 20,
    },
    card: {
        marginBottom: 15,
        padding: 15,
    },
    cardContent: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    tareaTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
    },
    tareaDescription: {
        fontSize: 14,
        marginBottom: 10,
        color: '#555',
    },
    button: {
        marginTop: 5,
        width: '100%',
    },
    buttonEdit: {
        marginTop: 5,
        width: '100%',
    },
    buttonDelete: {
        marginTop: 5,
        width: '100%',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});