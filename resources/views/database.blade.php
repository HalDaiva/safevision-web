@extends('layout.navbar')

@section('title', 'Database')

@section('content')

<link rel="stylesheet" href="{{ asset('css/database.css') }}">
<div class="container">
    <h2>Responsive Tables Using LI <small>Triggers on 767px</small></h2>
    <ul class="responsive-table">
        <li class="table-header">
            <div class="col col-1">Date</div>
            <div class="col col-2">Camera</div>
            <div class="col col-3">Video Record</div>
            <div class="col col-4">Action</div>
        </li>
        <li class="table-row">
            <div class="col col-1" data-label="Job Id">42235</div>
            <div class="col col-2" data-label="Customer Name">John Doe</div>
            <div class="col col-3" data-label="Amount">$350</div>
            <div class="col col-4" data-label="Payment Status">Pending</div>
        </li>
        <li class="table-row">
            <div class="col col-1" data-label="Job Id">42442</div>
            <div class="col col-2" data-label="Customer Name">Jennifer Smith</div>
            <div class="col col-3" data-label="Amount">$220</div>
            <div class="col col-4" data-label="Payment Status">Pending</div>
        </li>
        <li class="table-row">
            <div class="col col-1" data-label="Job Id">42257</div>
            <div class="col col-2" data-label="Customer Name">John Smith</div>
            <div class="col col-3" data-label="Amount">$341</div>
            <div class="col col-4" data-label="Payment Status">Pending</div>
        </li>
        <li class="table-row">
            <div class="col col-1" data-label="Job Id">42311</div>
            <div class="col col-2" data-label="Customer Name">John Carpenter</div>
            <div class="col col-3" data-label="Amount">$115</div>
            <div class="col col-4" data-label="Payment Status">Pending</div>
        </li>
    </ul>
</div>
<script type="module" src="{{ asset('/js/firebase.js') }}"></script>
@endsection
