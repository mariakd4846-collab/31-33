import express from "express";
import config from "./config.js";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import errorHandler from "../middleware/errorHandler.js";
import authRouter from "../routes/auth.js";
import usersRouter from "../routes/users.js";
import { swaggerUi, spec } from "../docs/swagger.js";

const app = express();

// Настройка лимита запросов: не более 100 за 15 минут
const limiter = rateLimit({
  windows: 15 * 60 * 1000, // 15 минут в миллисекундах
  max: 100, // максимальное количество запросов
});

// Базовые middleware
app.use(helmet()); // Защита HTTP-заголовков
app.use(cors(config.cors)); // Настройка CORS
app.use(cookieParser()); // Парсинг cookies
app.use(express.json()); // Парсинг JSON тела запроса

// Маршруты с ограничителем для аутентификации
app.use("/api/auth", limiter, authRouter);

// Маршруты для работы с пользователями
app.use("/api/users", usersRouter);

// Swagger документация API
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(spec));

// Глобальный обработчик ошибок (должен быть последним)
app.use(errorHandler);

export default app;
