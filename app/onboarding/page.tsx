"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { Loader2, Megaphone, Scissors } from "lucide-react"

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const [selectedRole, setSelectedRole] = useState<"advertiser" | "clipper" | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // If user already has a role, redirect to their dashboard
    if (session?.user && session.user.role) {
      if (session.user.role === "advertiser") {
        router.push("/dashboard")
      } else if (session.user.role === "clipper") {
        router.push("/dashboard/clipper")
      }
    }
  }, [session, router])

  const handleRoleSelection = async () => {
    if (!selectedRole) {
      toast.error("Please select a role")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/onboarding/set-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: selectedRole }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to set role")
      }

      toast.success("Role set successfully!")

      // Redirect based on role
      if (selectedRole === "advertiser") {
        router.push("/dashboard")
      } else {
        router.push("/dashboard/clipper")
      }
    } catch (error) {
      console.error("Error setting role:", error)
      toast.error(error instanceof Error ? error.message : "Failed to set role")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!session) {
    router.push("/signin")
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome to Viral Saiki!</h1>
          <p className="text-muted-foreground text-lg">
            Choose your role to get started
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Advertiser Card */}
          <Card
            className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
              selectedRole === "advertiser"
                ? "ring-4 ring-purple-500 shadow-xl"
                : "hover:shadow-lg"
            }`}
            onClick={() => setSelectedRole("advertiser")}
          >
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-6 rounded-full ${
                  selectedRole === "advertiser"
                    ? "bg-purple-100 text-purple-600"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  <Megaphone className="h-12 w-12" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-2">Advertiser</h2>
                  <p className="text-muted-foreground mb-4">
                    Create contests and get your brand viral
                  </p>
                </div>

                <ul className="text-left space-y-2 w-full">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Create marketing contests</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Set rewards and budgets</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Track campaign performance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Review clipper submissions</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Clipper Card */}
          <Card
            className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
              selectedRole === "clipper"
                ? "ring-4 ring-blue-500 shadow-xl"
                : "hover:shadow-lg"
            }`}
            onClick={() => setSelectedRole("clipper")}
          >
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className={`p-6 rounded-full ${
                  selectedRole === "clipper"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  <Scissors className="h-12 w-12" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-2">Clipper</h2>
                  <p className="text-muted-foreground mb-4">
                    Create content and earn money
                  </p>
                </div>

                <ul className="text-left space-y-2 w-full">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Browse available contests</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Create viral content</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Earn based on views</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-sm">Track your earnings</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button
            size="lg"
            className="px-12"
            onClick={handleRoleSelection}
            disabled={!selectedRole || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
