import bcrypt from "bcryptjs";
import crypto from "crypto";
import AppError from "../utils/appError.js";
import {
  findUserByEmail,
  createUser,
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
  findUserById,
} from "../models/user.model.js";
import config from "../config.js";
import jwt from "jsonwebtoken";

// Регистрация нового пользователя
export async function register(email, password) {
  // Проверка на существующего пользователя
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new AppError("Электронный адрес уже используется.", 400);
  }
  // Хеширование пароля
  const passwordHash = await bcrypt.hash(password, 12);
  // Создание пользователя с ролью "user"
  return await createUser(email, passwordHash, "user");
}

// Вход пользователя
export async function login(email, password) {
  // Поиск пользователя по email
  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError("Неверный электронный адрес или пароль.", 401);
  }
  // Проверка пароля
  const passwordMatch = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatch) {
    throw new AppError("Неверный электронный адрес или пароль.", 401);
  }
  return user;
}

// Генерация refresh-токена
export async function generateRefreshToken(userId) {
  // Создание случайного токена
  const rawToken = crypto.randomBytes(64).toString("hex");
  // Хеширование токена для хранения в БД
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  // Установка срока действия 7 дней
  const expiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toISOString();
  // Сохранение хеша токена в БД
  await saveRefreshToken(userId, tokenHash, expiresAt);
  // Возвращаем сырой токен для отправки клиенту
  return rawToken;
}

// Обновление токенов (refresh token rotation)
export async function rotateRefreshToken(rawToken) {
  // Хешируем полученный refresh-токен для поиска в БД
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const stored = await findRefreshToken(tokenHash);

  // Проверка существования и срока действия токена
  if (!stored || new Date(stored.expires_at) < new Date()) {
    throw new AppError("Недействительный или истекший токен обновления", 401);
  }

  // Удаляем старый refresh-токен (одноразовый)
  await deleteRefreshToken(tokenHash);

  // Получаем пользователя
  const user = await findUserById(stored.user_id);
  if (!user) throw new AppError("Пользователь не найден", 401);

  // Генерируем новый access-токен
  const accessToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.accessExpiresIn,
    }
  );

  // Генерируем новый refresh-токен
  const newRawRefreshToken = await generateRefreshToken(user.id);

  return { accessToken, refreshToken: newRawRefreshToken };
}

// Отзыв refresh-токена (выход из системы)
export async function revokeRefreshToken(rawToken) {
  // Хешируем токен и удаляем из БД
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  await deleteRefreshToken(tokenHash);
}
