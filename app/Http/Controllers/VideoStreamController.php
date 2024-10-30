<?php

namespace App\Http\Controllers;

use App\Events\FrameCaptured;
use Illuminate\Http\Request;

class VideoStreamController extends Controller
{
    public function handleFrameCaptured(Request $request)
    {
        $image = $request->input('image');

        event(new FrameCaptured($image));

        return response()->json(['message' => 'Frame sent to Pusher']);
    }
}
