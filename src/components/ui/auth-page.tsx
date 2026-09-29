'use client'

import React, { useMemo, useState, useTransition } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from './button'
import {
  AppleIcon,
  AtSignIcon,
  ChevronLeftIcon,
  Grid2x2PlusIcon,
  Loader2Icon,
} from 'lucide-react'
import { Input } from './input'
import { ThemeToggle } from './theme-toggle'
import { siteConfig } from '@/config/site'

export type SocialProvider =
  | 'google'
  | 'apple'
  | 'github'
  | 'discord'
  | 'facebook'
  | 'twitter'
  | 'linkedin'
  | 'spotify'
  | 'twitch'
  | 'reddit'
  | 'microsoft-entra-id'

export interface AuthPageProps {
  /** Override brand name (defaults to siteConfig.name) */
  brandName?: string
  homeHref?: string
  enabledProviders?: SocialProvider[]
  emailEnabled?: boolean
  providersConfigured?: boolean
  callbackUrl?: string
  error?: string | null
}

const PRIMARY_PROVIDERS: SocialProvider[] = ['google', 'apple', 'github']
const copy = siteConfig.auth

export function AuthPage({
  brandName = siteConfig.name,
  homeHref = siteConfig.homeHref,
  enabledProviders,
  emailEnabled = false,
  providersConfigured = true,
  callbackUrl = siteConfig.callbackUrl,
  error,
}: AuthPageProps) {
  const [email, setEmail] = useState('')
  const [showMore, setShowMore] = useState(false)
  const [pendingProvider, setPendingProvider] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const available =
    enabledProviders && enabledProviders.length > 0
      ? enabledProviders
      : PRIMARY_PROVIDERS

  const primary = PRIMARY_PROVIDERS.filter((p) => available.includes(p))
  const secondary = available.filter((p) => !PRIMARY_PROVIDERS.includes(p))

  function handleOAuth(provider: SocialProvider) {
    setPendingProvider(provider)
    startTransition(async () => {
      await signIn(provider, { callbackUrl })
    })
  }

  function handleEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setPendingProvider('email')
    startTransition(async () => {
      await signIn('nodemailer', { email: email.trim(), callbackUrl })
    })
  }

  return (
    <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
      <div className="bg-muted/60 relative hidden h-full flex-col border-r p-10 lg:flex">
        <div className="from-background absolute inset-0 z-10 bg-gradient-to-t to-transparent" />
        <div className="z-10 flex items-center gap-2">
          <Grid2x2PlusIcon className="size-6" />
          <p className="text-xl font-semibold">{brandName}</p>
        </div>
        <div className="z-10 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-xl">&ldquo;{siteConfig.testimonial.quote}&rdquo;</p>
            <footer className="text-sm font-semibold">
              ~ {siteConfig.testimonial.author}
            </footer>
          </blockquote>
        </div>
        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
      </div>
      <div className="relative flex min-h-screen flex-col justify-center p-4">
        <div
          aria-hidden
          className="absolute inset-0 isolate -z-10 contain-strict opacity-60"
        >
          <div className="absolute top-0 right-0 h-320 w-140 -translate-y-87.5 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)]" />
          <div className="absolute top-0 right-0 h-320 w-60 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="absolute top-0 right-0 h-320 w-60 -translate-y-87.5 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)]" />
        </div>
        <Button variant="ghost" className="absolute top-7 left-5" asChild>
          <a href={homeHref}>
            <ChevronLeftIcon className="me-2 size-4" />
            {copy.homeLabel}
          </a>
        </Button>
        <ThemeToggle className="absolute top-7 right-5" />
        <div className="mx-auto space-y-4 sm:w-sm">
          <div className="flex items-center gap-2 lg:hidden">
            <Grid2x2PlusIcon className="size-6" />
            <p className="text-xl font-semibold">{brandName}</p>
          </div>
          <div className="flex flex-col space-y-1">
            <h1 className="font-heading text-2xl font-bold tracking-wide">
              {copy.headline}
            </h1>
            <p className="text-muted-foreground text-base">{copy.subtitle}</p>
          </div>

          {error ? (
            <div
              role="alert"
              className="border-destructive/40 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm"
            >
              {formatAuthError(error)}
            </div>
          ) : null}

          {!providersConfigured ? (
            <div
              role="status"
              className="border-border bg-muted/50 rounded-md border px-3 py-2 text-sm"
            >
              <p className="font-medium">{copy.setupTitle}</p>
              <p className="text-muted-foreground mt-1 text-xs">{copy.setupBody}</p>
            </div>
          ) : null}

          <div className="space-y-2">
            {primary.map((provider) => {
              const { label, Icon } = PROVIDER_META[provider]
              const loading = isPending && pendingProvider === provider
              return (
                <Button
                  key={provider}
                  type="button"
                  size="lg"
                  className="w-full"
                  disabled={isPending}
                  onClick={() => handleOAuth(provider)}
                >
                  {loading ? (
                    <Loader2Icon className="me-2 size-4 animate-spin" />
                  ) : (
                    <Icon className="me-2 size-4" />
                  )}
                  {label}
                </Button>
              )
            })}

            {secondary.length > 0 ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full"
                  disabled={isPending}
                  onClick={() => setShowMore((v) => !v)}
                >
                  {showMore ? copy.lessProviders : copy.moreProviders}
                </Button>
                {showMore ? (
                  <div className="space-y-2">
                    {secondary.map((provider) => {
                      const { label, Icon } = PROVIDER_META[provider]
                      const loading = isPending && pendingProvider === provider
                      return (
                        <Button
                          key={provider}
                          type="button"
                          size="lg"
                          variant="secondary"
                          className="w-full"
                          disabled={isPending}
                          onClick={() => handleOAuth(provider)}
                        >
                          {loading ? (
                            <Loader2Icon className="me-2 size-4 animate-spin" />
                          ) : (
                            <Icon className="me-2 size-4" />
                          )}
                          {label}
                        </Button>
                      )
                    })}
                  </div>
                ) : null}
              </>
            ) : null}
          </div>

          <AuthSeparator />

          <form className="space-y-2" onSubmit={handleEmail}>
            <p className="text-muted-foreground text-start text-xs">
              {copy.emailHint}
            </p>
            <div className="relative h-max">
              <Input
                placeholder={copy.emailPlaceholder}
                className="peer ps-9"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending || !emailEnabled}
              />
              <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                <AtSignIcon className="size-4" aria-hidden="true" />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isPending || !email.trim()}
            >
              {isPending && pendingProvider === 'email' ? (
                <Loader2Icon className="me-2 size-4 animate-spin" />
              ) : null}
              <span>{copy.emailButton}</span>
            </Button>
            {!emailEnabled ? (
              <p className="text-muted-foreground text-xs">
                {copy.emailDisabledHint}
              </p>
            ) : null}
          </form>
          <p className="text-muted-foreground mt-8 text-sm">
            {copy.legalPrefix}{' '}
            <a
              href={copy.termsHref}
              className="hover:text-primary underline underline-offset-4"
            >
              {copy.termsLabel}
            </a>{' '}
            {copy.legalAnd}{' '}
            <a
              href={copy.privacyHref}
              className="hover:text-primary underline underline-offset-4"
            >
              {copy.privacyLabel}
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  )
}

function formatAuthError(error: string) {
  const map: Record<string, string> = {
    OAuthAccountNotLinked:
      'This email is already linked to another provider. Sign in with the original method.',
    Configuration:
      'Auth is misconfigured. Check AUTH_SECRET and provider credentials.',
    AccessDenied: 'Access denied. Try another account.',
    Verification: 'The email link is invalid or has expired.',
    Default: 'Something went wrong. Please try again.',
  }
  return map[error] ?? map.Default
}

function FloatingPaths({ position }: { position: number }) {
  const paths = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
          380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
          152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
          684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        width: 0.5 + i * 0.03,
        duration: 25 + (i % 7) * 2.5,
        opacity: 0.06 + i * 0.015,
      })),
    [position]
  )

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full text-slate-950 dark:text-white"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={path.opacity}
            pathLength={1}
            strokeDasharray="0.3 0.7"
            style={{
              animation: `auth-path-drift ${path.duration}s linear infinite`,
            }}
          />
        ))}
      </svg>
    </div>
  )
}

const GoogleIcon = (props: React.ComponentProps<'svg'>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669   C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62   c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401   c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z" />
  </svg>
)

function GitHubBrandIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function DiscordIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.317 4.37a19.8 19.8 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.08.08 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

function FacebookIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.03H7.9v-2.9h2.4V9.84c0-2.37 1.4-3.69 3.56-3.69 1.03 0 2.12.19 2.12.19v2.33h-1.2c-1.18 0-1.55.73-1.55 1.48v1.78h2.64l-.42 2.9h-2.22V22c4.78-.75 8.44-4.91 8.44-9.93z" />
    </svg>
  )
}

function XIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  )
}

function LinkedInIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1-.004-4.125 2.062 2.062 0 0 1 .004 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function SpotifyIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.221-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  )
}

function TwitchIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
    </svg>
  )
}

function RedditIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.914.614a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.034 4.811c-.005.046-.054.2-.14.2-.086 0-.135-.154-.14-.2-.14-.68.276-1.14 1.2-1.14.926 0 1.34.46 1.2 1.14zm2.834 0s-.05.154-.14.2c-.086 0-.134-.154-.14-.2-.14-.68.276-1.14 1.2-1.14.925 0 1.339.46 1.2 1.14z" />
    </svg>
  )
}

function MicrosoftIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M11.4 11.4H2V2h9.4v9.4zm10.6 0h-9.4V2H22v9.4zM11.4 22H2v-9.4h9.4V22zm10.6 0h-9.4v-9.4H22V22z" />
    </svg>
  )
}

const PROVIDER_META: Record<
  SocialProvider,
  { label: string; Icon: React.ComponentType<React.ComponentProps<'svg'>> }
> = {
  google: { label: 'Continue with Google', Icon: GoogleIcon },
  apple: { label: 'Continue with Apple', Icon: AppleIcon },
  github: { label: 'Continue with GitHub', Icon: GitHubBrandIcon },
  discord: { label: 'Continue with Discord', Icon: DiscordIcon },
  facebook: { label: 'Continue with Facebook', Icon: FacebookIcon },
  twitter: { label: 'Continue with X', Icon: XIcon },
  linkedin: { label: 'Continue with LinkedIn', Icon: LinkedInIcon },
  spotify: { label: 'Continue with Spotify', Icon: SpotifyIcon },
  twitch: { label: 'Continue with Twitch', Icon: TwitchIcon },
  reddit: { label: 'Continue with Reddit', Icon: RedditIcon },
  'microsoft-entra-id': {
    label: 'Continue with Microsoft',
    Icon: MicrosoftIcon,
  },
}

const AuthSeparator = () => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="bg-border h-px w-full" />
      <span className="text-muted-foreground px-2 text-xs">OR</span>
      <div className="bg-border h-px w-full" />
    </div>
  )
}
