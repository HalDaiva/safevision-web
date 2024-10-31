<?php

use App\Events\FrameCaptured;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VideoStreamController;

Route::get('/', function () {
    return view('login');
});


Route::get('/main', function () {
    return view('main');
})->name('main');

Route::get('/database', function () {
    return view('database');
});

Route::post('/handle-frame', [VideoStreamController::class, 'handleFrameCaptured']);

Route::get('/trigger-event', function () {
    $message = "This is a test message!";
    broadcast(new FrameCaptured($message));
    return "Event has been triggered!";
});
