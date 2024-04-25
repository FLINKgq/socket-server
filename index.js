// Подключение модулей
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const route = require("./route");
const { addUser, findUser, getRoomUsers, removeUser } = require("./users");

const app = express()


app.use(cors({ origin: "*" }));
app.use(route);

// Создание HTTP сервера на основе Express 
const server = http.createServer(app);

// Создание объекта Socket.IO и привязка его к HTTP серверу
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Обработка события подключения к серверу Socket.IO
io.on("connection", (socket) => {
  // Здесь обрабатываются все действия, связанные с подключением клиентов

  // Обработка события "join" (присоединение пользователя к комнате)
  socket.on("join", ({ name, room }) => {
    // Здесь пользователь присоединяется к комнате и отправляются сообщения
    socket.join(room);

    // Добавление пользователя в список
    const { user, isExist } = addUser({ name, room });

    // Формирование сообщения для нового пользователя
    const userMessage = isExist
      ? `${user.name}, here you go again`
      : `Hey my love ${user.name}`;

    // Отправка сообщения новому пользователю
    socket.emit("message", {
      data: { user: { name: "Admin" }, message: userMessage },
    });

    // Отправка сообщения о присоединении пользователя к остальным пользователям в комнате
    socket.broadcast.to(user.room).emit("message", {
      data: { user: { name: "Admin" }, message: `${user.name} has joined` },
    });

    // Отправка обновленного списка пользователей в комнате
    io.to(user.room).emit("room", {
      data: { users: getRoomUsers(user.room) },
    });
  });

  // Обработка события "sendMessage" (отправка сообщения в комнату)
  socket.on("sendMessage", ({ message, params }) => {
    // Поиск пользователя по параметрам
    const user = findUser(params);

    // Если пользователь найден, отправляем сообщение в его комнату
    if (user) {
      io.to(user.room).emit("message", { data: { user, message } });
    }
  });

  // Обработка события "leftRoom" (покидание комнаты)
  socket.on("leftRoom", ({ params }) => {
    // Удаление пользователя из комнаты
    const user = removeUser(params);

    // Если пользователь удален, отправляем сообщение о его выходе и обновляем список пользователей
    if (user) {
      const { room, name } = user;

      io.to(room).emit("message", {
        data: { user: { name: "Admin" }, message: `${name} has left` },
      });

      io.to(room).emit("room", {
        data: { users: getRoomUsers(room) },
      });
    }
  });

  // Обработка события "disconnect" (отключение клиента от сервера)
  io.on("disconnect", () => {
    console.log("Disconnect");
  });
});

// Запуск сервера на порту 5000
server.listen(5000, () => {
  console.log("Server is running");
});
