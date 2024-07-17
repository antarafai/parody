import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBS9MOfLQeKZzuwNBXh4vqgxOhwOQzy9L8",
  authDomain: "other-social-media.firebaseapp.com",
  projectId: "other-social-media",
  storageBucket: "other-social-media.appspot.com",
  messagingSenderId: "195140434967",
  appId: "1:195140434967:web:5cc2e3b611025795103052"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, onAuthStateChanged };
