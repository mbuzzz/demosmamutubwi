<?php

namespace Tests\Feature;

use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ReportAccessTest extends TestCase
{
    /** @return array<string> */
    private function reportEndpoints(): array
    {
        return [
            '/api/absensi/rekap',
            '/api/absensi-guru/rekap',
            '/api/rapors',
            '/api/piket/laporan',
        ];
    }

    public function test_report_endpoints_require_authentication(): void
    {
        foreach ($this->reportEndpoints() as $endpoint) {
            $this->getJson($endpoint)->assertUnauthorized();
        }
    }

    public function test_student_cannot_access_kurikulum_report_scope(): void
    {
        Sanctum::actingAs(User::factory()->make([
            'role' => 'siswa',
            'roles' => ['siswa'],
        ]));

        $this->getJson('/api/piket/laporan')->assertForbidden();
    }

    public function test_kurikulum_role_is_recognized_as_academic_oversight(): void
    {
        $user = User::factory()->make([
            'role' => 'guru',
            'roles' => ['guru', 'kurikulum'],
        ]);

        $this->assertTrue($user->hasRole(['kurikulum']));
        $this->assertTrue($user->isAcademicOversight());
        $this->assertTrue($user->isAttendanceOversight());
    }
}
