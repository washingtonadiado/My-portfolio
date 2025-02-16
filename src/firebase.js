import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { collection, addDoc, getDocs } from "@firebase/firestore"; 


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBzxmq67sEeqCm0qC46piAVAPhBYrq5QII",
  authDomain: "my-portfolio-d3aaa.firebaseapp.com",
  projectId: "my-portfolio-d3aaa",
  storageBucket: "my-portfolio-d3aaa.firebasestorage.app",
  messagingSenderId:  "293904226704",
  appId: "1:293904226704:web:46b5537e0a0c6af91a7b15",
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };