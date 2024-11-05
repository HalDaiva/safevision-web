    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
    import {
        getAuth,
        signInWithEmailAndPassword,
        onAuthStateChanged,
    } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
    import {
        getDatabase,
        ref,
        get,
        set,
        onValue,
        remove,
    } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js";
    import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-storage.js";


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
    const db = getDatabase(app);
    const storage = getStorage(app);


    document.addEventListener("DOMContentLoaded", () => {
        const loginForm = document.getElementById("loginForm");
        if (loginForm) {
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
                        alert("Error: " + error.message);
                    });
            });
        }

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
                    .catch((error) => console.error(error));
            } else {
                document.querySelector(".user-info").textContent =
                    "User not signed in";
            }
        });

        const dataTable = document.getElementById("data-table");

        function fetchData(callback) {
            const usersRef = ref(db, "users");
            onValue(usersRef, (snapshot) => {
                const data = snapshot.val();
                callback(data);
            });
        }

        if (dataTable) {
            fetchData((data) => {
                for (const userId in data) {
                    const user = data[userId];
                    if (user.Record) {
                        for (const RecordId in user.Record) {
                            const Record = user.Record[RecordId];
                            const row = document.createElement("li");
                            row.classList.add("table-row");
                            row.innerHTML = `
                                <div class="col col-1" data-label="Date">${Record.Date}</div>
                                <div class="col col-2" data-label="Camera">${Record.Camera}</div>
                                <div class="col col-3" data-label="Video Record"><a href="${Record.Video}" target="_blank">View Video</a></div>
                                <div class="col col-4" data-label="Action"><button class="delete-btn" data-user-id="${userId}" data-video-id="${RecordId}">Delete</button></div>
                            `;
                            dataTable.appendChild(row);
                        }
                    }
                }
            });

            dataTable.addEventListener("click", (event) => {
                if (event.target.classList.contains("delete-btn")) {
                    const userId = event.target.getAttribute("data-user-id");
                    const videoId = event.target.getAttribute("data-video-id");
                    const videoRef = ref(db, `users/${userId}/Video/${videoId}`);

                    remove(videoRef)
                        .then(() => {
                            // alert("Video deleted successfully!");
                            event.target.closest(".table-row").remove();
                        })
                        .catch((error) =>
                            console.error("Error removing document: ", error)
                        );
                }
            });
        } else {
            // console.error("Element with ID 'data-table' not found.");
        }
    });

    export function sendToFirebase(blob) {
        const reader = new FileReader();
        reader.onloadend = function () {
            const imageUrl = reader.result;  // Convert the image to a base64 URL

            // Firebase Realtime Database Reference
            const userId = auth.currentUser ? auth.currentUser.uid : "guest";
            const timestamp = new Date().toISOString();
            const videoRef = ref(db, `users/im4Ine2p2ZMxTyrcGjDAas79xeS2/Video`);

            // Save the base64 image URL to Firebase Database
            set(videoRef, {
                timestamp: timestamp,
                image: imageUrl,
                camera: "cam1"
            }).then(() => {
                // console.log("Frame sent to Firebase successfully");
            }).catch((error) => {
                // console.error("Error uploading frame to Firebase:", error);
            });
        };

        if (blob instanceof Blob) {
            reader.readAsDataURL(blob);  // Read the blob and convert it to base64
        } else {
            // console.error("Data is not a Blob:", blob);
        }
    }

    export function sendDetectionsToFirebase(detections) {
        const firebaseData = {
            detection: detections.map(detection => ({
                bbox: detection.bbox,
                confidence: detection.confidence,
                label: detection.label
            }))
        };

        // Use the modular Firebase functions to reference the path
        const databaseRef = ref(db, `users/im4Ine2p2ZMxTyrcGjDAas79xeS2/Video`); // Reference to the user-specific path

        // Using set to save the detection data
        set(databaseRef, firebaseData)
            .then(() => {
                // console.log("Detection data sent to Firebase Realtime Database successfully!");
            })
            .catch((error) => {
                // console.error("Error sending detection data to Firebase: ", error);
            });
    }

    export function sendVideoToFirebase(blobs) {
        const blob = new Blob(blobs, { type: "video/webm" });
        const videoPath = `Video-Capture/${new Date().toISOString()}.webm`;
        const storageReference = storageRef(storage, videoPath);
    
        uploadBytes(storageReference, blob).then((snapshot) => {
            console.log("Uploaded a video file to Firebase Storage!");
    
            getDownloadURL(snapshot.ref).then((downloadURL) => {
                console.log("File available at", downloadURL);
    
                const videoData = {
                    Camera: "kamera 1",
                    Date: new Date().toISOString(),
                    Video: downloadURL,
                };
    
                const userId = auth.currentUser ? auth.currentUser.uid : "guest"; // Get the current user ID
                const videosRef = ref(db, `users/${userId}/Record`);
    
                get(videosRef)
                    .then((snapshot) => {
                        const nextIndex = snapshot.size || 0;
                        
                        const indexRef = ref(db, `users/${userId}/Record/${nextIndex}`);
                        set(indexRef, videoData)
                            .then(() => {
                                console.log("Video metadata saved to Firebase Realtime Database!");
                            })
                            .catch((error) => console.error("Error writing data to Firebase:", error));
                    })
                    .catch((error) => console.error("Error retrieving data from Firebase:", error)
                );
            });
        }).catch((error) => console.error("Error uploading video to Firebase Storage:", error));
    }
    