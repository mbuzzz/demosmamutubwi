import { useState, useEffect } from 'react';

export interface BankSettings {
  bankName: string;
  noRekening: string;
  atasNama: string;
  qrisImage: string; // Base64 or mock image URL/name
}

type Listener = () => void;
let listeners: Listener[] = [];

let bankSettings: BankSettings = {
  bankName: 'Mandiri Syariah',
  noRekening: '7112008899',
  atasNama: 'SMAS Muhammadiyah 1 Banyuwangi',
  qrisImage: '/qris_mock.png' // default path
};

function notify() {
  listeners.forEach(l => l());
}

export function useBankSettings() {
  const [state, setState] = useState(bankSettings);
  useEffect(() => {
    const handler = () => setState({ ...bankSettings });
    listeners.push(handler);
    return () => { listeners = listeners.filter(l => l !== handler); };
  }, []);
  return state;
}

export function updateBankSettings(settings: Partial<BankSettings>) {
  bankSettings = { ...bankSettings, ...settings };
  notify();
}

export function getBankSettings() {
  return bankSettings;
}
