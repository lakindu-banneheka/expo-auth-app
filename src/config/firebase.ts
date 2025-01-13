import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDFA6BqtMqYx5k2yFycCz5t3_4Ip0tF0nI",
    authDomain: "loantrackerapp-78d96.firebaseapp.com",
    databaseURL: "https://loantrackerapp-78d96-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "loantrackerapp-78d96",
    storageBucket: "loantrackerapp-78d96.firebasestorage.app",
    messagingSenderId: "1027142167157",
    appId: "1:1027142167157:web:968decea439ac76cdea63c"
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);