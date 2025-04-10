import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "gupshup-bddd2.firebaseapp.com",
  projectId: "gupshup-bddd2",
  storageBucket: "gupshup-bddd2.firebasestorage.app",
  messagingSenderId: "944267067833",
  appId: "1:944267067833:web:0d4189d0930b70a7bb3668",
  measurementId: "G-J9SZS0DTXZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
