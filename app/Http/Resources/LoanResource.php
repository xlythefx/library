<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LoanResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'book_id' => $this->book_id,
            'member_id' => $this->member_id,
            'issued_by' => $this->issued_by,
            'issue_date' => $this->issue_date?->toDateString(),
            'due_date' => $this->due_date?->toDateString(),
            'return_date' => $this->return_date?->toDateString(),
            'status' => $this->status,
            'book' => new BookResource($this->whenLoaded('book')),
            'member' => new MemberResource($this->whenLoaded('member')),
            'issuer' => new UserResource($this->whenLoaded('issuer')),
            'fine' => new FineResource($this->whenLoaded('fine')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
