
import { sendToFirebase } from './firebase.js';


document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById("video");
    const toggle = document.querySelector(".toggle");
    const cameraStatus = document.querySelector(".camera-status");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    let stream;

    canvas.style.display = "none";

    var pusher = new Pusher("c1da5e3f9f0c274c3068", {
        cluster: "ap1",
    });

    const channel = pusher.subscribe("video-stream");

    function startCamera() {
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then(function (mediaStream) {
                stream = mediaStream;
                video.srcObject = stream;
                cameraStatus.style.display = "none";
                video.style.display = "none";
                canvas.style.display = "block";
                captureFrame();
            })
            .catch(function (error) {
                console.error("Error accessing the camera: ", error);
            });
    }

    toggle.classList.remove("active");
    video.srcObject = null;
    cameraStatus.style.display = "block";

    toggle.addEventListener("click", function () {
        this.classList.toggle("active");

        if (this.classList.contains("active")) {
            if (!stream) {
                startCamera();
            } else {
                video.srcObject = stream;
                cameraStatus.style.display = "none";
                video.style.display = "none";
                canvas.style.display = "block";
            }
        } else {
            video.srcObject = null;
            cameraStatus.style.display = "block";
            if (stream) {
                stream.getTracks().forEach((track) => {
                    track.stop();
                });
                stream = null;
            }
        }
    });

    function captureFrame() {
        if (video.srcObject) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(function (blob) {
                console.log("New Blob size: ", blob.size);  // This should print different sizes for different frames
                sendFrame(blob);
                sendToFirebase(blob);
            }, "image/jpeg", 0.25);
        }
        setTimeout(captureFrame, 100);  // Capture frame every 500ms
    }


    function sendFrame(blob) {
        const formData = new FormData();
        formData.append("image", blob);

        fetch("http://127.0.0.1:5000/detect", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Data received from Flask:", data);
                handleDetections(data);
            })
            .catch((error) => {
                console.error("Error sending frame to Flask API: ", error);
            });
    }

    function handleDetections(detections) {
        if (!detections || detections.length === 0) {
            console.error("No detections received.");
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        detections.forEach((detection) => {
            const { label, confidence, bbox } = detection;
            const [x, y, width, height] = bbox;

            ctx.strokeStyle = label === "Human" ? "red" : "green";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
            ctx.fillStyle = ctx.strokeStyle;
            ctx.font = "16px Arial";
            ctx.fillText(
                `${label} (${(confidence * 100).toFixed(2)}%)`,
                x,
                y > 10 ? y - 5 : 10
            );
        });
    }

    // function sendToFirebase(blob) {
    //     const reader = new FileReader();
    //     reader.onloadend = function () {
    //         const imageUrl = reader.result;  // Convert the image to a base64 URL
    //
    //         // Firebase Realtime Database Reference
    //         const userId = auth.currentUser ? auth.currentUser.uid : "guest";
    //         const timestamp = new Date().toISOString();
    //         const videoRef = ref(db, `users/${userId}/Video/${timestamp}`);
    //
    //         // Save the base64 image URL to Firebase Database
    //         set(videoRef, {
    //             timestamp: timestamp,
    //             image: imageUrl,
    //             camera: "Webcam"
    //         }).then(() => {
    //             console.log("Frame sent to Firebase successfully");
    //         }).catch((error) => {
    //             console.error("Error uploading frame to Firebase:", error);
    //         });
    //     };
    //
    //     if (blob instanceof Blob) {
    //         reader.readAsDataURL(blob);  // Read the blob and convert it to base64
    //     } else {
    //         console.error("Data is not a Blob:", blob);
    //     }
    // }


    channel.bind('client-frame-captured', (data) => {
        alert("test");
    });


});
