// Подключение Express.js для работы с маршрутами
const express = require("express");
// Создание маршрутизатора Express
const router = express.Router();


router.get("/", (req, res) => {
  // Установка заголовков CORS для разрешения запросов из любого источника
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Установка разрешенных HTTP методов
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );


  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Отправка ответа с сообщением "Это только мой мир."
  res.send("Это только мой мир.");
});

// Экспорт маршрута для использования в других модулях
module.exports = router;
