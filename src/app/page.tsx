import Link from "next/link"
import { auth } from "@/auth"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { siteConfig } from "@/config/site"
import { Grid2x2PlusIcon } from "lucide-react"

export default async function HomePage() {
  const session = await auth()
  const { home } = siteConfig

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-muted via-background to-background"
      />
      <header className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <Grid2x2PlusIcon className="size-6" />
          <span className="text-xl font-semibold">{siteConfig.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {session?.user ? (
            <Button asChild>
              <Link href="/dashboard">{home.dashboard}</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/login">{home.signIn}</Link>
            </Button>
          )}
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-6 pb-24 text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          {home.headline}
        </h1>
        <p className="text-muted-foreground max-w-xl text-lg">{home.subtitle}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/login">{home.ctaLogin}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a
              href="https://authjs.dev/getting-started/providers"
              target="_blank"
              rel="noreferrer"
            >
              {home.ctaDocs}
            </a>
          </Button>
        </div>
      </section>
    </main>
  )
}
