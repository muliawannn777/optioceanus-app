// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Impor Firestore
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCF93W0TYCmzkCCgMKG5Ifv0FoG6KF38tc",
  authDomain: "optioceanus-auth.firebaseapp.com",
  projectId: "optioceanus-auth",
  storageBucket: "optioceanus-auth.firebasestorage.app",
  messagingSenderId: "424581911550",
  appId: "1:424581911550:web:16d35a969bf43969ab66af"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); // Inisialisasi dan ekspor Firestore
export default app; 