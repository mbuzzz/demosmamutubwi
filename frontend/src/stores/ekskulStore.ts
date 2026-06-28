import { useState, useEffect } from 'react';

export interface Ekskul {
  id: string;
  nama: string;
  deskripsi?: string;
}

export interface NilaiEkskul {
  id: string;
  siswaId: string;
  siswaNama: string;
  ekskulId: string;
  ekskulNama: string;
  nilai: 'A' | 'B' | 'C' | 'D';
  keterangan?: string;
}

type Listener = () => void;
let listeners: Listener[] = [];

let ekskulList: Ekskul[] = [
  { id: 'ek1', nama: 'Pramuka', deskripsi: 'Pendidikan kepanduan wajib nasional' },
  { id: 'ek2', nama: 'Tapak Suci', deskripsi: 'Seni bela diri tapak suci putra muhammadiyah' },
  { id: 'ek3', nama: 'Palang Merah Remaja (PMR)', deskripsi: 'Kegiatan kepalangmerahan dan kesehatan remaja' },
  { id: 'ek4', nama: 'Paskibra', deskripsi: 'Pasukan pengibar bendera sekolah' },
  { id: 'ek5', nama: 'Klub Musik', deskripsi: 'Ekstrakurikuler minat bakat seni musik' }
];

let nilaiList: NilaiEkskul[] = [
  { id: 'ne1', siswaId: 's1', siswaNama: 'Agus Setiawan', ekskulId: 'ek1', ekskulNama: 'Pramuka', nilai: 'B', keterangan: 'Sangat disiplin dan aktif mengikuti latihan rutin' },
  { id: 'ne2', siswaId: 's1', siswaNama: 'Agus Setiawan', ekskulId: 'ek2', ekskulNama: 'Tapak Suci', nilai: 'A', keterangan: 'Memiliki fisik prima dan teknik bertarung yang baik' },
  { id: 'ne3', siswaId: 's2', siswaNama: 'Budi Santoso', ekskulId: 'ek1', ekskulNama: 'Pramuka', nilai: 'B', keterangan: 'Aktif dalam kemah bulanan' },
  { id: 'ne4', siswaId: 's3', siswaNama: 'Citra Dewi', ekskulId: 'ek3', ekskulNama: 'Palang Merah Remaja (PMR)', nilai: 'A', keterangan: 'Sangat cakap dalam penanganan P3K' }
];

function notify() {
  listeners.forEach(l => l());
}

export function useEkskulList() {
  const [state, setState] = useState(ekskulList);
  useEffect(() => {
    const handler = () => setState([...ekskulList]);
    listeners.push(handler);
    return () => { listeners = listeners.filter(l => l !== handler); };
  }, []);
  return state;
}

export function useNilaiEkskul() {
  const [state, setState] = useState(nilaiList);
  useEffect(() => {
    const handler = () => setState([...nilaiList]);
    listeners.push(handler);
    return () => { listeners = listeners.filter(l => l !== handler); };
  }, []);
  return state;
}

export function addEkskul(nama: string, deskripsi: string) {
  const newEks: Ekskul = { id: `ek-${Date.now()}`, nama, deskripsi };
  ekskulList = [...ekskulList, newEks];
  notify();
}

export function updateEkskul(id: string, nama: string, deskripsi: string) {
  ekskulList = ekskulList.map(e => e.id === id ? { ...e, nama, deskripsi } : e);
  notify();
}

export function deleteEkskul(id: string) {
  ekskulList = ekskulList.filter(e => e.id !== id);
  nilaiList = nilaiList.filter(n => n.ekskulId !== id);
  notify();
}

export function saveNilaiEkskul(siswaId: string, siswaNama: string, ekskulId: string, nilai: 'A' | 'B' | 'C' | 'D', keterangan: string) {
  const ekskul = ekskulList.find(e => e.id === ekskulId);
  const ekskulNama = ekskul ? ekskul.nama : 'Ekskul';
  
  const existingIdx = nilaiList.findIndex(n => n.siswaId === siswaId && n.ekskulId === ekskulId);
  if (existingIdx !== -1) {
    nilaiList[existingIdx] = {
      ...nilaiList[existingIdx],
      nilai,
      keterangan
    };
  } else {
    nilaiList = [...nilaiList, {
      id: `ne-${Date.now()}`,
      siswaId,
      siswaNama,
      ekskulId,
      ekskulNama,
      nilai,
      keterangan
    }];
  }
  notify();
}

export function deleteNilaiEkskul(id: string) {
  nilaiList = nilaiList.filter(n => n.id !== id);
  notify();
}

export function getNilaiEkskulSiswa(siswaId: string) {
  return nilaiList.filter(n => n.siswaId === siswaId);
}
