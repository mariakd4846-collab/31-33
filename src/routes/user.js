import { Router } from "express";
import { getAllUsers, getUserById } from "../controllers/userController.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

const router = Router();

// Все маршруты в этом роутере требуют аутентификации и роль admin
router.use(authenticate, authorize("admin"));

// GET /api/users - получение списка всех пользователей
router.get("/", getAllUsers);

// GET /api/users/:id - получение пользователя по ID
router.get("/:id", getUserById);

export default router;
