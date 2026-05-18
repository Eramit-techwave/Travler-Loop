import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBW2K1T17efLvjSyVUAuH6DrXReeP_fCt4",
  authDomain: "travelloop-3665d.firebaseapp.com",
  projectId: "travelloop-3665d",
  storageBucket: "travelloop-3665d.firebasestorage.app",
  messagingSenderId: "30915691226",
  appId: "1:30915691226:web:0a7fdee3aaed1cf5bfdbe3"
};

console.log('🔵 [Firebase] Initializing with config:', firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

console.log('✅ [Firebase] Initialized successfully');
console.log('✅ [Auth] Instance created');
console.log('✅ [GoogleProvider] Instance created');

// ── Extra scopes so Google returns display name + photo ──
googleProvider.addScope('profile');
googleProvider.addScope('email');

// ── Always show account picker ──
googleProvider.setCustomParameters({ prompt: 'select_account' });

export { auth, googleProvider, signInWithPopup };