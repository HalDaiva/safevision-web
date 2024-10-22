<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('login');
});


Route::get('/main', function () {
    return view('main');
})->name('main');