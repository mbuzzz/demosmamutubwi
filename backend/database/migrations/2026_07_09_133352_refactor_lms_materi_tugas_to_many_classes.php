<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Create materi_kelas pivot table
        Schema::create('materi_kelas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('materi_id')->constrained('materis')->cascadeOnDelete();
            $table->foreignId('kelas_id')->constrained('kelas')->cascadeOnDelete();
            $table->timestamps();
            
            $table->unique(['materi_id', 'kelas_id']);
        });

        // 2. Create tugas_kelas pivot table
        Schema::create('tugas_kelas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tugas_id')->constrained('tugas')->cascadeOnDelete();
            $table->foreignId('kelas_id')->constrained('kelas')->cascadeOnDelete();
            $table->timestamps();
            
            $table->unique(['tugas_id', 'kelas_id']);
        });

        // 3. Migrate existing data
        $materis = DB::table('materis')->whereNotNull('kelas_id')->get();
        foreach ($materis as $materi) {
            DB::table('materi_kelas')->insert([
                'materi_id' => $materi->id,
                'kelas_id' => $materi->kelas_id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $tugasList = DB::table('tugas')->whereNotNull('kelas_id')->get();
        foreach ($tugasList as $tugas) {
            DB::table('tugas_kelas')->insert([
                'tugas_id' => $tugas->id,
                'kelas_id' => $tugas->kelas_id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 4. Drop kelas_id columns
        Schema::table('materis', function (Blueprint $table) {
            $table->dropForeign(['kelas_id']);
            $table->dropColumn('kelas_id');
        });

        Schema::table('tugas', function (Blueprint $table) {
            $table->dropForeign(['kelas_id']);
            $table->dropColumn('kelas_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1. Restore kelas_id columns
        Schema::table('materis', function (Blueprint $table) {
            $table->foreignId('kelas_id')->nullable()->constrained('kelas')->cascadeOnDelete();
        });

        Schema::table('tugas', function (Blueprint $table) {
            $table->foreignId('kelas_id')->nullable()->constrained('kelas')->cascadeOnDelete();
        });

        // 2. Restore data from pivot tables (only taking the first one to avoid duplicates on 1:N rollback)
        $materiKelas = DB::table('materi_kelas')->get()->groupBy('materi_id');
        foreach ($materiKelas as $materiId => $pivots) {
            DB::table('materis')->where('id', $materiId)->update(['kelas_id' => $pivots->first()->kelas_id]);
        }

        $tugasKelas = DB::table('tugas_kelas')->get()->groupBy('tugas_id');
        foreach ($tugasKelas as $tugasId => $pivots) {
            DB::table('tugas')->where('id', $tugasId)->update(['kelas_id' => $pivots->first()->kelas_id]);
        }

        // 3. Drop pivot tables
        Schema::dropIfExists('materi_kelas');
        Schema::dropIfExists('tugas_kelas');
    }
};
