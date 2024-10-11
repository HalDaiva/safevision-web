document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('video');
    const toggle = document.querySelector('.toggle'); 
    const cameraStatus = document.querySelector('.camera-status'); 
    let stream; 

    function startCamera() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(mediaStream) {
                stream = mediaStream; 
                video.srcObject = stream; 
                cameraStatus.style.display = 'none'; 
            })
            .catch(function(error) {
                console.error("Error accessing the camera: ", error);
            });
    }

    toggle.classList.remove('active'); 
    video.srcObject = null; 
    cameraStatus.style.display = 'block'; 

    toggle.addEventListener('click', function() {
        this.classList.toggle('active'); 

        if (this.classList.contains('active')) {
            if (!stream) {
                startCamera(); 
            } else {
                video.srcObject = stream; 
                cameraStatus.style.display = 'none'; 
            }
        } else {
            video.srcObject = null; // Hentikan aliran video
            cameraStatus.style.display = 'block'; // Tampilkan status saat kamera tidak aktif
            if (stream) {
                // Hentikan semua track video secara eksplisit
                stream.getTracks().forEach(track => {
                    track.stop(); // Stop each track, turning off the camera
                });
                stream = null; // Kosongkan stream agar kamera benar-benar mati
            }
        }
    });
});
