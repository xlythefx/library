<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'book_id' => ['sometimes', 'required', 'integer', 'exists:books,id'],
            'member_id' => ['sometimes', 'required', 'integer', 'exists:members,id'],
            'reserved_at' => ['sometimes', 'date'],
            'status' => ['sometimes', Rule::in(['pending', 'fulfilled', 'cancelled'])],
        ];
    }
}
