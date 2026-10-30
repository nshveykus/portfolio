// просто переводит строку даты из исо в российский фрмат
export function formatDate(iso) {
  if (!iso) return 'Не указано';
  const [year, month, day] = iso.slice(0, 10).split('-');
  return `${day}.${month}.${year}`;
}
//переводит объект с датой в строку исо
export function formatDateToString(dateObj){
  if (!(dateObj instanceof Date) || isNaN(dateObj)) {
    console.log(`на форматирование пришела невалидная дата: ${dateObj}`);
    return '';
  }
  const year = dateObj.getFullYear();
  // Месяцы в JS идут от 0 до 11, поэтому делаем +1 и добавляем ноль в начало для "01", "02"
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); 
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

//убиваем ХSS
export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

