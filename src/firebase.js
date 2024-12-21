import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyC6hI652TZS5xxqiiVnNugVugLj-pLtGOg",
  authDomain: "react-financial-tracker-app-se.firebaseapp.com",
  projectId: "react-financial-tracker-app-se",
  storageBucket: "react-financial-tracker-app-se.firebasestorage.app",
  messagingSenderId: "659179960171",
  appId: "1:659179960171:web:a6623c25741e47bc8d3e2e",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, doc, setDoc };