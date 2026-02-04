<?php
// database/migrations/2024_02_04_create_iot_devices_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateIotDevicesTable extends Migration
{
    public function up()
    {
        Schema::create('iot_devices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('restaurant_id')->constrained()->onDelete('cascade');
            $table->string('device_id')->unique(); // ESP32-CAM-001
            $table->string('device_name')->nullable();
            $table->enum('device_type', ['esp32_button', 'esp32_camera', 'other'])->default('esp32_button');
            $table->string('api_key')->unique(); // For device authentication
            $table->string('ip_address')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_seen')->nullable();
            $table->json('config')->nullable(); // Device configuration
            $table->timestamps();
            
            $table->index(['restaurant_id', 'device_id']);
            $table->index('api_key');
        });
    }

    public function down()
    {
        Schema::dropIfExists('iot_devices');
    }
}