import { validate, registerSchema, loginSchema } from "../validators/auth.js";
import {
  register,
  login,
  refresh,
  logout,
} from "../controllers/authController.js";
import authenticate from "../middleware/authenticate.js";
import { Router } from "express";

const router = Router();

// Маршрут регистрации с валидацией тела запроса
router.post("/register", validate(registerSchema), register);

// Маршрут входа с валидацией
router.post("/login", validate(loginSchema), login);

// Маршрут обновления токенов (не требует аутентификации, refresh-токен берется из cookies)
router.post("/refresh", refresh);

// Маршрут выхода (требует аутентификации)
router.post("/logout", authenticate, logout);

export default router;
