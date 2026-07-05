import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import AdminLayout from '../../components/admin/AdminLayout';
import { Users, School, Newspaper, Search, ArrowRight } from 'lucide-react';

interface UserItem {
  id: string;
  name: string;
  role: string;
  username: string;
  nip_nisn: string | null;
}

interface KelasItem {
  id: string;
  nama: string;
  tingkat: string;
  jurusan: string;
}

interface BeritaItem {
  id: string;
  judul: string;
  slug: string;
  kategori?: { nama: string };
  status: string;
}

export default function AdminSearch() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data: users = [], isLoading: loadingUsers } = useQuery<UserItem[]>({
    queryKey: ['search-users', query],
    queryFn: async () => {
      if (!query) return [];
      const res = await api.get('/users', { params: { search: query } });
      return res.data;
    },
    enabled: !!query
  });

  const { data: kelasList = [], isLoading: loadingKelas } = useQuery<KelasItem[]>({
    queryKey: ['search-kelas', query],
    queryFn: async () => {
      if (!query) return [];
      const res = await api.get('/kelas', { params: { search: query } });
      return res.data;
    },
    enabled: !!query
  });

  const { data: beritaList = [], isLoading: loadingBerita } = useQuery<BeritaItem[]>({
    queryKey: ['search-berita', query],
    queryFn: async () => {
      if (!query) return [];
      // End point berita publik atau admin list
      const res = await api.get('/public/berita', { params: { search: query } });
      return res.data;
    },
    enabled: !!query
  });

  const isLoading = loadingUsers || loadingKelas || loadingBerita;
  const totalResults = users.length + kelasList.length + beritaList.length;

  return (
    <AdminLayout title={`Hasil Pencarian: "${query}"`}>
      <div className="space-y-8">
        {/* State Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-650"></div>
          </div>
        )}

        {/* State Kosong / Tanpa Kata Kunci */}
        {!isLoading && !query && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800/50">
            <Search className="w-16 h-16 text-slate-300 dark:text-slate-650 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-black text-slate-855 dark:text-white mb-1">Cari Sesuatu</h3>
            <p className="text-slate-400 dark:text-slate-500 font-medium text-sm">Ketikkan kata kunci di kolom pencarian di atas untuk memulai.</p>
          </div>
        )}

        {/* State Hasil Tidak Ditemukan */}
        {!isLoading && query && totalResults === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800/50">
            <Search className="w-16 h-16 text-slate-350 dark:text-slate-650 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-black text-slate-800 dark:text-white mb-1">Tidak Ditemukan Hasil</h3>
            <p className="text-slate-400 dark:text-slate-550 font-medium text-sm">Tidak ada siswa, kelas, atau berita yang cocok dengan kata kunci "{query}".</p>
          </div>
        )}

        {/* Hasil Ditemukan */}
        {!isLoading && query && totalResults > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Kolom Siswa & Pengguna */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/50 shadow-lg shadow-slate-100/50 dark:shadow-none flex flex-col">
              <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                Pengguna & Siswa ({users.length})
              </h3>
              <div className="space-y-3 flex-1">
                {users.length === 0 ? (
                  <p className="text-slate-400 dark:text-slate-500 text-sm py-4 text-center">Tidak ada pengguna yang cocok</p>
                ) : (
                  users.slice(0, 10).map((u) => (
                    <Link 
                      key={u.id} 
                      to={`/panel/users/edit/${u.id}`}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100/50 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500 hover:bg-indigo-50/20 dark:hover:bg-indigo-500/10 transition-all duration-200 group"
                    >
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate max-w-[180px]">{u.name}</div>
                        <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold uppercase mt-0.5 tracking-wider">{u.role}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {u.nip_nisn && (
                          <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400">{u.nip_nisn}</span>
                        )}
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))
                )}
                {users.length > 10 && (
                  <Link to="/panel/users" className="block text-center text-xs font-bold text-indigo-600 dark:text-indigo-405 pt-2 hover:underline">Lihat semua pengguna...</Link>
                )}
              </div>
            </div>

            {/* Kolom Kelas */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/50 shadow-lg shadow-slate-100/50 dark:shadow-none flex flex-col">
              <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <School className="w-5 h-5 text-indigo-500" />
                Kelas & Jurusan ({kelasList.length})
              </h3>
              <div className="space-y-3 flex-1">
                {kelasList.length === 0 ? (
                  <p className="text-slate-400 dark:text-slate-500 text-sm py-4 text-center">Tidak ada kelas yang cocok</p>
                ) : (
                  kelasList.slice(0, 10).map((k) => (
                    <Link 
                      key={k.id} 
                      to="/panel/kelas"
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100/50 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500 hover:bg-indigo-50/20 dark:hover:bg-indigo-500/10 transition-all duration-200 group"
                    >
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{k.nama}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">{k.tingkat} • {k.jurusan}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ))
                )}
                {kelasList.length > 10 && (
                  <Link to="/panel/kelas" className="block text-center text-xs font-bold text-indigo-600 dark:text-indigo-405 pt-2 hover:underline">Lihat semua kelas...</Link>
                )}
              </div>
            </div>

            {/* Kolom Berita & Artikel */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/50 shadow-lg shadow-slate-100/50 dark:shadow-none flex flex-col">
              <h3 className="text-lg font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-indigo-500" />
                Berita & Artikel ({beritaList.length})
              </h3>
              <div className="space-y-3 flex-1">
                {beritaList.length === 0 ? (
                  <p className="text-slate-400 dark:text-slate-500 text-sm py-4 text-center">Tidak ada berita yang cocok</p>
                ) : (
                  beritaList.slice(0, 10).map((b) => (
                    <Link 
                      key={b.id} 
                      to="/panel/berita"
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100/50 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500 hover:bg-indigo-50/20 dark:hover:bg-indigo-500/10 transition-all duration-200 group"
                    >
                      <div className="min-w-0 flex-1 mr-2">
                        <div className="font-bold text-slate-800 dark:text-slate-200 text-sm truncate">{b.judul}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 truncate">{b.kategori?.nama || 'Uncategorized'}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
                    </Link>
                  ))
                )}
                {beritaList.length > 10 && (
                  <Link to="/panel/berita" className="block text-center text-xs font-bold text-indigo-600 dark:text-indigo-405 pt-2 hover:underline">Lihat semua berita...</Link>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </AdminLayout>
  );
}
