<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SafeVision Dashboard</title>
    <link rel="stylesheet" href="{{ asset('css/main.css') }}">
</head>

<body>
    <div class="container">
        <aside class="sidebar">
            <nav>
                <div class="logo">
                    <img src="{{ asset('images/logo.png') }}" alt="SafeVision Logo" width="100">
                </div>
                <ul>
                    <li><a href="#">
                            <img src="{{ asset('images/Logo-house.png') }}" alt="House Logo" class="nav-icon">
                            Dashboard</a></li>
                    <li><a href="#">
                            <img src="{{ asset('images/Logo-database.png') }}" alt="Database Logo" class="nav-icon">
                            Database</a></li>
                </ul>
            </nav>
        </aside>

        <header class="header">
            <div class="user-info">Nama</div>
        </header>
        <main class="main-content">

            <h1>Dashboard</h1>
            <section class="dashboard">
                <div class="card">
                    <video id="video" autoplay playsinline></video>
                    <div class="camera-status">Camera Non-Active</div> <!-- Elemen status di dalam kotak -->
                    <div class="card-content">
                        <h3>Living Room</h3>
                        <p>CAM2-LIVING</p>
                    </div>
                    <div class="toggle"></div>
                </div>
                <div class="card">
                    <img src="living-room.jpg" alt="Living Room" class="card-image">
                    <div class="card-content">
                        <h3>Living Room</h3>
                        <p>CAM2-LIVING</p>
                    </div>
                    <div class="toggle"></div>
                </div>
                <div class="card">
                    <img src="living-room.jpg" alt="Living Room" class="card-image">
                    <div class="card-content">
                        <h3>Living Room</h3>
                        <p>CAM2-LIVING</p>
                    </div>
                    <div class="toggle"></div>
                </div>
            </section>
        </main>
    </div>
    <script src="{{ asset('js/main.js') }}"></script>
    <script type="module" src="{{ asset('/js/firebase.js') }}"></script>
</body>

</html>