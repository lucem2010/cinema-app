// firebaseConfig.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Import Firebase Authentication
import { getFirestore } from 'firebase/firestore'; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwOAu376m29uzE27_QgmZdKTTU02WKMo4",
  authDomain: "cinemamanagementapp.firebaseapp.com",
  projectId: "cinemamanagementapp",
  storageBucket: "cinemamanagementapp.appspot.com",
  messagingSenderId: "346824643137",
  appId: "1:346824643137:web:7b31b977ba78e1c99dacc0",
  measurementId: "G-9Z0FH06GYN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase Authentication and Firestore instances
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
