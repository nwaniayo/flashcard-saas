// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirbase, getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAurY8PgEnalSX66CzUdvAyXnwIHh0SZUo",
  authDomain: "flashcardsaas-d22ee.firebaseapp.com",
  projectId: "flashcardsaas-d22ee",
  storageBucket: "flashcardsaas-d22ee.appspot.com",
  messagingSenderId: "527223632672",
  appId: "1:527223632672:web:b62d9116058bb935609d45",
  measurementId: "G-6ST48XH2CX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

const db = getFirestore(app);
export{db};