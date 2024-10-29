document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById("video");
    const toggle = document.querySelector(".toggle");
    const cameraStatus = document.querySelector(".camera-status");
    const ctx = canvas.getContext("2d");
    let stream;

    canvas.style.display = "none";

    const pusher = new Pusher("910a56418d0cd8b33a61", {
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
        const reader = new FileReader();
            reader.onloadend = function () {
                const imageUrl = reader.result;
                channel.trigger("client-frame-captured", {
                    image: imageUrl,
                });
            };
    
            if (blob instanceof Blob) {
                reader.readAsDataURL(blob); 
            } else {
                console.error("Provided data is not of type Blob:", blob);
            }
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
                sendFrame(blob);
            }, "image/jpeg");
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

            if (label === "Human") {
                ctx.strokeStyle = "red";
            } else {
                ctx.strokeStyle = "green";
            }

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

        canvas.toBlob(function (blob) {
            sendToPusher(blob);
        }, "image/jpeg");
    }

    function sendToPusher(blob) {
        const reader = new FileReader();
        reader.onloadend = function () {
            const imageUrl = reader.result;

            // console.log("URL Pusher:", imageUrl);

            channel.trigger("client-frame-captured", {
                image: imageUrl,
            });
        };

        if (blob instanceof Blob) {
            reader.readAsDataURL(blob);
        } else {
            console.error("Provided data is not of type Blob:", blob);
        }
    }
});
