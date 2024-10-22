import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import {
    getDatabase,
    ref,
    get
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js"; 

const firebaseConfig = {
    apiKey: "AIzaSyAag-kBJrvMgAuVEFyff0MmyAnmRjaK0Hs",
    authDomain: "safevision-4acd3.firebaseapp.com",
    databaseURL: "https://safevision-4acd3-default-rtdb.firebaseio.com",
    projectId: "safevision-4acd3",
    storageBucket: "safevision-4acd3.appspot.com",
    messagingSenderId: "625953990876",
    appId: "1:625953990876:web:787aa02a700937ecc46c19",
    measurementId: "G-2SEM6WJRSS",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

const loginForm = document.getElementById("loginForm");
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                window.location.href = "/main";
                alert("Login successful!");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert("Error: " + errorMessage);
            });
    });
});

const db = getDatabase(app);

onAuthStateChanged(auth, (user) => {
    if (user) {
        const userId = user.uid;
        const userRef = ref(db, "users/" + userId);

        get(userRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const userName = userData.name;

                    document.querySelector(
                        ".user-info"
                    ).textContent = `${userName}`;
                } else {
                    document.querySelector(
                        ".user-info"
                    ).textContent = `Please Initial Name!`;
                }
            })
            .catch((error) => {
                console.error(error);
            });
    } else {
        document.querySelector(".user-info").textContent = "User not signed in";
    }
});
