import { redirect } from "next/navigation"
import { auth, signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { siteConfig } from "@/config/site"

export default async function DashboardPage() {
  const session = await auth()
  const { dashboard } = siteConfig

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col justify-center gap-6 p-6">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{dashboard.title}</h1>
        <p className="text-muted-foreground">
          {dashboard.signedInAs}{" "}
          <span className="text-foreground font-medium">
            {session.user.email ?? session.user.name ?? "user"}
          </span>
        </p>
      </div>

      <div className="bg-muted/50 space-y-2 rounded-xl border p-4 text-sm">
        <p>
          <span className="text-muted-foreground">{dashboard.nameLabel}:</span>{" "}
          {session.user.name ?? "—"}
        </p>
        <p>
          <span className="text-muted-foreground">{dashboard.emailLabel}:</span>{" "}
          {session.user.email ?? "—"}
        </p>
        <p>
          <span className="text-muted-foreground">{dashboard.userIdLabel}:</span>{" "}
          {session.user.id}
        </p>
      </div>

      <form
        action={async () => {
          "use server"
          await signOut({ redirectTo: "/" })
        }}
      >
        <Button type="submit" variant="outline" className="w-full">
          {dashboard.signOut}
        </Button>
      </form>
    </main>
  )
}
