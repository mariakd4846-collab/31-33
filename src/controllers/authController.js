import * as authService from "../services/authService.js";
import jwt from "jsonwebtoken";
import config from "../config.js";
import AppError from "../utils/appError.js";

// Контроллер: регистрация нового пользователя
export async function register(req, res, next) {
  try {
    const { email, password } = req.body; // Получаем данные из тела запроса
    const userId = await authService.register(email, password); // Вызов сервиса регистрации
    res
      .status(201)
      .json({ message: "Пользователь успешно зарегистрирован", userId }); // Успешный ответ с ID
  } catch (error) {
    next(error); // Передача ошибки в middleware
  }
}

// Контроллер: вход пользователя
export async function login(req, res, next) {
  try {
    const { email, password } = req.body; // Получаем учетные данные

    // Аутентификация пользователя
    const user = await authService.login(email, password);

    // Генерация access-токена (короткоживущий)
    const accessToken = jwt.sign(
      { id: user.id, role: user.role }, // Полезная нагрузка
      config.jwt.secret, // Секретный ключ
      { expiresIn: config.jwt.accessExpiresIn } // Время жизни
    );

    // Генерация refresh-токена (долгоживущий)
    const refreshToken = await authService.generateRefreshToken(user.id);

    // Установка access-токена в httpOnly cookie
    res.cookie("accessToken", accessToken, config.cookie);

    // Установка refresh-токена в cookie с увеличенным сроком действия
    res.cookie("refreshToken", refreshToken, {
      ...config.cookie,
      maxAge: config.cookie.maxAgeRefresh, // 7 дней
    });

    res.status(200).json({ message: "Успешный вход в систему" });
  } catch (error) {
    next(error);
  }
}

// Контроллер: обновление токенов (refresh)
export async function refresh(req, res, next) {
  try {
    // Получаем refresh-токен из cookies
    const rawToken = req.cookies.refreshToken;
    if (!rawToken)
      return next(new AppError("Токен обновления отсутствует", 401));

    // Ротация токенов (старый refresh удаляется, выдаются новые)
    const { accessToken, refreshToken } =
      await authService.rotateRefreshToken(rawToken);

    // Устанавливаем новый access-токен в cookie
    res.cookie("accessToken", accessToken, config.cookie);

    // Устанавливаем новый refresh-токен в cookie
    res.cookie("refreshToken", refreshToken, {
      ...config.cookie,
      maxAge: config.cookie.maxAgeRefresh,
    });

    res.status(200).json({ message: "Токены обновлены" });
  } catch (error) {
    next(error);
  }
}

// Контроллер: выход из системы (logout)
export async function logout(req, res, next) {
  try {
    // Получаем refresh-токен из cookies
    const rawToken = req.cookies.refreshToken;
    // Если токен есть - удаляем его из БД
    if (rawToken) await authService.revokeRefreshToken(rawToken);
    // Очищаем cookies клиента
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Выход выполнен" });
  } catch (error) {
    next(error);
  }
}
