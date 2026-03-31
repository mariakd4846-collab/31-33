import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";
import { load } from "js-yaml";
import { fileURLToPath } from "url";
import { dirname, resolve, normalize } from "path";

// Определяем путь к текущей директории (аналог __dirname в ES модулях)
const __dirname = dirname(fileURLToPath(import.meta.url));

// Формируем полный путь к файлу спецификации openapi.yaml
const specPath = resolve(__dirname, "openapi.yaml");

// Проверка безопасности: убеждаемся, что путь не выходит за пределы текущей директории
if (!normalize(specPath).startsWith(normalize(__dirname))) {
  throw new Error("Невозможно загрузить файл спецификации OpenAPI");
}

// Загружаем и парсим YAML файл спецификации OpenAPI
const spec = load(readFileSync(specPath, "utf8"));

// Экспортируем middleware для Swagger UI и загруженную спецификацию
export { swaggerUi, spec };
