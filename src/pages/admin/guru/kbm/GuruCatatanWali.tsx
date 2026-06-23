import AdminLayout from '../../../../components/admin/AdminLayout';
import { Save, Search } from 'lucide-react';
import { useState } from 'react';

interface CatatanSiswa {
  id: number;
  nama: string;
  nisn: string;
  catatan: string;
}

const defaultCatatan: CatatanSiswa[] = [
  { id: 1, nama: 'Agus Setiawan', nisn: '0081234501', catatan: 'Siswa rajin dan aktif dalam kegiatan kelas.' },
  { id: 2, nama: 'Budi Raharjo', nisn: '0081234502', catatan: 'Perlu ditingkatkan dalam kedisiplinan pengumpulan tugas.' },
  { id: 3, nama: 'Citra Kirana', nisn: '0081234503', catatan: 'Memiliki potensi besar di bidang sains.' },
  { id: 4, nama: 'Dewi Lestari', nisn: '0081234504', catatan: '' },
  { id: 5, nama: 'Eko Prasetyo', nisn: '0081234505', catatan: '' },
];

export default function GuruCatatanWali() {
  const [catatanList, setCatatanList] = useState<CatatanSiswa[]>(defaultCatatan);
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState(false);

  const filtered = catatanList.filter(s =>
    s.nama.toLowerCase().includes(search.toLowerCase())
  );

  function updateCatatan(id: number, text: string) {
    setCatatanList(prev => prev.map(c => c.id === id ? { ...c, catatan: text } : c));
    setSaved(false);
  }

  function saveAll() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <AdminLayout title="Catatan Wali Kelas (Rapor)">
      <div className="bg-white dark:bg-slate-900 rounded-[20px] shadow-sm overflow-hidden border border-slate-100 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white">Input Catatan Rapor Siswa</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Tulis catatan untuk masing-masing siswa kelas binaan.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative max-w-xs w-48">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari siswa..." className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
            </div>
            <button onClick={saveAll} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95">
              <Save className="w-4 h-4" /> {saved ? 'Tersimpan!' : 'Simpan Semua'}
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {filtered.map(s => (
            <div key={s.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                  {s.nama.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-slate-800 dark:text-white text-sm">{s.nama}</div>
                  <div className="text-[10px] text-slate-500 font-semibold">{s.nisn}</div>
                </div>
              </div>
              <textarea
                value={s.catatan}
                onChange={e => updateCatatan(s.id, e.target.value)}
                placeholder="Tulis catatan wali kelas untuk rapor..."
                rows={2}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
              />
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
