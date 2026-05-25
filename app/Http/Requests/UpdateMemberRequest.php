<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('member')?->id ?? $this->route('member');
        return [
            'full_name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('members', 'email')->ignore($id)],
            'phone' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'membership_number' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('members', 'membership_number')->ignore($id)],
            'membership_expiry' => ['sometimes', 'required', 'date'],
            'status' => ['sometimes', Rule::in(['active', 'suspended', 'expired'])],
        ];
    }
}
