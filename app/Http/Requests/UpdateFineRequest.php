<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFineRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('fine')?->id ?? $this->route('fine');
        return [
            'loan_id' => ['sometimes', 'required', 'integer', 'exists:loans,id', Rule::unique('fines', 'loan_id')->ignore($id)],
            'member_id' => ['sometimes', 'required', 'integer', 'exists:members,id'],
            'amount' => ['sometimes', 'required', 'numeric', 'min:0'],
            'reason' => ['sometimes', 'required', 'string', 'max:255'],
            'is_paid' => ['sometimes', 'boolean'],
            'paid_at' => ['nullable', 'date'],
        ];
    }
}
