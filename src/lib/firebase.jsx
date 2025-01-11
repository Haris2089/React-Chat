// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmOLZ2-XHu-2zA7KUI6evcTl74axXxHVc" ,
  authDomain: "reactchat-9dcd0.firebaseapp.com",
  projectId: "reactchat-9dcd0",
  storageBucket: "reactchat-9dcd0.firebasestorage.app",
  messagingSenderId: "564548667202",
  appId: "1:564548667202:web:e467c6a1a3cc7dbf1b2adb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth  = getAuth(app);
export const db  = getFirestore(app);
export const storage  = getStorage(app);