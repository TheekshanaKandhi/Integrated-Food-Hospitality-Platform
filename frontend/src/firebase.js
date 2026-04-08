import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBtXqyHcayGMGubVWlCNvL5LjcqnvhpcAE",
  authDomain: "foodapp-c3ef0.firebaseapp.com",
  projectId: "foodapp-c3ef0",
  storageBucket: "foodapp-c3ef0.firebasestorage.app",
  messagingSenderId: "698905785146",
  appId: "1:698905785146:web:0847e68b8352c049fcd603",
  measurementId: "G-W6F2XH7TTG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };