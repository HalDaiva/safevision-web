<?php

namespace App\Listeners;

use App\Events\FrameCaptured;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class FrameCapturedListener implements ShouldQueue
{
    use InteractsWithQueue, SerializesModels;

    public function handle(FrameCaptured $event)
    {
        $imageData = $event->image; 
    }
}
