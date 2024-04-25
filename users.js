// Подключение функции trimStr из файла utils.js
const { trimStr } = require("./utils");

// Объявление массива пользователей
let users = [];

// Функция поиска пользователя
const findUser = (user) => {
  // Получение имени пользователя и названия комнаты с удалением лишних пробелов
  const userName = trimStr(user.name);
  const userRoom = trimStr(user.room);

  // Поиск пользователя в массиве
  return users.find(
    (u) => trimStr(u.name) === userName && trimStr(u.room) === userRoom
  );
};

// Функция добавления пользователя
const addUser = (user) => {
  // Поиск существующего пользователя
  const isExist = findUser(user);

  // Если пользователь не существует, добавляем его в массив пользователей
  !isExist && users.push(user);

  // Определяем текущего пользователя как существующего или нового
  const currentUser = isExist || user;

  // Возвращаем объект с флагом isExist и текущим пользователем
  return { isExist: !!isExist, user: currentUser };
};

// Функция получения списка пользователей в комнате
const getRoomUsers = (room) => users.filter((u) => u.room === room);

// Функция удаления пользователя
const removeUser = (user) => {
  // Поиск пользователя в массиве
  const found = findUser(user);

  // Если пользователь найден, удаляем его из массива пользователей
  if (found) {
    users = users.filter(
      ({ room, name }) => room === found.room && name !== found.name
    );
  }

  // Возвращаем найденного пользователя или null, если пользователь не найден
  return found;
};

// Экспорт функций для использования в других частях приложения
module.exports = { addUser, findUser, getRoomUsers, removeUser };
