import { useState } from 'react';
import { Search, Mail, BookOpen } from 'lucide-react';

export default function GuruDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for teachers
  const teachers = [
    { name: 'Budi Santoso, S.Pd.', subject: 'Matematika', email: 'budi.santoso@smasmuh1bwi.sch.id', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
    { name: 'Siti Rahma, S.Pd.I.', subject: 'Pendidikan Agama Islam', email: 'siti.rahma@smasmuh1bwi.sch.id', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
    { name: 'Ahmad Faisal, S.Si.', subject: 'Fisika & Kimia', email: 'ahmad.faisal@smasmuh1bwi.sch.id', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80' },
    { name: 'Indah Lestari, M.Pd.', subject: 'Bahasa Indonesia', email: 'indah.lestari@smasmuh1bwi.sch.id', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { name: 'Rian Pratama, S.Kom.', subject: 'Teknologi Informasi / TIK', email: 'rian.pratama@smasmuh1bwi.sch.id', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    { name: 'Dewi Sartika, S.Pd.', subject: 'Bahasa Inggris', email: 'dewi.sartika@smasmuh1bwi.sch.id', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' }
  ];

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-800 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3">Direktori Guru & Pendidik</h1>
          <p className="text-slate-500 dark:text-slate-400">Mata rantai utama transfer keilmuan dan kepribadian Islami bagi siswa kami.</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12 relative">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari guru atau mata pelajaran..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 shadow-sm"
          />
        </div>

        {/* Grid List */}
        {filteredTeachers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredTeachers.map((teacher, index) => (
              <div key={index} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-card dark:shadow-none border border-slate-100 dark:border-slate-800 hover:shadow-card dark:shadow-none-hover transition-shadow flex items-start gap-4">
                <div className="h-16 w-16 rounded-full overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
                  <img src={teacher.img} alt={teacher.name} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{teacher.name}</h3>
                  <div className="flex items-center gap-1 text-emerald-700 text-xs font-semibold uppercase tracking-wider">
                    <BookOpen className="h-3 w-3" />
                    <span>{teacher.subject}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mt-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate max-w-[180px]">{teacher.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-500 dark:text-slate-400 py-12">
            Tidak menemukan guru atau mata pelajaran dengan kata kunci "{searchTerm}".
          </div>
        )}
      </div>
    </div>
  );
}
