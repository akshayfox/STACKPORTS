// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCC4FTEv3t9p804gPObGxvHQcwd9c9FPLc",
  authDomain: "stackports.firebaseapp.com",
  projectId: "stackports",
  storageBucket: "stackports.firebasestorage.app",
  messagingSenderId: "953660819992",
  appId: "1:953660819992:web:0de89b51830f357dafd16d",
  measurementId: "G-KTG8PWVR1S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);