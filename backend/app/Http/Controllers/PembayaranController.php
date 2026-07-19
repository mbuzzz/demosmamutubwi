<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\JenisPembayaran;
use App\Models\TagihanSiswa;
use App\Models\TransaksiPembayaran;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PembayaranController extends Controller
{
    // === Jenis Pembayaran ===
    public function getJenisPembayaran()
    {
        $jenis = JenisPembayaran::all();
        return response()->json([
            'status' => 'success',
            'data' => $jenis
        ]);
    }

    public function storeJenisPembayaran(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required|string|max:255',
            'nominal_default' => 'required|numeric|min:0',
            'tipe_siklus' => 'required|in:bulanan,tahunan,sekali',
            'is_wajib' => 'boolean',
            'deskripsi' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ], 400);
        }

        $jenis = JenisPembayaran::create($validator->validated());
        return response()->json([
            'status' => 'success',
            'message' => 'Jenis pembayaran berhasil ditambahkan',
            'data' => $jenis
        ], 201);
    }

    public function updateJenisPembayaran(Request $request, $id)
    {
        $jenis = JenisPembayaran::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'nama' => 'sometimes|string|max:255',
            'nominal_default' => 'sometimes|numeric|min:0',
            'tipe_siklus' => 'sometimes|in:bulanan,tahunan,sekali',
            'is_wajib' => 'boolean',
            'deskripsi' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ], 400);
        }

        $jenis->update($validator->validated());
        return response()->json([
            'status' => 'success',
            'message' => 'Jenis pembayaran berhasil diperbarui',
            'data' => $jenis
        ]);
    }

    public function deleteJenisPembayaran($id)
    {
        $jenis = JenisPembayaran::findOrFail($id);
        $jenis->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Jenis pembayaran berhasil dihapus'
        ]);
    }

    // === Tagihan Siswa ===
    public function getTagihanSiswa(Request $request)
    {
        $user = $request->user();
        $query = TagihanSiswa::with(['siswa', 'jenisPembayaran', 'transaksi']);

        if ($user) {
            if ($user->isSiswa()) {
                $query->where('siswa_id', $user->id);
            } elseif ($user->isOrangTua()) {
                $query->where('siswa_id', $user->siswa_id);
            } elseif ($user->isFinanceStaff()) {
                // Bendahara / admin: filter opsional by siswa / kelas
                $studentId = $request->input('siswa_id') ?: $request->input('user_id');
                if ($studentId) {
                    $query->where('siswa_id', $studentId);
                }
                $kelas = $request->input('kelas');
                if ($kelas) {
                    $query->whereHas('siswa', fn ($q) => $q->where('kelas', $kelas));
                }
            } else {
                // Bukan finance & bukan siswa/ortu
                return response()->json([
                    'status' => 'error',
                    'message' => 'Anda tidak memiliki akses data tagihan.',
                ], 403);
            }
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $tagihan = $query->orderBy('tenggat_waktu', 'asc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $tagihan
        ]);
    }

    public function createTagihanSiswa(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'jenis_pembayaran_id' => 'required|exists:jenis_pembayaran,id',
            'siswa_ids' => 'required|array',
            'siswa_ids.*' => 'exists:users,id',
            'nama_tagihan' => 'required|string',
            'bulan' => 'nullable|integer|between:1,12',
            'tahun' => 'nullable|integer',
            'nominal_tagihan' => 'nullable|numeric|min:0',
            'tenggat_waktu' => 'nullable|date'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ], 400);
        }

        $jenis = JenisPembayaran::findOrFail($request->jenis_pembayaran_id);
        $nominal = $request->nominal_tagihan ?? $jenis->nominal_default;

        // Pastikan semua ID benar-benar role siswa
        $invalid = User::whereIn('id', $request->siswa_ids)
            ->get()
            ->filter(fn ($u) => !$u->isSiswa());
        if ($invalid->isNotEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Beberapa ID bukan akun siswa: ' . $invalid->pluck('name')->implode(', '),
            ], 422);
        }

        DB::beginTransaction();
        try {
            $tagihanList = [];
            foreach ($request->siswa_ids as $siswaId) {
                $tagihanList[] = TagihanSiswa::create([
                    'siswa_id' => $siswaId,
                    'jenis_pembayaran_id' => $jenis->id,
                    'nama_tagihan' => $request->nama_tagihan,
                    'bulan' => $request->bulan,
                    'tahun' => $request->tahun,
                    'nominal_tagihan' => $nominal,
                    'nominal_terbayar' => 0,
                    'status' => 'belum',
                    'tenggat_waktu' => $request->tenggat_waktu,
                ]);
            }
            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Tagihan berhasil dibuat untuk ' . count($request->siswa_ids) . ' siswa',
                'data' => $tagihanList
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat membuat tagihan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // === Proses Pembayaran ===
    public function prosesPembayaran(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tagihan_id' => 'required|exists:tagihan_siswa,id',
            'jumlah_bayar' => 'required|numeric|min:1',
            'metode' => 'required|in:tunai,transfer,rfid',
            'catatan' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ], 400);
        }

        $tagihan = TagihanSiswa::findOrFail($request->tagihan_id);
        $sisaTagihan = $tagihan->nominal_tagihan - $tagihan->nominal_terbayar;

        if ($sisaTagihan <= 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tagihan sudah lunas'
            ], 400);
        }

        if ($request->jumlah_bayar > $sisaTagihan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Jumlah bayar melebihi sisa tagihan'
            ], 400);
        }

        DB::beginTransaction();
        try {
            $transaksi = TransaksiPembayaran::create([
                'tagihan_id' => $tagihan->id,
                'kode_transaksi' => 'TRX-' . strtoupper(Str::random(10)),
                'jumlah_bayar' => $request->jumlah_bayar,
                'tanggal_bayar' => now(),
                'metode' => $request->metode,
                'status' => 'berhasil',
                'diterima_oleh_id' => $request->user()->id,
                'catatan' => $request->catatan
            ]);

            $tagihan->nominal_terbayar += $request->jumlah_bayar;
            
            if ($tagihan->nominal_terbayar >= $tagihan->nominal_tagihan) {
                $tagihan->status = 'lunas';
            } else {
                $tagihan->status = 'sebagian';
            }
            $tagihan->save();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Pembayaran berhasil diproses',
                'data' => $transaksi
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat memproses pembayaran',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getTransaksi(Request $request)
    {
        $query = TransaksiPembayaran::with(['tagihan.siswa', 'tagihan.jenisPembayaran', 'penerima']);

        if ($request->has('tanggal_awal') && $request->has('tanggal_akhir')) {
            $query->whereBetween('tanggal_bayar', [$request->tanggal_awal, $request->tanggal_akhir]);
        }
        
        $transaksi = $query->orderBy('tanggal_bayar', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $transaksi
        ]);
    }

    public function getStatistik()
    {
        $totalTagihan = TagihanSiswa::sum('nominal_tagihan');
        $totalTerkumpul = TagihanSiswa::sum('nominal_terbayar');
        $totalBelumDibayar = $totalTagihan - $totalTerkumpul;

        $penerimaanHariIni = TransaksiPembayaran::whereDate('tanggal_bayar', \Carbon\Carbon::today())->sum('jumlah_bayar');

        $siswaLunas = TagihanSiswa::where('status', 'lunas')->count();
        $siswaNunggak = TagihanSiswa::whereIn('status', ['belum', 'sebagian'])->count();

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_penerimaan' => (float)$totalTerkumpul,
                'penerimaan_hari_ini' => (float)$penerimaanHariIni,
                'total_tunggakan' => (float)$totalBelumDibayar,
                'siswa_lunas' => $siswaLunas,
                'siswa_nunggak' => $siswaNunggak,
            ]
        ]);
    }

    public function updateBeasiswa(Request $request, $id)
    {
        $request->validate([
            'tipe' => 'required|in:persentase,nominal,bebas',
            'nilai' => 'nullable|numeric|min:0',
            'keterangan' => 'nullable|string',
        ]);

        $tagihan = TagihanSiswa::findOrFail($id);
        $tagihan->update([
            'beasiswa' => [
                'tipe' => $request->tipe,
                'nilai' => (float)($request->nilai ?? 0),
                'keterangan' => $request->keterangan,
            ]
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Beasiswa berhasil diupdate',
            'data' => $tagihan
        ]);
    }

    public function updateTransaksi(Request $request, $id)
    {
        $request->validate([
            'jumlah_bayar' => 'required|numeric|min:1'
        ]);

        $transaksi = TransaksiPembayaran::findOrFail($id);
        $tagihan = TagihanSiswa::findOrFail($transaksi->tagihan_id);

        $diff = $request->jumlah_bayar - $transaksi->jumlah_bayar;
        $newTerbayar = $tagihan->nominal_terbayar + $diff;

        if ($newTerbayar > $tagihan->nominal_tagihan) {
            return response()->json(['status' => 'error', 'message' => 'Melebihi total nominal tagihan.'], 400);
        }

        DB::beginTransaction();
        try {
            $transaksi->update([
                'jumlah_bayar' => $request->jumlah_bayar
            ]);

            $status = 'sebagian';
            if ($newTerbayar <= 0) {
                $status = 'belum';
            } elseif ($newTerbayar >= $tagihan->nominal_tagihan) {
                $status = 'lunas';
            }

            $tagihan->update([
                'nominal_terbayar' => $newTerbayar,
                'status' => $status
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Transaksi berhasil diupdate',
                'data' => $transaksi
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function deleteTransaksi($id)
    {
        $transaksi = TransaksiPembayaran::findOrFail($id);
        $tagihan = TagihanSiswa::findOrFail($transaksi->tagihan_id);

        $newTerbayar = $tagihan->nominal_terbayar - $transaksi->jumlah_bayar;

        DB::beginTransaction();
        try {
            $transaksi->delete();

            $status = 'sebagian';
            if ($newTerbayar <= 0) {
                $status = 'belum';
            } elseif ($newTerbayar >= $tagihan->nominal_tagihan) {
                $status = 'lunas';
            }

            $tagihan->update([
                'nominal_terbayar' => $newTerbayar,
                'status' => $status
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Transaksi berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function getStudentByRfid(Request $request, $uid)
    {
        $actor = $request->user();
        if ($actor && !$actor->isFinanceStaff()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Hanya bendahara/admin yang dapat lookup RFID pembayaran.',
            ], 403);
        }

        $kartu = \App\Models\KartuRfid::where('uid', $uid)->with('user')->first();
        
        if (!$kartu || !$kartu->user || !$kartu->user->isSiswa()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kartu RFID tidak terdaftar atau tidak aktif sebagai siswa.'
            ], 404);
        }

        $user = $kartu->user;

        $tagihans = TagihanSiswa::where('siswa_id', $user->id)
            ->where('status', '!=', 'lunas')
            ->get();
            
        $mappedTagihans = $tagihans->map(function ($t) use ($user) {
            return [
                'id' => $t->id,
                'siswa_id' => $t->siswa_id,
                'siswa' => [
                    'id' => $user->id,
                    'nama' => $user->name,
                    'kelas' => $user->kelas,
                ],
                'jenis_pembayaran_id' => $t->jenis_pembayaran_id,
                'jenis_pembayaran' => [
                    'id' => $t->jenisPembayaran->id,
                    'nama' => $t->jenisPembayaran->nama,
                    'nominal' => (float)$t->jenisPembayaran->nominal_default,
                    'tipe' => $t->jenisPembayaran->tipe_siklus === 'sekali' ? 'sukarela' : 'wajib',
                ],
                'nominal' => (float)$t->nominal_tagihan,
                'terbayar' => (float)$t->nominal_terbayar,
                'sisa' => (float)($t->nominal_tagihan - $t->nominal_terbayar),
                'status' => $t->status === 'sebagian' ? 'cicil' : $t->status,
                'jatuh_tempo' => $t->tenggat_waktu,
            ];
        });

        return response()->json([
            'status' => 'success',
            'siswa' => [
                'id' => $user->id,
                'nama' => $user->name,
                'kelas' => $user->kelas,
            ],
            'tagihan' => $mappedTagihans
        ]);
    }
}
