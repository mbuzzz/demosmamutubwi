export function waktuSekarang(): string {
  return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

export function randomUid(): string {
  const chars = '0123456789ABCDEF';
  let uid = '';
  for (let i = 0; i < 5; i++) {
    uid += chars[Math.floor(Math.random() * chars.length)] + chars[Math.floor(Math.random() * chars.length)];
    if (i < 4) uid += ':';
  }
  return uid;
}
