import Link from "next/link"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"

export default function VerifyRequestPage() {
  const { verify } = siteConfig

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-bold">{verify.title}</h1>
      <p className="text-muted-foreground text-sm">{verify.body}</p>
      <Button asChild variant="outline">
        <Link href="/login">{verify.back}</Link>
      </Button>
    </main>
  )
}
