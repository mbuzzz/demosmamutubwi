import { useState } from 'react';
import { Search, Mail, BookOpen, Loader2, Users, Building2, UserCircle2 } from 'lucide-react';
import { usePublicGuruDirectory, usePublicStruktural } from '../hooks/useCms';
import { getFileUrl } from '../lib/api';

const ROLE_LABEL: Record<string, { label: string; color: string }> = {
  kepala_sekolah: { label: 'Kepala Sekolah', color: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300' },
  superadmin:     { label: 'Superadmin', color: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300' },
  kurikulum:      { label: 'Waka Kurikulum', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300' },
  waka_kesiswaan: { label: 'Waka Kesiswaan', color: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300' },
  waka_humas:     { label: 'Waka Humas', color: 'bg-pink-100 text-pink-800 dark:bg-pink-500/20 dark:text-pink-300' },
  walikelas:      { label: 'Wali Kelas', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300' },
  bendahara:      { label: 'Bendahara', color: 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300' },
  admin:          { label: 'Staf Admin / TU', color: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' },
  guru:           { label: 'Guru', color: 'bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300' },
};

export default function GuruDirectory() {
  const [activeTab, setActiveTab] = useState<'guru' | 'struktural'>('guru');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: publicGurus = [], isLoading: loadingGuru } = usePublicGuruDirectory();
  const { data: struktural = [], isLoading: loadingStruktural } = usePublicStruktural();

  const teachers = publicGurus.map((guru) => ({
    name: guru.name,
    subject: guru.subject,
    email: guru.email,
    foto: guru.foto ? getFileUrl(guru.foto) : null,
    id: guru.id,
  }));

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStruktural = struktural.filter(s =>
    (s.nama || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.jabatan || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLoading = activeTab === 'guru' ? loadingGuru : loadingStruktural;

  return (
    <div className="bg-slate-50 dark:bg-slate-800 py-16 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blueDark/10 text-xs font-bold text-brand-blueDark dark:text-brand-yellow uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-teal"></span>
            Sumber Daya Manusia
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3">Tenaga Pendidik & Struktural</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Jajaran pendidik dan struktur organisasi SMAS Muhammadiyah 1 Banyuwangi.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => { setActiveTab('guru'); setSearchTerm(''); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-[15px] font-bold text-sm transition-all duration-200 ${
              activeTab === 'guru'
                ? 'bg-brand-blueDark dark:bg-brand-yellow dark:text-brand-blueDark text-white shadow-card dark:shadow-none'
                : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Direktori Guru
          </button>
          <button
            onClick={() => { setActiveTab('struktural'); setSearchTerm(''); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-[15px] font-bold text-sm transition-all duration-200 ${
              activeTab === 'struktural'
                ? 'bg-brand-blueDark dark:bg-brand-yellow dark:text-brand-blueDark text-white shadow-card dark:shadow-none'
                : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Building2 className="w-4 h-4" /> Struktur Organisasi
          </button>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-10 relative">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder={activeTab === 'guru' ? 'Cari guru atau mata pelajaran...' : 'Cari nama atau jabatan...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-sm"
          />
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        )}

        {/* === TAB: DIREKTORI GURU === */}
        {!isLoading && activeTab === 'guru' && (
          <>
            {filteredTeachers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredTeachers.map((teacher) => (
                  <div key={teacher.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800 hover:shadow-card dark:shadow-none-hover transition-shadow flex items-start gap-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      {teacher.foto ? (
                        <img src={teacher.foto} alt={teacher.name} className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle2 className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                      )}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug truncate">{teacher.name}</h3>
                      <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                        <BookOpen className="h-3 w-3 shrink-0" />
                        <span className="truncate">{teacher.subject}</span>
                      </div>
                      {teacher.email && (
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mt-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{teacher.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-500 dark:text-slate-400 py-16">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">
                  {searchTerm
                    ? `Tidak ada guru dengan kata kunci "${searchTerm}"`
                    : 'Belum ada data guru'}
                </p>
              </div>
            )}
          </>
        )}

        {/* === TAB: STRUKTUR ORGANISASI === */}
        {!isLoading && activeTab === 'struktural' && (
          <>
            {filteredStruktural.length > 0 ? (
              <div className="space-y-4">
                {/* Kepala Sekolah featured card */}
                {filteredStruktural
                  .filter(s => s.role_akses === 'kepala_sekolah')
                  .map(s => (
                    <div key={s.id} className="bg-gradient-to-r from-brand-blueDark to-brand-teal rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center gap-6 shadow-lg">
                      <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white/30 shrink-0 bg-white/10 flex items-center justify-center">
                        {s.foto ? (
                          <img src={getFileUrl(s.foto)} alt={s.nama || ''} className="w-full h-full object-cover" />
                        ) : (
                          <UserCircle2 className="w-14 h-14 text-white/50" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-widest opacity-70 block mb-1">Pimpinan Tertinggi</span>
                        <h2 className="text-2xl font-extrabold">{s.nama || '-'}</h2>
                        <p className="text-brand-yellow font-bold text-sm mt-1">{s.jabatan || 'Kepala Sekolah'}</p>
                        {s.nip && <p className="text-white/60 text-xs mt-1">NIP: {s.nip}</p>}
                      </div>
                    </div>
                  ))
                }

                {/* Other structural members */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredStruktural
                    .filter(s => s.role_akses !== 'kepala_sekolah')
                    .map(s => {
                      const badge = ROLE_LABEL[s.role_akses] || { label: s.role_akses, color: 'bg-slate-100 text-slate-700' };
                      return (
                        <div key={s.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800 hover:shadow-card dark:shadow-none-hover transition-shadow flex items-center gap-4">
                          <div className="h-14 w-14 rounded-full overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            {s.foto ? (
                              <img src={getFileUrl(s.foto)} alt={s.nama || ''} className="w-full h-full object-cover" />
                            ) : (
                              <UserCircle2 className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug truncate">{s.nama || '-'}</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold truncate mt-0.5">{s.jabatan || '-'}</p>
                            <span className={`inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.color}`}>
                              {badge.label}
                            </span>
                            {s.nip && <p className="text-[10px] text-slate-400 mt-1">NIP: {s.nip}</p>}
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 dark:text-slate-400 py-16">
                <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">
                  {searchTerm
                    ? `Tidak ada jabatan dengan kata kunci "${searchTerm}"`
                    : 'Struktur organisasi belum diatur'}
                </p>
                <p className="text-xs mt-2 text-slate-400">Admin dapat mengatur struktur melalui menu Penugasan Struktural di panel admin.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
