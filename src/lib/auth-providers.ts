import { auth } from "@/auth"
import type { SocialProvider } from "@/components/ui/auth-page"

const PROVIDER_ENV: Record<SocialProvider, [string, string]> = {
  google: ["AUTH_GOOGLE_ID", "AUTH_GOOGLE_SECRET"],
  apple: ["AUTH_APPLE_ID", "AUTH_APPLE_SECRET"],
  github: ["AUTH_GITHUB_ID", "AUTH_GITHUB_SECRET"],
  discord: ["AUTH_DISCORD_ID", "AUTH_DISCORD_SECRET"],
  facebook: ["AUTH_FACEBOOK_ID", "AUTH_FACEBOOK_SECRET"],
  twitter: ["AUTH_TWITTER_ID", "AUTH_TWITTER_SECRET"],
  linkedin: ["AUTH_LINKEDIN_ID", "AUTH_LINKEDIN_SECRET"],
  spotify: ["AUTH_SPOTIFY_ID", "AUTH_SPOTIFY_SECRET"],
  twitch: ["AUTH_TWITCH_ID", "AUTH_TWITCH_SECRET"],
  reddit: ["AUTH_REDDIT_ID", "AUTH_REDDIT_SECRET"],
  "microsoft-entra-id": [
    "AUTH_MICROSOFT_ENTRA_ID_ID",
    "AUTH_MICROSOFT_ENTRA_ID_SECRET",
  ],
}

export function getEnabledProviders(): SocialProvider[] {
  return (Object.keys(PROVIDER_ENV) as SocialProvider[]).filter((provider) => {
    const [idKey, secretKey] = PROVIDER_ENV[provider]
    return Boolean(process.env[idKey] && process.env[secretKey])
  })
}

export function isEmailAuthEnabled() {
  return Boolean(
    process.env.EMAIL_SERVER_HOST &&
      process.env.EMAIL_SERVER_USER &&
      process.env.EMAIL_SERVER_PASSWORD &&
      process.env.EMAIL_FROM
  )
}

export { auth }
