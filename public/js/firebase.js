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
        update,
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
    const videoModal = document.getElementById("videoModal");
    const modalVideo = document.getElementById("modalVideo");
    const closeBtn = document.getElementsByClassName("close")[0];


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
        
        onAuthStateChanged(auth, (user) => {
            if (dataTable) {
                if (user) {
                    const userId = user.uid;
                    const userRecordsRef = ref(db, `users/${userId}/Record`);
                    onValue(userRecordsRef, (snapshot) => {
                        const data = snapshot.val();
                        if (data) {
                            dataTable.querySelectorAll(".table-row").forEach(row => row.remove());
                            // dataTable.innerHTML = ''; 
        
                            const recordArray = Object.entries(data).map(([recordId, record]) => {
                                return {
                                    id: recordId,
                                    ...record
                                };
                            }).sort((a, b) => new Date(b.Date) - new Date(a.Date));
                            
                            for (const record of recordArray) { 
                                const row = document.createElement("li");
                                row.classList.add("table-row");
                                row.innerHTML = `
                                    <div class="col col-1" data-label="Date">${formatDate(record.Date)}</div>
                                    <div class="col col-2" data-label="Camera">${record.Camera}</div>
                                    <div class="col col-3" data-label="Video Record">
                                        <div class="play">
                                            <a href="${record.Video}" target="_blank">
                                                <button class="b1" id="b1" type="button">Play Video</button>
                                            </a>
                                        </div>
                                    </div>
                                    <div class="col col-4" data-label="Action">
                                        <button class="delete-btn" data-user-id="${userId}" data-video-id="${record.id}">Delete</button>
                                    </div>
                                `;
                                dataTable.appendChild(row);
                            }
                        }
                    });
                }
    
                dataTable.addEventListener("click", (event) => {
                    if (event.target.tagName === "BUTTON" && event.target.id === "b1") {
                        event.preventDefault();
    
                        const videoUrl = event.target.closest("a").getAttribute("href");
                        modalVideo.src = videoUrl;
                        videoModal.style.display = "block";
                    }
                });
    
                closeBtn.onclick == function() {
                    videoModal.style.display = "none";
                    modalVideo.onpause();
                    modalVideo.src = "";
                };
    
                window.onclick = function(event) {
                    if (event.target === videoModal) {
                        videoModal.style.display = "none";
                        modalVideo.onpause();
                        modalVideo.src = "";
                    }
                };
    
                dataTable.addEventListener("click", (event) => {
                    if (event.target.classList.contains("delete-btn")) {
                        const userId = event.target.getAttribute("data-user-id");
                        const videoId = event.target.getAttribute("data-video-id");
                        const videoRef = ref(db, `users/${userId}/Record/${videoId}`);
                
                        Swal.fire({
                            title: "Are you sure?",
                            text: "You won't be able to revert this!",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#3085d6",
                            cancelButtonColor: "#d33",
                            confirmButtonText: "Yes, delete it!"
                        }).then((result) => {
                            if (result.isConfirmed) {
                                remove(videoRef)
                                    .then(() => {
                                        Swal.fire({
                                            title: "Deleted!",
                                            text: "Your file has been deleted.",
                                            icon: "success"
                                        });                
                                        event.target.closest(".table-row").remove();
                                    })
                                    .catch((error) => {
                                        console.error("Error removing document: ", error);
                                        Swal.fire({
                                            title: "Error!",
                                            text: "There was an issue deleting the file.",
                                            icon: "error"
                                        });
                                    });
                            }
                        });
                    }
                });
            } else {
                // console.error("Element with ID 'data-table' not found.");
            }
        });
    });

    function formatDate(isoString) {
        const date = new Date(isoString);

        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thurday", "Friday", "Saturday"];
        const months = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
        ];

        const day = days[date.getDay()];
        const dayNum = String(date.getDate()).padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}, ${dayNum} ${month} ${year}, \n${hours}:${minutes}:${seconds} WIB`;

    }

    export function sendToFirebase(blob) {
        const reader = new FileReader();
        reader.onloadend = function () {
            const imageUrl = reader.result;  

        const userId = auth.currentUser ? auth.currentUser.uid : "guest";
        const timestamp = new Date().toISOString();
        const videoRef = ref(db, `users/` + auth.currentUser.uid + `/Video`);

        update(videoRef, {
            timestamp: timestamp,
            image: imageUrl,
            camera: "cam1"
        }).then(() => {
            console.log("Frame sent to Firebase successfully");
        }).catch((error) => {
            console.error("Error uploading frame to Firebase:", error);
        });
    };

        if (blob instanceof Blob) {
            reader.readAsDataURL(blob);  
        } else {
            // console.error("Data is not a Blob:", blob);
        }
    }

    export function sendNotification(imageData, timestamp) {
        const notificationRef = ref(db, `users/` + auth.currentUser.uid + `/Notification`);

        get(notificationRef)
            .then((snapshot) => {
                let currentIndex = 0;
                if (snapshot.exists()) {
                    const currentData = snapshot.val();
                    currentIndex = Object.keys(currentData).length;
                }
                
                const notificationData = {
                    Image: imageData,
                    Timestamp: timestamp
                };

                update(notificationRef, {
                    [currentIndex]: notificationData
                }).then(() => {
                    console.log('Notifikasi berhasil dikirim ke Firebase dengan indeks:', currentIndex);
                }).catch((error) => {
                    console.error('Gagal mengirim notifikasi ke Firebase:', error);
                });
            })
            .catch((error) => {
                console.error('Gagal mendapatkan data dari Firebase:', error);
            });
    }

    export function sendDetectionsToFirebase(detections) {
        const firebaseData = {
            detection: detections.map(detection => ({
                bbox: detection.bbox,
                confidence: detection.confidence,
                label: detection.label
            }))
        };

    const databaseRef = ref(db, `users/` + auth.currentUser.uid + `/Video`); 

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
