@extends('layout.navbar')

@section('title', 'Database')

@section('content')

<link rel="stylesheet" href="{{ asset('css/database.css') }}">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap">
<div class="container">
    <h2>RECORD</h2>
    <ul class="responsive-table" id="data-table">
        <li class="table-header">
            <div class="col col-1">Date</div>
            <div class="col col-2">Camera</div>
            <div class="col col-3">Video Record</div>
            <div class="col col-4">Action</div>
        </li>
    </ul>
    <div id="videoModal" class="modal">
        <span class="close">&times;</span>
        <video id="modalVideo" controls autoplay></video>
    </div>
</div>
<script type="module" src="{{ asset('/js/firebase.js') }}"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
@endsection
