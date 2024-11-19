// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDLkMG2Jrabl5P5MJobpKlq015PqsV2F-w",
  authDomain: "rendez-view-1927.firebaseapp.com",
  projectId: "rendez-view-1927",
  storageBucket: "rendez-view-1927.appspot.com",
  messagingSenderId: "608896483975",
  appId: "1:608896483975:web:d8be2d023dc9624c62ae22"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
auth.useDeviceLanguage(); // Set language to device default

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
export default app;