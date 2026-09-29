#!/usr/bin/env node
/**
 * Genera AUTH_APPLE_SECRET (JWT) para Sign in with Apple.
 *
 * Uso:
 *   1. npm install apple-signin-auth
 *   2. Coloca tu AuthKey_XXXXX.p8 en la raíz (o ajusta APPLE_PRIVATE_KEY_PATH)
 *   3. Rellena las variables de abajo o pásalas por entorno
 *   4. node scripts/generate-apple-secret.mjs
 *   5. Copia el output a AUTH_APPLE_SECRET en .env.local
 */
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)

let appleSignin
try {
  appleSignin = require("apple-signin-auth")
} catch {
  console.error(
    "Falta el paquete. Ejecuta: npm install -D apple-signin-auth"
  )
  process.exit(1)
}

const clientID = process.env.APPLE_CLIENT_ID || process.env.AUTH_APPLE_ID
const teamID = process.env.APPLE_TEAM_ID
const keyIdentifier = process.env.APPLE_KEY_ID
const keyPath = process.env.APPLE_PRIVATE_KEY_PATH || "./AuthKey.p8"

if (!clientID || !teamID || !keyIdentifier) {
  console.error(`
Uso:
  APPLE_CLIENT_ID=com.tumarca.web \\
  APPLE_TEAM_ID=XXXXXXXXXX \\
  APPLE_KEY_ID=YYYYYYYYYY \\
  APPLE_PRIVATE_KEY_PATH=./AuthKey_XXXXX.p8 \\
  node scripts/generate-apple-secret.mjs
`)
  process.exit(1)
}

const privateKey = readFileSync(keyPath, "utf8")

const clientSecret = appleSignin.getClientSecret({
  clientID,
  teamID,
  keyIdentifier,
  privateKey,
  expAfter: 15777000, // ~6 meses
})

console.log("\nPega esto en .env.local:\n")
console.log(`AUTH_APPLE_ID=${clientID}`)
console.log(`AUTH_APPLE_SECRET=${clientSecret}\n`)
