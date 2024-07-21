// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCdPIQrzs-y20sxSMe4nRbkQx6tAKL0ggs",
  authDomain: "fittrack-508cd.firebaseapp.com",
  projectId: "fittrack-508cd",
  storageBucket: "fittrack-508cd.appspot.com",
  messagingSenderId: "400114316015",
  appId: "1:400114316015:web:2fcb627032609e82a3e11a"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("Google Sign-In successful:", user);
    return user;
  } catch (error) {
    console.error("Google Sign-In error:", error);
    throw error;
  }
};

export { auth, firestore, signInWithGoogle };
