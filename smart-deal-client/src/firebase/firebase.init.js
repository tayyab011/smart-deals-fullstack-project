// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOFQJ5BHt6jcDSGF59G0Rh02GKLDGnVis",
  authDomain: "smart-deals-5d1a0.firebaseapp.com",
  projectId: "smart-deals-5d1a0",
  storageBucket: "smart-deals-5d1a0.firebasestorage.app",
  messagingSenderId: "891257756931",
  appId: "1:891257756931:web:6d2c863cd2b70f5e655d36"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);