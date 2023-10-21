import { initializeApp } from "firebase/app";
import dotenv from "dotenv";

const firebaseConfig = () => ({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const config = () => {
    try {
        dotenv.config();
        initializeApp(firebaseConfig());
    } catch (error) {
        console.log(error);
    }
};

export { config };
