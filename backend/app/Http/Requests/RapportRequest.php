<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RapportRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'id'=>'string',
            'date_operation' => 'required|date',
            'secteur' => 'nullable|string',
            'engin' => 'nullable|string',
            'data' => 'required|array',
            'data.*.nom_arret' => 'required|string',
            'data.*.type_arret' => 'required|string',
            'data.*.time_operation' => 'required|string',
            'data.*.d' => 'numeric',
            'data.*.f' => 'numeric',
            'data.*.df' => 'nullable|numeric',
            'data.*.post' => 'required|string',
            
        ];
    }
}
