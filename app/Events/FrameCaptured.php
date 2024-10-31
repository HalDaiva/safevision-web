<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Queue\SerializesModels;

class FrameCaptured implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;


    public function __construct($message)
    {
        $this->message = $message;
        \Log::info('FrameCaptured event created with image: ' . $message);
    }

    public function broadcastOn()
    {
        return new Channel('video-stream'); //channel
//        return ['video-stream']; //channel
    }

    public function broadcastAs()
    {
        return 'client-frame-captured'; //event
    }
}
