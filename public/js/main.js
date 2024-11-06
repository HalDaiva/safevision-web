import { sendToFirebase } from "./firebase.js";
import { sendDetectionsToFirebase } from "./firebase.js";
import { sendVideoToFirebase } from "./firebase.js";

document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById("video");
    const toggle = document.querySelector(".toggle");
    const cameraStatus = document.querySelector(".camera-status");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    let stream;
    let recordedBlobs = [];
    let isRecording = false;
    let mediaRecorder;
    let hasEmpty = false;
    let recordTimer; 

    canvas.style.display = "none";

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
                console.error("Error accessing the camera: ", error);p
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
                captureFrame();
            } else {
                video.srcObject = stream;
                cameraStatus.style.display = "none";
                video.style.display = "none";
                canvas.style.display = "block";
            }
        } else {
            stopRecordingSegment(); 
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

    function startRecordingSegment() {
        recordedBlobs = [];
        const options = { mimeType: "video/webm; codecs=vp8" };
        mediaRecorder = new MediaRecorder(stream, options);
    
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start(10); // Kirim data setiap 10ms
        isRecording = true;
        console.log("Recording started.");
    
        startSegmentTimer();
    }
    
    function startSegmentTimer() {
        recordTimer = setTimeout(() => {
            if (!hasEmpty) {
                console.log("Continuing recording as 'Empty' was not detected.");
                startSegmentTimer(); 
            } else {
                stopRecordingSegment(); 
            }
        }, 10000); 
    }
    

    function stopRecordingSegment() {
        if (isRecording) {
            clearTimeout(recordTimer);
            mediaRecorder.stop(); 
            isRecording = false;
            console.log("Recording stopped.");
            console.log("Uploading video to Firebase with recorded blobs:", recordedBlobs);
            sendVideoToFirebase(recordedBlobs); 
            recordedBlobs = []; 
        }
    }

    function handleDataAvailable(event) {
        if (event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    }

    function captureFrame() {
        if (video.srcObject) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(function (blob) {
                sendFrame(blob);
                sendToFirebase(blob);
            }, "image/jpeg", 0.2);
        }
        setTimeout(captureFrame, 500);
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
                handleDetections(data);
            })
            .catch((error) => {
                // console.error("Error sending frame to Flask API: ", error);
            });
    }

    function handleDetections(response) {
        const detections = response.detections;
        sendDetectionsToFirebase(detections);

        hasEmpty = false;

        if (!detections || detections.length === 0) {
            // console.error("No detections received.");
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        hasEmpty = false; // Reset status hasEmpty

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
            if (label === "Empty") {
                hasEmpty = true;
            }
        });

        if (!isRecording) {
            startRecordingSegment(); 
            console.log("Recording started due to non-'Empty' detection.");
        }
    }
});
