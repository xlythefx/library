<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FineResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'loan_id' => $this->loan_id,
            'member_id' => $this->member_id,
            'amount' => $this->amount,
            'reason' => $this->reason,
            'is_paid' => $this->is_paid,
            'paid_at' => $this->paid_at?->toIso8601String(),
            'loan' => new LoanResource($this->whenLoaded('loan')),
            'member' => new MemberResource($this->whenLoaded('member')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
