<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title')</title>
    <link rel="stylesheet" href="{{ asset('css/main.css') }}">
</head>
<body>
    <aside class="sidebar">
        <nav>
            <div class="logo">
                <img src="{{ asset('images/logo.png') }}" alt="SafeVision Logo" width="100">
            </div>
            <ul>
                <li><a href="/main">
                    <img src="{{ asset('images/Logo-house.png') }}" alt="House Logo" class="nav-icon">
                    Dashboard</a></li>
                <li><a href="/database">
                    <img src="{{ asset('images/Logo-database.png') }}" alt="Database Logo" class="nav-icon">
                    Database</a></li>
            </ul>
        </nav>
    </aside>

    <header class="header">
        <div class="user-info">Nama</div>
    </header>

    <main>
        @yield('content')
    </main>
</body>
</html>
