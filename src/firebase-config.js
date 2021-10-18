import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
    apiKey: "AIzaSyDqKe0LP_f_3hLc2FHkW6M4yCB8G7jiZds",
    authDomain: "twitter-clone-3489b.firebaseapp.com",
    projectId: "twitter-clone-3489b",
    storageBucket: "twitter-clone-3489b.appspot.com",
    messagingSenderId: "131799327976",
    appId: "1:131799327976:web:1e8302662fbdedb398955d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const db = getFirestore(app);

//const timestamp = firestore.FieldValue.serverTimestamp();

export { db };
export default app;