// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAt7uiCshLcIiRh0OFgnujfDC95cMLnp6o",
    authDomain: "hspantry-7a0d3.firebaseapp.com",
    projectId: "hspantry-7a0d3",
    storageBucket: "hspantry-7a0d3.appspot.com",
    messagingSenderId: "1067646181912",
    appId: "1:1067646181912:web:34be56657afe45d461d96d",
    measurementId: "G-0BVSBMHE5N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore();

export default db;