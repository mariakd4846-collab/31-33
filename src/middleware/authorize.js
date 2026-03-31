import AppError from "../utils/appError.js";

// Middleware для авторизации по ролям
// Принимает список разрешенных ролей (...roles)
const authorize = (...roles) => {
  return (req, res, next) => {
    // Проверяем, есть ли роль пользователя среди разрешенных
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("У вас нет прав для доступа к этому ресурсу", 403)
      );
    }
    next(); // Доступ разрешен, идем дальше
  };
};

export default authorize;
