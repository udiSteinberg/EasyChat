import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCpd4MrRoPREI1gEk6W9zh0tQwqpEFG2wU",
    authDomain: "just-chat-52b66.firebaseapp.com",
    projectId: "just-chat-52b66",
    storageBucket: "just-chat-52b66.appspot.com",
    messagingSenderId: "541002889853",
    appId: "1:541002889853:web:2ba042fe86f96de5a94f14"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
