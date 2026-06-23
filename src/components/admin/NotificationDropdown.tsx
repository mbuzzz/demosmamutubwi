import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Info, AlertCircle, CheckCircle, CalendarDays, FileQuestion } from 'lucide-react';

interface NotificationItem {
  id: number;
  icon: typeof Info;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const mockNotifications: NotificationItem[] = [
  { id: 1, icon: CalendarDays, iconColor: 'text-indigo-600', iconBg: 'bg-indigo-100 dark:bg-indigo-500/20', title: 'Jadwal Baru', description: 'Jadwal pelajaran Kelas X-1 telah diperbarui.', time: '10 menit lalu', read: false },
  { id: 2, icon: FileQuestion, iconColor: 'text-amber-600', iconBg: 'bg-amber-100 dark:bg-amber-500/20', title: 'UH Matematika', description: 'Ulangan Harian Matematika Wajib akan dimulai dalam 30 menit.', time: '25 menit lalu', read: false },
  { id: 3, icon: CheckCircle, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-100 dark:bg-emerald-500/20', title: 'Tugas Dinilai', description: 'Tugas PR LKS Hal 24-25 telah dinilai oleh Bu Siti.', time: '2 jam lalu', read: false },
  { id: 4, icon: AlertCircle, iconColor: 'text-red-600', iconBg: 'bg-red-100 dark:bg-red-500/20', title: 'Pengumuman', description: 'Libur tanggal merah 17 Agustus 2024.', time: '1 hari lalu', read: true },
  { id: 5, icon: Info, iconColor: 'text-sky-600', iconBg: 'bg-sky-100 dark:bg-sky-500/20', title: 'Info Rapor', description: 'Rapor semester ganjil dapat diunduh mulai 20 Desember.', time: '3 hari lalu', read: true },
];

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full"
      >
        <Bell className="w-[18px] h-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 border-2 border-white dark:border-slate-900">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-4 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-extrabold text-slate-800 dark:text-white text-sm">Notifikasi</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 transition-colors">
                <CheckCheck className="w-3.5 h-3.5" /> Tandai Dibaca
              </button>
            )}
          </div>

          <div className="max-h-[320px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-400">Tidak ada notifikasi</p>
              </div>
            ) : (
              notifications.map(n => (
                <div key={n.id} className={`flex items-start gap-3 px-5 py-3.5 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer ${!n.read ? 'bg-indigo-50/30 dark:bg-indigo-500/5' : ''}`}>
                  <div className={`w-8 h-8 rounded-full ${n.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <n.icon className={`w-4 h-4 ${n.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-slate-800 dark:text-white truncate">{n.title}</span>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>}
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.description}</p>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-1 block">{n.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
