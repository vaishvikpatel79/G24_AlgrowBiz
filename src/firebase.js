 // Import the functions you need from the SDKs you need
 import { initializeApp } from "firebase/app";
 import { getAnalytics } from "firebase/analytics";
 import { getFirestore } from 'firebase/firestore';
 import { getAuth } from 'firebase/auth';
 
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries
 
 // Your web app's Firebase configuration
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional
 const firebaseConfig = {
   apiKey: "AIzaSyA-xrkb8W-5jMhj-vM5su6joBhczPInN_w",
   authDomain: "sales-forecast-loginsignup.firebaseapp.com",
   projectId: "sales-forecast-loginsignup",
   storageBucket: "sales-forecast-loginsignup.appspot.com",
   messagingSenderId: "168406644441",
   appId: "1:168406644441:web:07ba5ac852bfca17be70c8",
   measurementId: "G-3NBLTHB89Q"
 };
 
 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const analytics = getAnalytics(app);
 export const db = getFirestore(app);
 export const auth = getAuth(app);