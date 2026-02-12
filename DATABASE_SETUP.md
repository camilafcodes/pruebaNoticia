# Database Setup with Podman

Este documento describe cómo configurar y ejecutar la base de datos PostgreSQL usando Podman.

## Pre-requisitos

- Podman instalado en tu sistema
- Puerto 5432 disponible

## Configuración Rápida

### Opción 1: Usando el script de setup (Recomendado)

```bash
./setup-db.sh
```

Este script:
- Crea un volumen persistente para los datos
- Descarga la imagen de PostgreSQL 15 Alpine
- Crea y ejecuta el contenedor
- Inicializa la base de datos con el schema del proyecto

### Opción 2: Comandos manuales

1. **Crear el volumen para datos persistentes:**
```bash
podman volume create news_portal_data
```

2. **Ejecutar el contenedor PostgreSQL:**
```bash
podman run -d \
  --name news_portal_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres123 \
  -e POSTGRES_DB=news_portal \
  -p 5432:5432 \
  -v news_portal_data:/var/lib/postgresql/data \
  -v "$(pwd)/init-db:/docker-entrypoint-initdb.d:Z" \
  docker.io/library/postgres:15-alpine
```

## Información de la Base de Datos

- **Host:** localhost
- **Puerto:** 5432
- **Base de datos:** news_portal
- **Usuario:** postgres
- **Contraseña:** postgres123
- **Connection String:** `postgresql://postgres:postgres123@localhost:5432/news_portal`

## Comandos Útiles

### Detener la base de datos
```bash
podman stop news_portal_db
```

### Iniciar la base de datos
```bash
podman start news_portal_db
```

### Conectarse a la base de datos con psql
```bash
podman exec -it news_portal_db psql -U postgres -d news_portal
```

### Ver logs del contenedor
```bash
podman logs news_portal_db
```

### Ver logs en tiempo real
```bash
podman logs -f news_portal_db
```

### Eliminar el contenedor (mantiene los datos)
```bash
podman stop news_portal_db
podman rm news_portal_db
```

### Eliminar el contenedor y los datos
```bash
podman stop news_portal_db
podman rm news_portal_db
podman volume rm news_portal_data
```

### Ver el estado del contenedor
```bash
podman ps -a | grep news_portal_db
```

## Schema de la Base de Datos

La base de datos contiene una tabla principal `news` con la siguiente estructura:

| Columna | Tipo | Descripción |
|---------|------|-------------|
| newId | TEXT | ID único del artículo (PK) |
| portalName | VARCHAR(100) | Nombre del portal de origen |
| newTitle | TEXT | Título de la noticia |
| newDate | TIMESTAMPTZ | Fecha de publicación |
| image | TEXT | URL de la imagen (opcional) |
| description | TEXT | Descripción corta (opcional) |
| content | TEXT | Contenido completo HTML |
| category | VARCHAR(100) | Categoría de la noticia |
| flag | BOOLEAN | Flag para destacar noticias |

### Índices

- **pk_news**: Clave primaria en `newId`
- **idx_news_category**: Índice en `category`
- **idx_news_flag**: Índice en `flag`
- **idx_news_category_date**: Índice compuesto en `category` y `newDate DESC`

## Reiniciar el Schema

Si necesitas reiniciar el schema desde cero:

1. Detener y eliminar el contenedor:
```bash
podman stop news_portal_db
podman rm news_portal_db
```

2. Eliminar el volumen:
```bash
podman volume rm news_portal_data
```

3. Volver a ejecutar el script de setup:
```bash
./setup-db.sh
```

## Troubleshooting

### El puerto 5432 ya está en uso

Si ya tienes PostgreSQL corriendo localmente, puedes mapear a un puerto diferente:

```bash
podman run -d \
  --name news_portal_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres123 \
  -e POSTGRES_DB=news_portal \
  -p 5433:5432 \
  -v news_portal_data:/var/lib/postgresql/data \
  -v "$(pwd)/init-db:/docker-entrypoint-initdb.d:Z" \
  docker.io/library/postgres:15-alpine
```

Y actualizar tu `DATABASE_URL` a: `postgresql://postgres:postgres123@localhost:5433/news_portal`

### Permisos de volumen (SELinux)

Si tienes problemas con SELinux, asegúrate de usar el flag `:Z` en el montaje del volumen de init-db como se muestra en los ejemplos.

## Configuración del Backend

Asegúrate de que tu archivo `.env` en `apps/api` contenga:

```env
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/news_portal
```

Puedes copiar el archivo de ejemplo:

```bash
cp apps/api/.env.example apps/api/.env
```
