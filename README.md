## Prueba Técnica para Desarrollador Fullstack

### Sistema de Gestión de Ingresos y Egresos - FinanceApp

Aplicación fullstack para la gestión de ingresos y egresos financieros, gestión de usuarios y generación de reportes.

---

### 🚀 Tecnologías Utilizadas

- **Frontend:** Next.js (Pages Router), TypeScript, Tailwind CSS, Shadcn UI
- **Backend:** Next.js API Routes (REST)
- **Base de Datos:** PostgreSQL (Supabase) con Prisma ORM
- **Autenticación:** Better Auth con GitHub como proveedor OAuth
- **Gráficos:** Recharts
- **Documentación API:** Swagger/OpenAPI (next-swagger-doc)
- **Pruebas:** Jest + React Testing Library

---

### 📋 Funcionalidades

1. **Autenticación** — Inicio de sesión con GitHub OAuth
2. **Roles y Permisos (RBAC)**
   - **ADMIN:** Acceso completo a todas las secciones
   - **USER:** Solo acceso a movimientos
   - Nuevos usuarios se registran automáticamente con rol `ADMIN`
3. **Gestión de Movimientos** — CRUD de ingresos y egresos con tabla y formulario
4. **Gestión de Usuarios** — Tabla de usuarios con edición de nombre y rol (solo ADMIN)
5. **Reportes** — Gráfico de barras por mes, saldo actual, descarga CSV (solo ADMIN)
6. **Documentación API** — Swagger UI disponible en `/api/docs`

---

### 🛠️ Ejecución Local

#### Requisitos Previos
- Node.js >= 18
- Cuenta de Supabase (base de datos PostgreSQL)
- Aplicación OAuth de GitHub configurada

#### 1. Clonar el Repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd prueba-tecnica-fullstack
```

#### 2. Instalar Dependencias
```bash
npm install
```

#### 3. Configurar Variables de Entorno
Crear un archivo `.env` en la raíz del proyecto:
```env
DATABASE_URL="postgresql://usuario:contraseña@host:5432/basedatos"
GITHUB_CLIENT_ID="tu_client_id_de_github"
GITHUB_CLIENT_SECRET="tu_client_secret_de_github"
BETTER_AUTH_SECRET="una_clave_secreta_aleatoria"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
```

#### 4. Migrar la Base de Datos
```bash
npx prisma db push
npx prisma generate
```

#### 5. Ejecutar en Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`

#### 6. Ejecutar Pruebas
```bash
npm test
```

---

### 🌐 Despliegue en Vercel

1. Conectar el repositorio de GitHub a Vercel
2. Configurar las variables de entorno en el panel de Vercel:
   - `DATABASE_URL`
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `BETTER_AUTH_SECRET`
   - `NEXT_PUBLIC_BETTER_AUTH_URL` (la URL de producción de Vercel)
3. Actualizar la URL de callback en la app OAuth de GitHub al dominio de Vercel
4. Desplegar

---

### 📁 Estructura del Proyecto

```
├── components/         # Componentes React reutilizables
│   ├── ui/             # Componentes Shadcn UI
│   └── Layout.tsx      # Layout principal con sidebar
├── lib/
│   ├── auth/           # Configuración de autenticación
│   │   ├── index.ts    # Better Auth config (servidor)
│   │   ├── client.ts   # Better Auth config (cliente)
│   │   ├── context.tsx  # Contexto React de autenticación
│   │   └── middleware.ts # Middleware RBAC para APIs
│   ├── prisma.ts       # Singleton de PrismaClient
│   └── utils.ts        # Utilidades (cn)
├── pages/
│   ├── api/
│   │   ├── auth/       # Endpoints de Better Auth
│   │   ├── transactions/ # CRUD de movimientos
│   │   ├── users/      # Gestión de usuarios
│   │   ├── reports/    # Reportes y CSV
│   │   ├── docs.tsx    # Documentación Swagger
│   │   └── me.ts       # Usuario actual
│   ├── index.tsx       # Home / Dashboard
│   ├── login.tsx       # Inicio de sesión
│   ├── movimientos.tsx # Gestión de movimientos
│   ├── usuarios.tsx    # Gestión de usuarios
│   └── reportes.tsx    # Reportes financieros
├── prisma/
│   └── schema.prisma   # Esquema de base de datos
├── __tests__/          # Pruebas unitarias
└── styles/
    └── globals.css     # Estilos globales
```

---

### 📝 Documentación API

La documentación completa de la API está disponible en `/api/docs` (Swagger UI).

#### Endpoints Principales:
| Método | Ruta | Descripción | Rol Requerido |
|--------|------|-------------|---------------|
| GET | `/api/me` | Usuario actual | Autenticado |
| GET | `/api/transactions` | Listar movimientos | Autenticado |
| POST | `/api/transactions` | Crear movimiento | ADMIN |
| GET | `/api/users` | Listar usuarios | ADMIN |
| PUT | `/api/users/:id` | Editar usuario | ADMIN |
| GET | `/api/reports` | Datos de reportes | ADMIN |
| GET | `/api/reports/csv` | Descargar CSV | ADMIN |

---

### 🧪 Pruebas Unitarias

El proyecto incluye pruebas unitarias con Jest y React Testing Library:
- **utils.test.ts** — Pruebas de la utilidad `cn` para fusión de clases CSS
- **transactions.test.ts** — Validaciones del API de transacciones
- **login.test.tsx** — Renderizado del componente de inicio de sesión
