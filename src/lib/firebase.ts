import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB1-OPN7md7pwM4q2YBCxM9hHVEvr3NUWg",
  authDomain: "movie-reporter.firebaseapp.com",
  projectId: "movie-reporter",
  storageBucket: "movie-reporter.firebasestorage.app",
  messagingSenderId: "531723763328",
  appId: "1:531723763328:web:75b34bb4e4c9411778f065",
  measurementId: "G-Z2JF0SXPG7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
