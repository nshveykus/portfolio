// src/utils/format.js
export function formatDate(iso) {
  if (!iso) return 'Не указано';
  const [year, month, day] = iso.slice(0, 10).split('-');
  return `${day}.${month}.${year}`;
}