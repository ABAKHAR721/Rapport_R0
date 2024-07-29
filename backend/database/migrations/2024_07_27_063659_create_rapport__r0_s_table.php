<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRapportR0STable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rapport__r0_s', function (Blueprint $table) {
            $table->id();
            $table->string('num');
            $table->string('nom_arret');
            $table->string('type_arret');
            $table->date('date_operation');
            $table->string('time_operation')->nullable();
            $table->integer('d')->nullable();
            $table->integer('f')->nullable();
            $table->float('df')->nullable();
            $table->enum('post', ['1er', '2eme', '3eme']);
            $table->text('secteur')->nullable();
            $table->float('hc')->nullable();
            $table->float('htp')->nullable();
            $table->text('engin')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('rapport__r0_s');
    }
}
