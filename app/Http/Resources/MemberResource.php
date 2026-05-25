<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MemberResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'membership_number' => $this->membership_number,
            'membership_expiry' => $this->membership_expiry?->toDateString(),
            'status' => $this->status,
            'loans' => LoanResource::collection($this->whenLoaded('loans')),
            'reservations' => ReservationResource::collection($this->whenLoaded('reservations')),
            'fines' => FineResource::collection($this->whenLoaded('fines')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
