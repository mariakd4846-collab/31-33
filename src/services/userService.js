// Импорт функций из модели пользователя
import {
  getAllUsers as getAllUsersModel,
  findUserById,
} from "../models/user.model.js";

// Получение списка всех пользователей
export async function getAllUsers() {
  return getAllUsersModel();
}

// Получение пользователя по ID
export async function getUserById(id) {
  return findUserById(id);
}
