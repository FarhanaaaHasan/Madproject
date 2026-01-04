import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBicx3ieZHxmZw19YqNJUVLvk0RUCzZlyg',
  authDomain: 'medexa-c673d.firebaseapp.com',
  projectId: 'medexa-c673d',
  storageBucket: 'medexa-c673d.firebasestorage.app',
  messagingSenderId: '195065354916',
  appId: '1:195065354916:web:0ae298430d05ab22162431',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
