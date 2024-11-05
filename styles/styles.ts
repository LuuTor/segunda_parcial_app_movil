// styles/styles.ts
import { StyleSheet } from 'react-native';

const commonStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start', // Alinear el contenido al inicio
        alignItems: 'center',
        padding: 5,
        backgroundColor: '#fff', // Color de fondo por defecto
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        width: '100%',
        marginBottom: 20,
        padding: 16,
        borderRadius: 8, // Para un efecto de borde redondeado
        shadowColor: '#000', // Sombra de la tarjeta
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Sombra para Android
        backgroundColor: '#f9f9f9', // Color de fondo de la tarjeta
    },
    cardText: {
        fontSize: 16,             // Tamaño de fuente adecuado
        color: '#333',            // Color de texto por defecto (puedes cambiarlo según el tema)
        marginBottom: 8,          // Espacio entre líneas
        lineHeight: 24,           // Espaciado de línea para mejorar la legibilidad
    },
    button: {
        marginBottom: 20,
        width: '100%',
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#007BFF', // Color de fondo del botón
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff', // Color del texto del botón
        fontWeight: 'bold',
    },
    info: {
        marginTop: 10,
        textAlign: 'center',
        color: '#666', // Color del texto de información
    },
    input: {
        height: 48,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 20,
        width: '100%',
    },
    errorText: {
        color: 'red',
        marginTop: 5,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    emptyText: {
        color: '#666',
        fontSize: 18,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f8f8', // Cambia el color según tu diseño
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#34495e',
    },
    searchInput: {
        padding: 10,
        margin: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
});

export default commonStyles;
