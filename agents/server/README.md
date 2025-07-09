# NLW Agents

Proyecto desarrollado durante el evento **NLW (Next Level Week)** de **Rocketseat**.

## 🚀 Tecnologías Utilizadas

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado de JavaScript
- **Fastify** - Framework web rápido y eficiente
- **Drizzle ORM** - ORM moderno para TypeScript
- **PostgreSQL** - Base de datos relacional
- **pgVector** - Extensión de PostgreSQL para vectores
- **Zod** - Validación de esquemas TypeScript-first
- **Docker** - Containerización
- **Biome** - Linter y formateador de código

## 🏗️ Patrones de Diseño

- **Repository Pattern** - Abstracción de acceso a datos con Drizzle ORM
- **Plugin Architecture** - Uso de plugins de Fastify para modularización
- **Type-Safe API** - Validación de tipos con Zod y Fastify Type Provider
- **Environment Configuration** - Configuración centralizada con validación de variables de entorno

## ⚙️ Configuración del Proyecto

### Prerequisitos

- Node.js v18+ 
- Docker y Docker Compose
- pnpm (recomendado)

### Instalación

1. **Clone el repositorio**
```bash
git clone <url-del-repositorio>
cd server
```

2. **Instale las dependencias**
```bash
pnpm install
```

3. **Configure las variables de entorno**
```bash
# Cree un archivo .env en la raíz del proyecto
DATABASE_URL="postgresql://docker:docker@localhost:5433/agents"
PORT=3333
```

4. **Inicie la base de datos**
```bash
docker-compose up -d
```

5. **Execute las migraciones**
```bash
pnpm drizzle-kit migrate
```

6. **Populate la base de datos (opcional)**
```bash
pnpm run db:seed
```

### 🔧 Scripts Disponibles

```bash
# Desarrollo (con hot reload)
pnpm run dev

# Producción
pnpm run start

# Seed da base de datos
pnpm run db:seed

# Migraciones
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 🐳 Docker

La aplicación está configurada para usar PostgreSQL con pgVector a través de Docker:

```bash
# Iniciar contenedores
docker-compose up -d

# Parar contenedores
docker-compose down
```

### 📝 API

La API está disponible en `http://localhost:3333`

- `GET /health` - Health check
- `GET /` - Mensaje de bienvenida
- `GET /rooms` - Lista de salas

### 🧪 Testing

Para probar la API, puede usar las collections de Bruno disponibles en la carpeta `NLW-Practice/`.

---

Desarrollado con ❤️ durante el **NLW** de **Rocketseat** by **crunux**.