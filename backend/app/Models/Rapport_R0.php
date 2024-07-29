<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Rapport_R0 extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'id',
        'num',
        'nom_arret',
        'type_arret',
        'date_operation',
        'time_operation',
        'd',
        'f',
        'df',
        'post',
        'secteur',
        'engin',
        'hc',
        'htp',
    ];
}
