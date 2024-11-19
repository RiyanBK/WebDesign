import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDLkMG2Jrabl5P5MJobpKlq015PqsV2F-w",
  authDomain: "rendez-view-1927.firebaseapp.com",
  projectId: "rendez-view-1927",
  storageBucket: "rendez-view-1927.firebasestorage.app",
  messagingSenderId: "608896483975",
  appId: "1:608896483975:web:d8be2d023dc9624c62ae22"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Create composite index for events
const createEventIndex = async () => {
  try {
    const eventsRef = collection(db, 'events');
    await query(
      eventsRef,
      where('userId', '==', ''),
      where('date', '>=', ''),
      where('date', '<=', '')
    );
  } catch (error) {
    console.error("Error creating index:", error);
  }
};

// Call this function once
createEventIndex();

export default app;