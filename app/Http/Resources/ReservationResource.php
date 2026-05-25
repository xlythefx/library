<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'book_id' => $this->book_id,
            'member_id' => $this->member_id,
            'reserved_at' => $this->reserved_at?->toIso8601String(),
            'status' => $this->status,
            'book' => new BookResource($this->whenLoaded('book')),
            'member' => new MemberResource($this->whenLoaded('member')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
