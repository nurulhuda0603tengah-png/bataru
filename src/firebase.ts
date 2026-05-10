// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvC3Q68o94th5jt8QAmWHOaG1CvgYZUI0",
  authDomain: "bataru-6ac95.firebaseapp.com",
  projectId: "bataru-6ac95",
  storageBucket: "bataru-6ac95.firebasestorage.app",
  messagingSenderId: "358959911608",
  appId: "1:358959911608:web:02b708bfc8fda50d47da4d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const auth = getAuth(app);
