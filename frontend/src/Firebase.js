// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4WriHiKrNrALnMFY60r6gapY-fWKrzjY",
  authDomain: "musicapp-11283.firebaseapp.com",
  projectId: "musicapp-11283",
  storageBucket: "musicapp-11283.appspot.com",
  messagingSenderId: "250922353884",
  appId: "1:250922353884:web:038b336690aabddb572019",
  measurementId: "G-KK3HCR91XW",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
