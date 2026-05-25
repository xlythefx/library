<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:members,email'],
            'phone' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'membership_number' => ['nullable', 'string', 'max:255', 'unique:members,membership_number'],
            'membership_expiry' => ['required', 'date'],
            'status' => ['sometimes', Rule::in(['active', 'suspended', 'expired'])],
        ];
    }
}
