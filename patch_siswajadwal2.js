const fs = require('fs');
const file = 'frontend/src/pages/admin/siswa/SiswaJadwal.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the hardcoded slots rendering with dynamic ones
const dynamicSlotsLogic = `  const dynamicSlots = schedules.length > 0 
    ? Array.from(new Set(schedules.map(s => s.urutan_jam)))
        .sort((a, b) => a - b)
        .map(urutan => {
          const sample = schedules.find(s => s.urutan_jam === urutan);
          return {
            id: String(urutan),
            start: sample?.jam_mulai?.substring(0, 5) || '',
            end: sample?.jam_selesai?.substring(0, 5) || '',
            label: sample?.is_break ? 'Istirahat' : \`Jam ke-\${urutan}\`,
            isBreak: sample?.is_break || false,
            urutan_jam: urutan
          };
        })
    : defaultSlots;`;

if (!content.includes('const dynamicSlots = schedules.length > 0')) {
    content = content.replace(
        "function getCell",
        `${dynamicSlotsLogic}\n\n  function getCell`
    );
}

if (content.includes('{defaultSlots.map((slot, slotIdx) => (')) {
    content = content.replace(
        '{defaultSlots.map((slot, slotIdx) => (',
        '{dynamicSlots.map((slot, slotIdx) => ('
    );
}

// Replace unique days logic
const dynamicDaysLogic = `  const dynamicDays = schedules.length > 0
    ? Array.from(new Set(schedules.map(s => s.hari))).sort((a, b) => {
        const order = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
        const idxA = order.findIndex(d => d.toLowerCase() === a.toLowerCase());
        const idxB = order.findIndex(d => d.toLowerCase() === b.toLowerCase());
        return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
      })
    : days;`;

if (!content.includes('const dynamicDays = schedules.length > 0')) {
    content = content.replace(
        "const dynamicSlots = schedules.length > 0",
        `${dynamicDaysLogic}\n\n  const dynamicSlots = schedules.length > 0`
    );
}

if (content.includes('{days.map(day => (')) {
    content = content.replace(
        '{days.map(day => (',
        '{dynamicDays.map(day => ('
    );
}

if (content.includes('{days.map((_day, dayIdx) => {')) {
    content = content.replace(
        '{days.map((_day, dayIdx) => {',
        '{dynamicDays.map((_day, dayIdx) => {'
    );
}

if (content.includes('const day = days[dayIdx];')) {
    content = content.replace(
        'const day = days[dayIdx];',
        'const day = dynamicDays[dayIdx];'
    );
}

// Ensure slot styling index uses urutan_jam
if (content.includes('const s = getStyle(slotIdx);')) {
    content = content.replace(
        'const s = getStyle(slotIdx);',
        'const s = getStyle(slot.urutan_jam ? slot.urutan_jam - 1 : slotIdx);'
    );
}
if (content.includes('s.urutan_jam === slotIdx + 1')) {
    content = content.replace(
        's.urutan_jam === slotIdx + 1',
        's.urutan_jam === (dynamicSlots[slotIdx].urutan_jam || slotIdx + 1)'
    );
}

fs.writeFileSync(file, content);
