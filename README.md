# Auth Login Template

Plantilla lista para clonar: login social con Next.js, TypeScript, Tailwind, shadcn/ui, Auth.js y modo claro/oscuro.

## Personalizar textos (importante)

**Todos los textos de marca están en un solo archivo:**

```text
src/config/site.ts
```

Ahí cambias:

- Nombre de la app (`YourApp` → tu marca)
- Titulares del login y la home
- Testimonio del panel izquierdo
- Enlaces de términos / privacidad
- Textos del dashboard

Ejemplo rápido:

```ts
export const siteConfig = {
  name: "Mi Startup",
  title: "Mi Startup — Acceso",
  // ...
}
```

No hace falta buscar strings por el proyecto.

---

## Arranque

```bash
npm install
cp .env.example .env.local
# Genera secret: openssl rand -base64 32 → AUTH_SECRET
npm run dev
```

Abre [http://localhost:3000/login](http://localhost:3000/login).

---

## Guía: Google OAuth

1. [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. **Create credentials** → **OAuth client ID** → **Web application**
3. Origins: `http://localhost:3000`
4. Redirect: `http://localhost:3000/api/auth/callback/google`
5. En `.env.local`:

```env
AUTH_GOOGLE_ID=xxxxx.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=GOCSPX-xxxxx
```

6. Reinicia `npm run dev` y prueba **Continue with Google**.

En producción añade también `https://TU-DOMINIO.com` y su callback.

---

## Guía: GitHub OAuth

1. [GitHub → OAuth Apps](https://github.com/settings/developers) → **New OAuth App**
2. Homepage: `http://localhost:3000`
3. Callback: `http://localhost:3000/api/auth/callback/github`
4. Genera el Client Secret
5. En `.env.local`:

```env
AUTH_GITHUB_ID=Iv1.xxxxxxxx
AUTH_GITHUB_SECRET=xxxxxxxx
```

---

## Guía: Apple Sign In

Requiere cuenta Apple Developer. Resumen:

1. Crea un **Services ID** (será `AUTH_APPLE_ID`)
2. Return URL: `http://localhost:3000/api/auth/callback/apple`
3. Crea una **Key** `.p8` con Sign In with Apple
4. Genera el JWT client secret:

```bash
npm install -D apple-signin-auth
APPLE_CLIENT_ID=com.tuapp.web \
APPLE_TEAM_ID=XXXXXXXXXX \
APPLE_KEY_ID=YYYYYYYYYY \
APPLE_PRIVATE_KEY_PATH=./AuthKey_XXXXX.p8 \
node scripts/generate-apple-secret.mjs
```

5. Pega el output en `.env.local` como `AUTH_APPLE_ID` y `AUTH_APPLE_SECRET`

Detalle: [Auth.js Apple](https://authjs.dev/getting-started/providers/apple)

---

## Otros providers

| Provider | Variables | Callback |
|----------|-----------|----------|
| Discord | `AUTH_DISCORD_ID`, `AUTH_DISCORD_SECRET` | `/api/auth/callback/discord` |
| Facebook | `AUTH_FACEBOOK_ID`, `AUTH_FACEBOOK_SECRET` | `/api/auth/callback/facebook` |
| X | `AUTH_TWITTER_ID`, `AUTH_TWITTER_SECRET` | `/api/auth/callback/twitter` |
| LinkedIn | `AUTH_LINKEDIN_ID`, `AUTH_LINKEDIN_SECRET` | `/api/auth/callback/linkedin` |
| Spotify | `AUTH_SPOTIFY_ID`, `AUTH_SPOTIFY_SECRET` | `/api/auth/callback/spotify` |
| Twitch | `AUTH_TWITCH_ID`, `AUTH_TWITCH_SECRET` | `/api/auth/callback/twitch` |
| Reddit | `AUTH_REDDIT_ID`, `AUTH_REDDIT_SECRET` | `/api/auth/callback/reddit` |
| Microsoft | `AUTH_MICROSOFT_ENTRA_ID_*` | `/api/auth/callback/microsoft-entra-id` |

Plantilla vacía: `.env.example`

Solo se activan los providers con claves rellenadas.

---

## Modo claro / oscuro

Botón sol/luna en login, home y dashboard (`next-themes`).

---

## Publicar en Vercel

1. Sube el repo (sin `.env.local`)
2. Añade las variables en Vercel
3. `AUTH_URL=https://tu-proyecto.vercel.app`
4. Actualiza los callbacks OAuth a producción

---

## Estructura

```text
src/
  config/site.ts          ← textos / marca (edita aquí)
  auth.ts
  middleware.ts
  app/login/
  app/dashboard/
  components/ui/auth-page.tsx
```

---

## Stack

- Next.js 16 · TypeScript · Tailwind v4 · shadcn/ui
- Auth.js (next-auth v5) · next-themes · lucide-react
- Fuente del sistema (sin Google Fonts)
