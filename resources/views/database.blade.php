@extends('layout.navbar')

@section('title', 'Database')

@section('content')

<link rel="stylesheet" href="{{ asset('css/database.css') }}">
<div class="container">
    <h2>Responsive Tables Using LI</h2>
    <ul class="responsive-table" id="data-table">
        <li class="table-header">
            <div class="col col-1">Date</div>
            <div class="col col-2">Camera</div>
            <div class="col col-3">Video Record</div>
            <div class="col col-4">Action</div>
        </li>
    </ul>
</div>
<script type="module" src="{{ asset('/js/firebase.js') }}"></script>
@endsection
