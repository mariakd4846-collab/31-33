import jwt from "jsonwebtoken";
import config from "../config.js";
import AppError from "../utils/appError.js";

// Middleware для аутентификации пользователя
export default function authenticate(req, res, next) {
  // Извлекаем access-токен из cookies
  const token = req.cookies.accessToken;
  if (!token) return next(new AppError("Вы не авторизованы", 401));

  try {
    // Верифицируем токен с секретным ключом
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded; // Сохраняем данные пользователя в запросе
    next(); // Передаем управление дальше
  } catch (error) {
    // Токен недействителен или просрочен
    return next(new AppError("Недействительный или истёкший токен", 401));
  }
}
