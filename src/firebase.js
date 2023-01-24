// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwuPtm1EpqSoeuYvj9RiR6eSVGMY_GAEM",
  authDomain: "ticket-system-web.firebaseapp.com",
  projectId: "ticket-system-web",
  storageBucket: "ticket-system-web.appspot.com",
  messagingSenderId: "726134350364",
  appId: "1:726134350364:web:5c7c2b89d0ed76782975d9",
  measurementId: "G-LJ62G5GL78",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


