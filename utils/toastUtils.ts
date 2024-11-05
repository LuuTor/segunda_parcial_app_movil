import Toast from 'react-native-toast-message';

export const showToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    Toast.show({
        type: type,
        text1: title,
        text2: message,
        position: 'top',
        visibilityTime: 4000, // Tiempo en que el toast es visible (en milisegundos)
        autoHide: true, // Desaparece automáticamente
        topOffset: 50, // Offset desde la parte superior de la pantalla
    });
};
