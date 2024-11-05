// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Asegúrate de que está instalado
import { getStorage } from 'firebase/storage';
import { getFirestore, initializeFirestore } from 'firebase/firestore'; // Importar Firestore



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBIgvGtd-uPgTpKz0DWkRiXc1GmO9pDRGM",
    authDomain: "nutricionista-836ba.firebaseapp.com",
    projectId: "nutricionista-836ba",
    storageBucket: "nutricionista-836ba.appspot.com",
    messagingSenderId: "564236041843",
    appId: "1:564236041843:web:5d9222ab080274189a7406",
    measurementId: "G-9VQYY0062E"
};


// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firebase Auth con persistencia en AsyncStorage
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

export const FIREBASE_APP = app;
export const FIREBASE_AUTH = auth;
// Inicializa Firebase Storage
export const FIREBASE_STORAGE = getStorage(app);
export const FIREBASE_FIRESTORE = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});