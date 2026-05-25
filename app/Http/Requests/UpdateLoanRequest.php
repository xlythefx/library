<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLoanRequest extends FormRequest
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
            'issued_by' => ['sometimes', 'required', 'integer', 'exists:users,id'],
            'issue_date' => ['sometimes', 'required', 'date'],
            'due_date' => ['sometimes', 'required', 'date'],
            'return_date' => ['nullable', 'date'],
            'status' => ['sometimes', Rule::in(['active', 'returned', 'overdue'])],
        ];
    }
}
