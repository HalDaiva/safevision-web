<?php

namespace App\Http\Controllers;

use App\Events\FrameCaptured;
use Illuminate\Http\Request;
use Pusher\Pusher;

class VideoStreamController extends Controller
{
    public function handleFrameCaptured(Request $request)
    {
//        $image = $request->input('image');
        $image = "test";


        event(new FrameCaptured($image));

//        broadcast(new FrameCaptured($image))->via('pusher');
        return response()->json(['message' => 'Frame captured successfully', 'image' => $image]);

//        $pusher = new Pusher("your-app-key", "your-app-secret", "your-app-id", [
//            'cluster' => 'your-cluster',
//            'useTLS' => true
//        ]);
//
//        // Data dikirim dari client-side
//        $data['image'] = $request->input('image'); // URL gambar yang dikirim dari client-side
//
//        // Trigger event ke channel SafeVision
//        $pusher->trigger('SafeVision', 'duel-event', $data);
//
//        return response()->json(['success' => true, 'message' => 'Event sent to Pusher']);
    }


}
