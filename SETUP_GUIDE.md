# Guía de Configuración de Servicios Externos

Para ejecutar este proyecto, necesitas configurar una base de datos PostgreSQL en **Supabase** y una aplicación OAuth en **GitHub**. Sigue estos pasos:

---

## 1. Crear Base de Datos en Supabase

1.  Ve a [supabase.com](https://supabase.com/) y regístrate o inicia sesión.
2.  Haz clic en **"New Project"**.
3.  Elige tu organización, pon un nombre (ej: `FinanceApp`) y establece una **contraseña segura** para la base de datos (¡guárdala, la necesitarás!).
4.  Selecciona la región más cercana a ti y crea el proyecto.
5.  Espera unos minutos a que se configure.
6.  Ve a **Project Settings** (icono de engranaje) -> **Database**.
7.  En la sección "Connection String", asegúrate de que esté seleccionada la pestaña "URI".
8.  Copia la URL que aparece. Debería verse así:
    `postgresql://postgres:[TU-CONTRASEÑA]@db.turegion.supabase.co:5432/postgres`
9.  Pega esta URL en tu archivo `.env` en `DATABASE_URL`, reemplazando `[TU-CONTRASEÑA]` por la que creaste en el paso 3.

---

## 2. Crear Aplicación OAuth en GitHub

1.  Ve a [github.com](https://github.com/) e inicia sesión.
2.  Haz clic en tu foto de perfil -> **Settings**.
3.  En el menú lateral izquierdo, ve hasta el final y selecciona **Developer settings**.
4.  Haz clic en **OAuth Apps** -> **New OAuth App**.
5.  Rellena el formulario:
    *   **Application name**: FinanceApp (o lo que prefieras).
    *   **Homepage URL**: `http://localhost:3000`
    *   **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
6.  Haz clic en **Register application**.
7.  Verás tu **Client ID**. Cópialo y pégalo en tu archivo `.env` en `GITHUB_CLIENT_ID`.
8.  Haz clic en **Generate a new client secret**.
9.  Copia el secreto generado y pégalo en tu archivo `.env` en `GITHUB_CLIENT_SECRET`.

---

## 3. Configurar Secretos Adicionales

1.  En tu archivo `.env`, busca `BETTER_AUTH_SECRET`.
2.  Escribe cualquier cadena de texto larga y aleatoria. Puedes usar un generador de contraseñas o simplemente escribir algo difícil de adivinar.
    Ejemplo: `BETTER_AUTH_SECRET="h8923h89dqw89dhcq89wdh89qwdhc"`

---

## 4. Finalizar

1.  Guarda el archivo `.env`.
2.  En la terminal, ejecuta:
    ```bash
    npx prisma db push
    ```
    Si todo está bien, verás un mensaje verde de éxito.
3.  Inicia la aplicación:
    ```bash
    npm run dev
    ```
