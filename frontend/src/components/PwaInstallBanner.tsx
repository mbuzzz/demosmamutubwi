import { useEffect, useState } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'sit_pwa_install_dismissed';

/**
 * Banner install PWA — muncul jika browser fire beforeinstallprompt
 * dan user belum dismiss.
 */
export default function PwaInstallBanner() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Sudah standalone / sudah di-dismiss
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    if (isStandalone) return;
    if (localStorage.getItem(DISMISS_KEY) === '1') return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!visible || !deferred) return null;

  const onInstall = async () => {
    await deferred.prompt();
    try {
      await deferred.userChoice;
    } catch {
      // ignore
    }
    setDeferred(null);
    setVisible(false);
  };

  const onDismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
  };

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-[70] animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-2xl shadow-2xl border border-slate-700 p-4 flex gap-3 items-start">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
          <Smartphone className="w-5 h-5 text-indigo-300" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-extrabold leading-tight">Install SIT SMAM1</p>
          <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
            Pasang ke layar utama untuk akses cepat, notifikasi keterlambatan, dan mode offline parsial.
          </p>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={onInstall}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold"
            >
              <Download className="w-3.5 h-3.5" /> Install
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white"
            >
              Nanti
            </button>
          </div>
        </div>
        <button type="button" onClick={onDismiss} className="p-1 text-slate-400 hover:text-white shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
