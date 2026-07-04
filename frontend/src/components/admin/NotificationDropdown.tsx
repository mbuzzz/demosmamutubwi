import { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Info, AlertCircle, CheckCircle, CalendarDays } from 'lucide-react';
import { useNotifications, useMarkAllRead } from '../../hooks/useNotifications';

const typeMap = {
  info: { icon: Info, iconColor: 'text-indigo-600', iconBg: 'bg-indigo-100 dark:bg-indigo-500/20' },
  success: { icon: CheckCircle, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-100 dark:bg-emerald-500/20' },
  warning: { icon: CalendarDays, iconColor: 'text-amber-600', iconBg: 'bg-amber-100 dark:bg-amber-500/20' },
  danger: { icon: AlertCircle, iconColor: 'text-red-600', iconBg: 'bg-red-100 dark:bg-red-500/20' },
};

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const { data: notifications = [] } = useNotifications();
  const markAllReadMutation = useMarkAllRead();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    markAllReadMutation.mutate();
  };

  function getNotificationMeta(type: string) {
    return typeMap[type as keyof typeof typeMap] || typeMap.info;
  }

  function formatTime(createdAtStr: string) {
    try {
      const date = new Date(createdAtStr);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / (60 * 1000));
      if (diffMins < 1) return 'Baru saja';
      if (diffMins < 60) return `${diffMins} menit lalu`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} jam lalu`;
      return date.toLocaleDateString('id-ID');
    } catch (e) {
      return '—';
    }
  }

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
              notifications.map(n => {
                const meta = getNotificationMeta(n.type);
                return (
                  <div key={n.id} className={`flex items-start gap-3 px-5 py-3.5 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer ${!n.read ? 'bg-indigo-50/30 dark:bg-indigo-500/5' : ''}`}>
                    <div className={`w-8 h-8 rounded-full ${meta.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                      <meta.icon className={`w-4 h-4 ${meta.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-slate-800 dark:text-white truncate">{n.title}</span>
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>}
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.description}</p>
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-1 block">{formatTime(n.created_at)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
