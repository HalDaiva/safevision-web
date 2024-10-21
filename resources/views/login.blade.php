<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LOGIN</title>
    <link rel="stylesheet" href="{{ asset('css/login.css') }}">
</head>

<body>
    <div class="container">
        <img src="{{ asset('images/logo.png') }}" alt="logo">
        <h1>Member Login</h1>
        <form>
            <input type="text" placeholder="User Name">
            <input type="password" placeholder="Password">
            <button>LOGIN</button>
        </form>
        <a href="#">Forgot Password?</a>
    </div>
</body>

</html>