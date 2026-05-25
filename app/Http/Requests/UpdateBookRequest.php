<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBookRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('book')?->id ?? $this->route('book');
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'isbn' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('books', 'isbn')->ignore($id)],
            'description' => ['nullable', 'string'],
            'cover_image' => ['nullable', 'string', 'max:255'],
            'published_year' => ['nullable', 'integer', 'min:0', 'max:65535'],
            'copies_total' => ['sometimes', 'required', 'integer', 'min:0'],
            'copies_available' => ['sometimes', 'required', 'integer', 'min:0'],
            'publisher_id' => ['nullable', 'integer', 'exists:publishers,id'],
            'author_ids' => ['nullable', 'array'],
            'author_ids.*' => ['integer', 'exists:authors,id'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => ['integer', 'exists:categories,id'],
        ];
    }
}
