import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBsYG-Kf29UwuLOekxHr9BGISwoNPfnv7I",
    authDomain: "proyecto-pvc.firebaseapp.com",
    projectId: "proyecto-pvc",
    storageBucket: "proyecto-pvc.firebasestorage.app",
    messagingSenderId: "242133432177",
    appId: "1:242133432177:web:d9800add14a832792628d0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);