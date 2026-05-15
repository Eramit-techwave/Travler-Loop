import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBW2K1T17efLvjSyVUAuH6DrXReeP_fCt4",
  authDomain: "travelloop-3665d.firebaseapp.com",
  projectId: "travelloop-3665d",
  storageBucket: "travelloop-3665d.firebasestorage.app",
  messagingSenderId: "30915691226",
  appId: "1:30915691226:web:0a7fdee3aaed1cf5bfdbe3",
  measurementId: "G-HGFHVQ5V4Q"
};

const app = initializeApp(firebaseConfig);
// In teeno ko dhyan se export karo
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { signInWithPopup };