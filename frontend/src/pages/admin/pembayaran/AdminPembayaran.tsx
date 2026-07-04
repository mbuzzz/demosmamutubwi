import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import { BarChart3, Users, Search, ArrowRight, Receipt, TrendingUp, AlertTriangle, Download, Calendar, Filter } from 'lucide-react';
import { rupiah, STATUS_PEMBAYARAN_BADGE, type StatusPembayaran } from '../../../types/pembayaran';
import { usePembayaranStatistik, useTagihanList, useJenisPembayaranList } from '../../../hooks/usePembayaran';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

export default function AdminPembayaran() {
  const { data: stats } = usePembayaranStatistik();
  const { data: list = [] } = useTagihanList();
  const { data: jenisList = [] } = useJenisPembayaranList();

  const [filterKelas, setFilterKelas] = useState('');
  const [filterJenis, setFilterJenis] = useState('');
  const [filterStatus, setFilterStatus] = useState<StatusPembayaran | ''>('');
  const [dariTanggal, setDariTanggal] = useState('');
  const [sampaiTanggal, setSampaiTanggal] = useState('');
  const [search, setSearch] = useState('');
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  const totalTagihan = list.reduce((a, p) => a + p.nominal, 0);
  const totalTerkumpul = stats?.total_penerimaan || list.reduce((a, p) => a + p.terbayar, 0);
  const totalTunggakan = stats?.total_tunggakan || list.reduce((a, p) => a + p.sisa, 0);
  const siswaBelumLunas = stats?.siswa_nunggak || list.filter(p => p.status === 'belum' || p.status === 'cicil').length;

  const kelasList = [...new Set(list.map(p => p.siswa?.kelas).filter(Boolean))];

  const filtered = list.filter(p => {
    if (filterKelas && p.siswa?.kelas !== filterKelas) return false;
    if (filterJenis && String(p.jenis_pembayaran_id) !== filterJenis) return false;
    if (filterStatus && p.status !== filterStatus) return false;
    if (search && !p.siswa?.nama.toLowerCase().includes(search.toLowerCase())) return false;
    
    // Date range filter based on transaction histories
    if (dariTanggal || sampaiTanggal) {
      if (!p.riwayat || p.riwayat.length === 0) return false;
      const dates = p.riwayat.map(t => new Date(t.tanggal).getTime());
      const minDate = Math.min(...dates);
      const maxDate = Math.max(...dates);
      
      if (dariTanggal) {
        const from = new Date(dariTanggal).getTime();
        if (maxDate < from) return false;
      }
      if (sampaiTanggal) {
        const to = new Date(sampaiTanggal).getTime();
        if (minDate > to) return false;
      }
    }
    
    return true;
  });

  const handleExportExcel = () => {
    if (filtered.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }

    // Map filtered data for Excel columns
    const reportData = filtered.map(p => ({
      'Nama Siswa': p.siswa?.nama || '-',
      'Kelas': p.siswa?.kelas || '-',
      'Jenis Pembayaran': p.jenis_pembayaran?.nama || '-',
      'Total Tagihan': p.nominal,
      'Telah Dibayar': p.terbayar,
      'Sisa Tagihan': p.sisa,
      'Status': p.status === 'lunas' ? 'Lunas' : p.status === 'cicil' ? 'Angsuran' : p.status === 'bebas' ? 'Bebas' : 'Belum Bayar',
      'Jatuh Tempo': p.jatuh_tempo,
      'Jumlah Transaksi': p.riwayat?.length || 0,
      'Tanggal Transaksi Terakhir': p.riwayat && p.riwayat.length > 0 ? p.riwayat[p.riwayat.length - 1].tanggal : '—'
    }));

    // Create worksheet and workbook
    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Keuangan');

    // Auto-fit column widths
    const colWidths = Object.keys(reportData[0]).map(key => ({
      wch: Math.max(key.length, ...reportData.map(r => String(r[key as keyof typeof r]).length)) + 2
    }));
    ws['!cols'] = colWidths;

    // Save file
    XLSX.writeFile(wb, `Laporan_Pembayaran_SIT_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Laporan Keuangan berhasil diekspor ke Excel (.xlsx)');
  };

  return (
    <AdminLayout title="Dashboard Pembayaran">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 text-white shadow-sm">
          <p className="text-xs font-bold text-indigo-100 uppercase tracking-wider">Total Tagihan</p>
          <h3 className="text-2xl font-black mt-1">{rupiah(totalTagihan)}</h3>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-sm">
          <p className="text-xs font-bold text-emerald-100 uppercase tracking-wider">Terkumpul</p>
          <h3 className="text-2xl font-black mt-1">{rupiah(totalTerkumpul)}</h3>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-5 text-white shadow-sm">
          <p className="text-xs font-bold text-red-100 uppercase tracking-wider">Tunggakan</p>
          <h3 className="text-2xl font-black mt-1">{rupiah(totalTunggakan)}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Belum Lunas</p>
          <h3 className="text-3xl font-black text-amber-500 mt-1">{siswaBelumLunas}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Link to="/panel/pembayaran/jenis" className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500 transition-all hover:shadow-md group flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center"><Receipt className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /></div>
            <div><h4 className="font-bold text-slate-800 dark:text-white text-sm">Jenis Pembayaran</h4><p className="text-xs text-slate-500 dark:text-slate-400">Atur tagihan wajib & sukarela</p></div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
        </Link>
        <Link to="/panel/pembayaran/siswa" className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-500 transition-all hover:shadow-md group flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center"><Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" /></div>
            <div><h4 className="font-bold text-slate-800 dark:text-white text-sm">Pembayaran Siswa</h4><p className="text-xs text-slate-500 dark:text-slate-400">Input bayar & atur beasiswa</p></div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
        </Link>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-xl flex items-center justify-center"><TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" /></div>
            <div><h4 className="font-bold text-slate-800 dark:text-white text-sm">Total Pemasukan</h4><p className="text-xs text-slate-500 dark:text-slate-400">{rupiah(totalTerkumpul)} terkumpul</p></div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[15px] shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        
        {/* Toolbar & Filter */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-500" /> Status Pembayaran
          </h3>
          <div className="flex-1" />
          
          <select value={filterKelas} onChange={e => setFilterKelas(e.target.value)} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-600 dark:text-slate-300">
            <option value="">Semua Kelas</option>
            {kelasList.map((k: any) => <option key={k} value={k}>{k}</option>)}
          </select>

          <button 
            onClick={() => setShowAdvancedFilter(!showAdvancedFilter)} 
            className={`p-2 border rounded-lg text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${showAdvancedFilter ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600' : 'border-slate-200 dark:border-slate-700'}`}
            title="Filter Lanjutan"
          >
            <Filter className="w-3.5 h-3.5" />
          </button>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari siswa..." className="pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 w-40 dark:text-white" />
          </div>

          <button onClick={handleExportExcel} className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95">
            <Download className="w-3.5 h-3.5" /> Ekspor XLSX
          </button>
        </div>

        {/* Collapsible Advanced Filters */}
        {showAdvancedFilter && (
          <div className="p-4 bg-slate-50/50 dark:bg-slate-800/35 border-b border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Jenis Tagihan</label>
              <select value={filterJenis} onChange={e => setFilterJenis(e.target.value)} className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-white">
                <option value="">Semua Jenis</option>
                {jenisList.map(j => <option key={j.id} value={String(j.id)}>{j.nama}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Status Pembayaran</label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as StatusPembayaran | '')} className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-white">
                <option value="">Semua Status</option>
                <option value="belum">Belum Bayar</option>
                <option value="cicil">Angsuran</option>
                <option value="lunas">Lunas</option>
                <option value="bebas">Bebas</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1 flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Dari Tanggal</label>
              <input type="date" value={dariTanggal} onChange={e => setDariTanggal(e.target.value)} className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-white" />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1 flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Sampai Tanggal</label>
              <input type="date" value={sampaiTanggal} onChange={e => setSampaiTanggal(e.target.value)} className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-white" />
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold border-b border-slate-200 dark:border-slate-700">
              <tr><th className="px-5 py-4">Siswa</th><th className="px-5 py-4">Kelas</th><th className="px-5 py-4">Jenis</th><th className="px-5 py-4 text-right">Tagihan</th><th className="px-5 py-4 text-right">Terkumpul</th><th className="px-5 py-4 text-right">Sisa</th><th className="px-5 py-4 text-center">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {filtered.length > 0 ? (
                filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-800 dark:text-white">{p.siswa?.nama}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{p.siswa?.kelas || '-'}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{p.jenis_pembayaran?.nama}</td>
                    <td className="px-5 py-4 text-right font-bold text-slate-800 dark:text-white">{rupiah(p.nominal)}</td>
                    <td className="px-5 py-4 text-right font-semibold text-emerald-600">{rupiah(p.terbayar)}</td>
                    <td className="px-5 py-4 text-right font-bold text-red-600">{rupiah(p.sisa)}</td>
                    <td className="px-5 py-4 text-center">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_PEMBAYARAN_BADGE[p.status].color}`}>
                        {STATUS_PEMBAYARAN_BADGE[p.status].label}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400 dark:text-slate-500 font-medium">
                    Tidak ada data pembayaran ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {siswaBelumLunas > 0 && (
        <div className="mt-6 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-5">
          <h3 className="font-bold text-amber-800 dark:text-amber-300 text-sm flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" /> {siswaBelumLunas} tagihan belum lunas
          </h3>
          <p className="text-xs text-amber-700 dark:text-amber-400">Total tunggakan: {rupiah(totalTunggakan)}</p>
        </div>
      )}
    </AdminLayout>
  );
}
