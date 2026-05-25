<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLoanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'book_id' => ['required', 'integer', 'exists:books,id'],
            'member_id' => ['required', 'integer', 'exists:members,id'],
            'issued_by' => ['required', 'integer', 'exists:users,id'],
            'issue_date' => ['required', 'date'],
            'due_date' => ['required', 'date', 'after_or_equal:issue_date'],
            'return_date' => ['nullable', 'date'],
            'status' => ['sometimes', Rule::in(['active', 'returned', 'overdue'])],
        ];
    }
}
