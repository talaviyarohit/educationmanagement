// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAihk5YaM7fh8F-LIehBDoJ8-JIw4U-fHA",
  authDomain: "educationmanagement-ef907.firebaseapp.com",
  projectId: "educationmanagement-ef907",
  storageBucket: "educationmanagement-ef907.appspot.com",
  messagingSenderId: "614166014331",
  appId: "1:614166014331:web:aea2699711d12be15f75de"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };