import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBW2K1T17efLvjSyVUAuH6DrXReeP_fCt4",
  authDomain: "travelloop-3665d.firebaseapp.com",
  projectId: "travelloop-3665d",
  storageBucket: "travelloop-3665d.firebasestorage.app",
  messagingSenderId: "30915691226",
  appId: "1:30915691226:web:0a7fdee3aaed1cf5bfdbe3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google OAuth scopes
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { signInWithRedirect };