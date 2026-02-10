-- Paso 1: Crear la base de datos (si no se ha hecho)
CREATE DATABASE news_portal
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8';

-- Paso 2: Conectarse a la base de datos `news_portal`
-- En psql: \c news_portal

-- Paso 3: Crear la tabla `news` con una restricción de clave primaria explícita.
CREATE TABLE IF NOT EXISTS news (
    
    -- Se declara la columna sin la restricción en la misma línea
    "newId" TEXT NOT NULL,

    "portalName" VARCHAR(100) NOT NULL,
    "newTitle" TEXT NOT NULL,
    "newDate" TIMESTAMPTZ NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "flag" BOOLEAN NOT NULL DEFAULT FALSE,

    -- RESTRICCIÓN DE CLAVE PRIMARIA:
    -- Aquí se define explícitamente "newId" como la clave primaria de la tabla.
    -- Esto es funcionalmente idéntico a poner "PRIMARY KEY" junto a la declaración de la columna.
    CONSTRAINT pk_news PRIMARY KEY ("newId")
);

-- Paso 4: Crear los índices para las columnas de filtrado.

CREATE INDEX IF NOT EXISTS idx_news_category ON news("category");
CREATE INDEX IF NOT EXISTS idx_news_flag ON news("flag");
CREATE INDEX IF NOT EXISTS idx_news_category_date ON news("category", "newDate" DESC);


-- Mensaje de finalización para el script.
COMMENT ON TABLE news IS 'Tabla principal para almacenar los artículos del portal de noticias. "newId" es la clave primaria.';
