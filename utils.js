// Функция trimStr обрезает лишние пробелы и приводит строку к нижнему регистру
const trimStr = (str) => str.trim().toLowerCase();

// Экспорт функции trimStr чтобы потом в других файлах импортировать ее и использовать
exports.trimStr = trimStr;
