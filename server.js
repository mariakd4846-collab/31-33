import "dotenv/config"; // Загрузка переменных окружения из .env файла

import app from "./src/app.js"; // Основное приложение Express
import config from "./src/config.js"; // Конфигурация приложения
import db from "./src/db/db.js"; // Инициализация базы данных (подключается при импорте)

// Функция запуска сервера
const startServer = async () => {
  try {
    // Запускаем сервер на указанном порту
    app.listen(config.port, () => {
      console.log(`Сервер запущен на http://localhost:${config.port}`);
      console.log(
        `Документация доступна на http://localhost:${config.port}/api/docs`
      );
    });
  } catch (err) {
    console.error("Не удалось запустить сервер:", err);
  }
};

// Запуск приложения
startServer();
