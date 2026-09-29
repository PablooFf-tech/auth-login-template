/**
 * ============================================================
 *  PLANTILLA — Personaliza estos textos a tu gusto
 * ============================================================
 * Cambia marca, titulares, testimonio y enlaces legales aquí.
 * No hace falta tocar el resto del código para rebrandear.
 */
export const siteConfig = {
  /** Nombre de tu producto / marca */
  name: "YourApp",

  /** Título del navegador */
  title: "YourApp — Sign in",

  /** Descripción SEO */
  description:
    "Plantilla de login social con Google, Apple, GitHub y más. Cámbiala a tu marca.",

  /** URL de inicio (botón Home) */
  homeHref: "/",

  /** A dónde redirigir tras iniciar sesión */
  callbackUrl: "/dashboard",

  /** Página de login */
  auth: {
    headline: "Sign in or create an account",
    subtitle: "Use your preferred method to continue.",
    emailHint: "Enter your email address to sign in or create an account",
    emailPlaceholder: "you@example.com",
    emailButton: "Continue with email",
    emailDisabledHint:
      "Email magic-link requires SMTP env vars (see .env.example).",
    homeLabel: "Home",
    moreProviders: "More social logins",
    lessProviders: "Show less",
    termsLabel: "Terms of Service",
    privacyLabel: "Privacy Policy",
    termsHref: "/terms",
    privacyHref: "/privacy",
    legalPrefix: "By clicking continue, you agree to our",
    legalAnd: "and",
    setupTitle: "Configure OAuth to enable login",
    setupBody:
      "Add your provider keys in .env.local (Google, Apple, GitHub…). Step-by-step guide in README.md.",
  },

  /** Panel izquierdo (desktop) */
  testimonial: {
    quote:
      "Replace this quote with a real customer testimonial about your product.",
    author: "Customer Name",
  },

  /** Landing (/) */
  home: {
    headline: "Auth template ready to customize",
    subtitle:
      "Google, Apple, GitHub and more. Copy this project, set your OAuth keys, and rebrand the texts in src/config/site.ts.",
    ctaLogin: "Open login",
    ctaDocs: "Provider docs",
    signIn: "Sign in",
    dashboard: "Dashboard",
  },

  /** Dashboard */
  dashboard: {
    title: "Dashboard",
    signedInAs: "Signed in as",
    nameLabel: "Name",
    emailLabel: "Email",
    userIdLabel: "User ID",
    signOut: "Sign out",
  },

  /** Email verify page */
  verify: {
    title: "Check your email",
    body: "A sign-in link has been sent to your inbox. Open it to continue.",
    back: "Back to login",
  },
} as const

export type SiteConfig = typeof siteConfig
