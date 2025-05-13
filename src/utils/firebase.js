// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE,
  authDomain: "myblog-437bc.firebaseapp.com",
  projectId: "myblog-437bc",
  storageBucket: "myblog-437bc.firebasestorage.app",
  messagingSenderId: "207140178711",
  appId: "1:207140178711:web:d1760a4f61f1d91f574552",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
