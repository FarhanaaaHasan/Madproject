import { getApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBicx3ieZHxmZw19YqNJUVLvk0RUCzZlyg',
  authDomain: 'medexa-c673d.firebaseapp.com',
  projectId: 'medexa-c673d',
  storageBucket: 'medexa-c673d.firebasestorage.app',
  messagingSenderId: '195065354916',
  appId: '1:195065354916:web:0ae298430d05ab22162431',
};

// Initialize Firebase
let app;
let auth: Auth;
let db: Firestore;

try {
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  console.log('[Firebase] Using existing app instance');
} catch {
  console.log('[Firebase] Initializing new app');
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };

