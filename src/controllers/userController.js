import AppError from "../utils/appError.js";
import * as userService from "../services/userService.js";

// Контроллер: получение списка всех пользователей
export async function getAllUsers(req, res, next) {
  try {
    const users = await userService.getAllUsers(); // Вызов сервисного слоя
    res.status(200).json(users); // Отправка успешного ответа с данными
  } catch (error) {
    next(error); // Передача ошибки в middleware обработки ошибок
  }
}

// Контроллер: получение пользователя по ID из параметров запроса
export async function getUserById(req, res, next) {
  try {
    const user = await userService.getUserById(req.params.id); // Поиск пользователя
    if (!user) return next(new AppError("Пользователь не найден", 404)); // Если не найден - 404
    res.status(200).json(user); // Успешный ответ с данными пользователя
  } catch (error) {
    next(error); // Передача ошибки
  }
}
