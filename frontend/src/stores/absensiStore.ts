import { useState, useEffect } from 'react';
import { MOCK_ABSENSI_HARI_INI, MOCK_REKAP_ABSENSI, type SiswaAbsensi, type RekapAbsensi } from '../types/absensi';

type Listener = () => void;
let listeners: Listener[] = [];
let absensiData: SiswaAbsensi[] = [...MOCK_ABSENSI_HARI_INI];
let rekapData: RekapAbsensi[] = [...MOCK_REKAP_ABSENSI];

function notify() {
  listeners.forEach(l => l());
}

export function useAbsensiData() {
  const [state, setState] = useState(absensiData);
  useEffect(() => {
    const handler = () => setState([...absensiData]);
    listeners.push(handler);
    return () => { listeners = listeners.filter(l => l !== handler); };
  }, []);
  return state;
}

export function useRekapAbsensiData() {
  const [state, setState] = useState(rekapData);
  useEffect(() => {
    const handler = () => setState([...rekapData]);
    listeners.push(handler);
    return () => { listeners = listeners.filter(l => l !== handler); };
  }, []);
  return state;
}

export function getAbsensiData() {
  return absensiData;
}

export function getRekapAbsensiData() {
  return rekapData;
}

export function saveAbsensiRecord(record: SiswaAbsensi) {
  const idx = absensiData.findIndex(a => a.siswaId === record.siswaId && a.tanggal === record.tanggal);
  if (idx !== -1) {
    absensiData[idx] = { ...absensiData[idx], ...record };
  } else {
    absensiData.push(record);
  }
  updateRekapForSiswa(record.siswaId);
  notify();
}

export function validatePermit(siswaId: string, tanggal: string, status: 'izin' | 'sakit', catatan: string) {
  const existing = absensiData.find(a => a.siswaId === siswaId && a.tanggal === tanggal);
  if (existing) {
    existing.statusMasuk = status;
    existing.catatan = catatan;
    existing.metode = 'manual';
    existing.jamMasuk = undefined;
  } else {
    absensiData.push({
      id: `ab-${Date.now()}`,
      siswaId,
      nama: '', // will be resolved or empty
      kelas: '',
      tanggal,
      statusMasuk: status,
      metode: 'manual',
      catatan,
    });
  }
  updateRekapForSiswa(siswaId);
  notify();
}

function updateRekapForSiswa(siswaId: string) {
  const records = absensiData.filter(a => a.siswaId === siswaId);
  const rekap = rekapData.find(r => r.siswaId === siswaId);
  if (!rekap) return;
  
  // Recalculate totals
  let hadir = 0;
  let izin = 0;
  let sakit = 0;
  let alpha = 0;
  let terlambat = 0;
  
  records.forEach(r => {
    if (r.statusMasuk === 'hadir') hadir++;
    else if (r.statusMasuk === 'izin') izin++;
    else if (r.statusMasuk === 'sakit') sakit++;
    else if (r.statusMasuk === 'alpha') alpha++;
    else if (r.statusMasuk === 'terlambat') terlambat++;
  });
  
  rekap.hadir = 40 + hadir; // start from mock base
  rekap.izin = izin;
  rekap.sakit = sakit;
  rekap.alpha = alpha;
  rekap.terlambat = terlambat;
}
