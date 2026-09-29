import { AuthPage } from "@/components/ui/auth-page"
import { siteConfig } from "@/config/site"
import {
  getEnabledProviders,
  isEmailAuthEnabled,
} from "@/lib/auth-providers"

type SearchParams = Promise<{ error?: string }>

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const enabledProviders = getEnabledProviders()
  const emailEnabled = isEmailAuthEnabled()
  const providersConfigured = enabledProviders.length > 0

  return (
    <AuthPage
      brandName={siteConfig.name}
      homeHref={siteConfig.homeHref}
      callbackUrl={siteConfig.callbackUrl}
      enabledProviders={
        providersConfigured
          ? enabledProviders
          : ["google", "apple", "github"]
      }
      emailEnabled={emailEnabled}
      providersConfigured={providersConfigured}
      error={params.error}
    />
  )
}
