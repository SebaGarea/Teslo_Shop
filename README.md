# Teslo Shop - REST API

API REST de e-commerce construida con **NestJS**, **TypeORM** y **PostgreSQL**.

---

## Stack

- **NestJS** v11
- **TypeORM** v0.3
- **PostgreSQL**
- **class-validator** / **class-transformer**
- **@nestjs/serve-static** — sirve archivos estáticos desde `/public`
- **Multer** — manejo de uploads de archivos
- **bcrypt** — hasheo de contraseñas

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
PORT=3000
HOST_API=http://localhost:3000/api
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

Base URL: `http://localhost:3000/api`

### Products

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/products` | Crear un producto |
| `GET` | `/products` | Listar productos (con paginación) |
| `GET` | `/products/:term` | Buscar por UUID, título o slug |
| `PATCH` | `/products/:term` | Actualizar por UUID, título o slug |
| `DELETE` | `/products/:id` | Eliminar por UUID |

### Files

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/files/product` | Sube una imagen de producto (form-data, campo `file`) |
| `GET` | `/files/product/:imageName` | Retorna la imagen almacenada por nombre |

- Solo se aceptan imágenes: `jpg`, `jpeg`, `png`, `gif`.
- El nombre del archivo se reemplaza por un UUID para evitar colisiones.
- La respuesta del `POST` devuelve la URL completa: `{ "fileName": "http://localhost:3000/api/files/product/<uuid>.ext" }`.
- Las imágenes se guardan en `./static/products/` dentro del proyecto.

### Auth

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/auth/register` | Registrar un nuevo usuario |
| `POST` | `/auth/login` | Iniciar sesión |
| `GET` | `/auth/users` | Listar usuarios |

**Registro - Body:**
```json
{
  "email": "user@example.com",
  "password": "Abc123!@#",
  "fullName": "John Doe"
}
```

**Login - Body:**
```json
{
  "email": "user@example.com",
  "password": "Abc123!@#"
}
```

> La contraseña debe ser fuerte (`IsStrongPassword`): mínimo 8 caracteres, mayúsculas, minúsculas, números y símbolos.
> El campo `password` no se retorna en las respuestas.

### Seed

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/seed` | Elimina todos los productos e inserta datos de prueba |

> **Advertencia:** El endpoint `/seed` borra toda la tabla de productos antes de insertar. No usar en producción.

---

## Paginación

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

> El `slug` es opcional. Si no se envía, se genera automáticamente a partir del `title` (espacios reemplazados por `_`, sin comillas simples).

> Al hacer `PATCH`, si se envían `images`, las imágenes anteriores se reemplazan completamente. La operación se ejecuta dentro de una transacción con `QueryRunner`.

---

## Entidades

### Product

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Generado automáticamente |
| `title` | string | Único, requerido |
| `price` | float | Default: 0 |
| `description` | text | Opcional |
| `slug` | string | Único, auto-generado si no se provee |
| `stock` | int | Default: 0 |
| `sizes` | string[] | Array de talles (`XS`, `S`, `M`, `L`, `XL`, `XXL`) |
| `gender` | string | `men`, `women`, `kid`, `unisex` |
| `tags` | string[] | Default: `[]` |
| `images` | ProductImage[] | Relación OneToMany con cascade y eager loading |

### User

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Generado automáticamente |
| `email` | string | Único, requerido |
| `password` | string | Hasheada con bcrypt (no se retorna en responses) |
| `fullName` | string | Requerido |
| `isActive` | boolean | Default: `true` |
| `roles` | string[] | Default: `['user']` |

### ProductImage

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | number | Auto-incremental |
| `url` | string | URL de la imagen |
| `product` | Product | Relación ManyToOne — se elimina en cascada con el producto |

---

## Notas de implementación

- Las imágenes se almacenan en una tabla separada (`product_image`) con relación `ManyToOne` hacia `Product`.
- La respuesta de `GET /products` y `GET /products/:term` aplana las imágenes a un array de URLs (usando `findOnePlain`).
- Las actualizaciones de imágenes usan `QueryRunner` para garantizar atomicidad: si algo falla, se hace rollback automático.
- Los hooks `@BeforeInsert` y `@BeforeUpdate` normalizan el slug automáticamente.

---

## Scripts disponibles

```bash
npm run start:dev     # Modo desarrollo con hot-reload
npm run build         # Compilar para producción
npm run lint          # Lint con ESLint
npm run test          # Tests unitarios
npm run test:cov      # Tests con cobertura
```
