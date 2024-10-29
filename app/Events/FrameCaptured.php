<?php

namespace App\Events;

use Illuminate\Queue\SerializesModels;

class FrameCaptured
{
    use SerializesModels;

    public $image;

    public function __construct($image)
    {
        $this->image = $image;
    }
}