# Teslo Shop - REST API

API REST de e-commerce construida con **NestJS**, **TypeORM** y **PostgreSQL**.

---

## Stack

- **NestJS** v11
- **TypeORM** v0.3
- **PostgreSQL**
- **class-validator** / **class-transformer**

---

## Requisitos previos

- Node.js >= 18
- PostgreSQL corriendo localmente o en Docker
- npm

---

## Instalación

```bash
npm install
```

Crear un archivo `.env` en la raíz del proyecto:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=teslo_shop
DB_USERNAME=postgres
DB_PASSWORD=tu_password
```

---

## Correr el proyecto

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

---

## Endpoints

Base URL: `http://localhost:3000`

### Products

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/products` | Crear un producto |
| `GET` | `/products` | Listar productos (con paginación) |
| `GET` | `/products/:term` | Buscar por UUID, título o slug |
| `PATCH` | `/products/:term` | Actualizar por UUID, título o slug |
| `DELETE` | `/products/:id` | Eliminar por UUID |

### Paginación

```
GET /products?limit=10&offset=0
```

| Query param | Tipo | Default | Descripción |
|-------------|------|---------|-------------|
| `limit` | number | 10 | Cantidad de resultados |
| `offset` | number | 0 | Desde qué registro empezar |

---

## Crear / Actualizar producto - Body

```json
{
  "title": "T-Shirt Teslo",
  "price": 29.99,
  "description": "Descripción del producto",
  "slug": "t_shirt_teslo",
  "stock": 100,
  "sizes": ["XS", "S", "M", "L", "XL"],
  "gender": "men",
  "tags": ["shirt", "teslo"],
  "images": ["image1.jpg", "image2.jpg"]
}
```

> El `slug` es opcional. Si no se envía, se genera automáticamente a partir del `title` (espacios reemplazados por `_`, sin comillas).

> Al hacer `PATCH`, si se envía `images`, las imágenes anteriores se reemplazan completamente. La operación se ejecuta dentro de una transacción.

---

## Entidad Product

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Generado automáticamente |
| `title` | string | Único, requerido |
| `price` | float | Default: 0 |
| `description` | text | Opcional |
| `slug` | string | Único, auto-generado si no se provee |
| `stock` | int | Default: 0 |
| `sizes` | string[] | Array de talles |
| `gender` | string | `men`, `women`, `kid`, `unisex` |
| `tags` | string[] | Default: [] |
| `images` | string[] | URLs de imágenes del producto |

---

## Scripts disponibles

```bash
npm run start:dev     # Modo desarrollo con hot-reload
npm run build         # Compilar para producción
npm run lint          # Lint con ESLint
npm run test          # Tests unitarios
npm run test:cov      # Tests con cobertura
```
