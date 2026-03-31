import db from "../db/db.js";

// Поиск пользователя по email
export async function findUserByEmail(email) {
  const query = db.prepare("SELECT * FROM users WHERE email = ?");
  return query.get(email) || null;
}

// Создание нового пользователя
export async function createUser(email, passwordHash, role) {
  const query = db.prepare(
    "INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)"
  );
  const result = query.run(email, passwordHash, role);
  return result.lastInsertRowId;
}

// Поиск пользователя по ID (без пароля)
export async function findUserById(id) {
  const query = db.prepare(
    "SELECT id, email, role, created_at, last_login FROM users WHERE id = ?"
  );
  return query.get(id) || null;
}

// Получение всех пользователей (без паролей)
export async function getAllUsers() {
  const query = db.prepare(
    "SELECT id, email, role, created_at, last_login FROM users"
  );
  return query.all();
}

// Сохранение refresh-токена
export async function saveRefreshToken(userId, tokenHash, expiresAt) {
  const query = db.prepare(
    "INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)"
  );
  query.run(userId, tokenHash, expiresAt);
}

// Поиск refresh-токена по хешу
export async function findAllRefreshTokens(tokenHash) {
  const query = db.prepare("SELECT * FROM refresh_tokens WHERE token_hash = ?");
  return query.get(tokenHash) || null;
}

// Удаление refresh-токена
export async function deleteRefreshToken(tokenHash) {
  const query = db.prepare("DELETE FROM refresh_tokens WHERE token_hash = ?");
  query.run(tokenHash);
}

// Удаление всех refresh-токенов пользователя
export async function deleteAllRefreshTokensForUser(userId) {
  const query = db.prepare("DELETE FROM refresh_tokens WHERE user_id = ?");
  query.run(userId);
}
