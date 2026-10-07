# Prueba Técnica Full Stack — Repositorio base (Node)

Este repo existe para que **no pierdas tiempo en configuración**. Lo aburrido ya
está resuelto; lo que evaluamos lo construyes tú.

Recuerda: la parte práctica está pensada para **un máximo de 3 horas**. No pasa
nada si usas IA — solo pedimos que entiendas y puedas explicar lo que entregues.

---

## Arranque rápido

Necesitas **Node 18.18+**.

```bash
npm install
cp .env.example .env     # en Windows: copy .env.example .env
npm run dev
```

Luego abre: http://localhost:3000/health
Si ves `{"status":"ok","db":true}`, todo está corriendo.

> `npm install` compila `better-sqlite3`. En la mayoría de los sistemas usa un
> binario precompilado y no necesitas nada extra.

---

## El reto (resumen)

Un **mini-gestor de contactos (leads)** que funcione de punta a punta:

**formulario público → tu API → base de datos → panel protegido**

1. Formulario público de contacto (nombre, correo, mensaje) con validación
   **en cliente y en servidor**.
2. Al enviarse, el contacto se **guarda en la base de datos** vía tu API.
3. Una **vista de administración protegida** que lista los contactos, del más
   reciente al más antiguo.
4. Manejo básico de errores.

No sobre-ingenierices: preferimos algo simple y bien resuelto.

---

## Qué ya está hecho (no necesitas tocarlo)

- Proyecto de Express que arranca con `npm run dev`.
- Conexión a **SQLite ya configurada** (`src/db.js`) — crea el archivo solo.
- Lectura de body JSON y de formularios.
- Servido de estáticos desde `src/public` (por si usas HTML/CSS/JS "vanilla").
- Ruta `/health` funcionando.
- `.gitignore` correcto (no subas `node_modules` ni tu `.env`).

## Qué construyes tú (esto es lo que evaluamos)

| Dónde | Qué falta |
|---|---|
| `src/db.js` | Diseñar el **esquema** de la tabla de contactos. |
| `src/routes/contacts.js` | `POST /api/contacts` (guardar) y `GET /api/contacts` (listar). |
| `src/middleware/auth.js` | La **autenticación** del panel (ahora no protege nada). |
| `src/public/` *(o tu front)* | El **formulario** y la **vista de administración**. |

El front-end es tu decisión: puedes usar la carpeta `src/public` con vanilla, o
montar **Astro / Next / Svelte** aparte. Lo único imprescindible es que consuma
tu propia API.

---

## Entrega

- Este repositorio en **GitHub** con tus commits.
- Completa la sección de abajo en este mismo README.
- Opcional: un video corto (2–3 min) mostrándolo funcionar. **No** hace falta
  desplegarlo; el despliegue lo conversamos en la sesión en vivo.

### Para completar por el candidato

**Cómo correr mi proyecto:**
_(si cambiaste algo del arranque, explícalo aquí)_

**Decisiones técnicas (3–4 puntos):**

- Usé Express y el frontend estático existente para mantener el alcance simple,
  sin incorporar un framework adicional innecesario.
- Modelé los contactos en SQLite con campos obligatorios y fecha de creación;
  el listado se ordena en el servidor del más reciente al más antiguo.
- La API valida y normaliza los datos en el backend, además de la validación del
  navegador. Todas sus respuestas incluyen `code` y `message`.
- Protegí la consulta con Basic Auth usando credenciales de entorno. La interfaz
  mantiene la autorización solo en `sessionStorage` durante la pestaña activa.

**Cómo usé IA:**

Usé IA para revisar la estructura inicial, proponer la implementación del flujo
completo y generar una primera versión de API, frontend y estilos. Revisé e
integré los cambios, ajusté el diseño responsivo, la gestión de errores de Basic
Auth, el filtro progresivo compatible con SQLite y validé los flujos manualmente
en el navegador y mediante peticiones HTTP.

**Qué dejé pendiente por tiempo y cómo lo resolvería:**

No quedan requisitos funcionales del reto pendientes. Para una siguiente
iteración agregaría pruebas automatizadas de API e interfaz, paginación para
listas grandes y un esquema de autenticación de producción con usuarios
persistidos y contraseñas almacenadas mediante hash.
