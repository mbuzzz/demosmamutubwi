import { useState, useEffect } from 'react';
import { PEMBAYARAN_SISWA_MOCK, type PembayaranSiswa, type TransaksiPembayaran } from '../types/pembayaran';

type Listener = () => void;
let listeners: Listener[] = [];
let data: PembayaranSiswa[] = [...PEMBAYARAN_SISWA_MOCK];

function notify() {
  listeners.forEach(l => l());
}

export function usePembayaranData() {
  const [state, setState] = useState(data);
  useEffect(() => {
    const handler = () => setState([...data]);
    listeners.push(handler);
    return () => { listeners = listeners.filter(l => l !== handler); };
  }, []);
  return state;
}

export function getPembayaranData(): PembayaranSiswa[] {
  return data;
}

export function addPembayaranRecord(record: PembayaranSiswa) {
  data = [...data, record];
  notify();
}

export function addMultiplePembayaranRecords(records: PembayaranSiswa[]) {
  data = [...data, ...records];
  notify();
}

export function updatePembayaranRecord(id: string, update: Partial<PembayaranSiswa>) {
  data = data.map(p => p.id === id ? { ...p, ...update } : p);
  notify();
}

export function deletePembayaranRecord(id: string) {
  data = data.filter(p => p.id !== id);
  notify();
}

export function addTransactionToRecord(recordId: string, trx: TransaksiPembayaran) {
  data = data.map(p =>
    p.id === recordId
      ? {
          ...p,
          terbayar: p.terbayar + trx.nominal,
          sisa: p.sisa - trx.nominal,
          status: p.sisa - trx.nominal <= 0 ? 'lunas' : 'cicil',
          riwayat: [...p.riwayat, trx],
        }
      : p
  );
  notify();
}

export function updateTransactionInRecord(recordId: string, trxId: string, updates: Partial<TransaksiPembayaran>) {
  data = data.map(p =>
    p.id === recordId
      ? {
          ...p,
          riwayat: p.riwayat.map(t => t.id === trxId ? { ...t, ...updates } : t),
        }
      : p
  );
  notify();
}

export function deleteTransactionInRecord(recordId: string, trxId: string) {
  data = data.map(p => {
    if (p.id !== recordId) return p;
    const trx = p.riwayat.find(t => t.id === trxId);
    if (!trx) return p;
    return {
      ...p,
      terbayar: p.terbayar - trx.nominal,
      sisa: p.sisa + trx.nominal,
      status: 'belum',
      riwayat: p.riwayat.filter(t => t.id !== trxId),
    };
  });
  notify();
}
