import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCBKwpeelv20sb8O2_LBQu0FbNW_7jzo94",
  authDomain: "netflix-clone-b156d.firebaseapp.com",
  projectId: "netflix-clone-b156d",
  storageBucket: "netflix-clone-b156d.appspot.com",
  messagingSenderId: "717864231523",
  appId: "1:717864231523:web:c554ccead265a50c0bce56",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

export { app, db, auth };
