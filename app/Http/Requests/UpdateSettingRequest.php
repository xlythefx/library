<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('setting')?->id ?? $this->route('setting');
        return [
            'key' => ['sometimes', 'required', 'string', 'max:255', Rule::unique('settings', 'key')->ignore($id)],
            'value' => ['sometimes', 'required', 'string', 'max:255'],
        ];
    }
}
