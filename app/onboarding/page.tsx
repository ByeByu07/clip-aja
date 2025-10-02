"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { Loader2, Megaphone, Scissors, Check, ChevronRight } from "lucide-react"
import { defineStepper } from "@/components/stepper"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const { Stepper, useStepper } = defineStepper(
  { id: "role", title: "Pilih Peran" },
  { id: "referral", title: "Sumber Referensi" }
)

const referralOptions = [
  { value: "social-media", label: "Media Sosial (TikTok, Instagram, dll.)" },
  { value: "search-engine", label: "Mesin Pencari (Google, Bing, dll.)" },
  { value: "friend-referral", label: "Teman atau Rekan" },
  { value: "advertisement", label: "Iklan Online" },
  { value: "influencer", label: "Influencer atau Kreator Konten" },
  { value: "blog-article", label: "Blog atau Artikel" },
  { value: "other", label: "Lainnya" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const [selectedRole, setSelectedRole] = useState<"advertiser" | "clipper" | null>(null)
  const [referralSource, setReferralSource] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (session?.user && session.user.role) {
      if (session.user.role === "advertiser") {
        router.push("/dashboard")
      } else if (session.user.role === "clipper") {
        router.push("/dashboard/clipper")
      }
    }
  }, [session, router])

  const handleComplete = async () => {
    if (!selectedRole) {
      toast.error("Silakan pilih peran Anda")
      return
    }

    if (!referralSource) {
      toast.error("Silakan beritahu kami bagaimana Anda menemukan Clip Aja")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/onboarding/set-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: selectedRole,
          referralSource: referralSource
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Gagal menyelesaikan onboarding")
      }

      toast.success("Selamat datang di Clip Aja!")

      if (selectedRole === "advertiser") {
        router.push("/dashboard")
      } else {
        router.push("/dashboard/clipper")
      }
    } catch (error) {
      console.error("Error completing onboarding:", error)
      toast.error(error instanceof Error ? error.message : "Gagal menyelesaikan onboarding")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (!session) {
    router.push("/signin")
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-gray-900">
              Selamat Datang di <span className="text-orange-500">Clip Aja!</span>
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              Mari siapkan akun Anda dalam 2 langkah sederhana
            </p>
          </div>

          <Stepper.Provider>
            {({ methods }) => (
              <div className="space-y-6 md:space-y-8">
                {/* Stepper Navigation */}
                <div className="mb-8">
                  <Stepper.Navigation>
                    <Stepper.Step of="role">
                      <Stepper.Title>Pilih Peran</Stepper.Title>
                      <Stepper.Description>Pilih tipe akun Anda</Stepper.Description>
                    </Stepper.Step>
                    <Stepper.Step of="referral">
                      <Stepper.Title>Sumber Referensi</Stepper.Title>
                      <Stepper.Description>Bagaimana Anda menemukan kami?</Stepper.Description>
                    </Stepper.Step>
                  </Stepper.Navigation>
                </div>

                {/* Step 1: Role Selection */}
                {methods.current.id === "role" && (
                  <Stepper.Panel>
                    <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6">
                      {/* Advertiser Card */}
                      <Card
                        className={`cursor-pointer transition-all duration-200 rounded-none ${
                          selectedRole === "advertiser"
                            ? "ring-2 ring-orange-500 border-orange-500 shadow-lg"
                            : "border-gray-200 hover:border-orange-300 hover:shadow-md"
                        }`}
                        onClick={() => setSelectedRole("advertiser")}
                      >
                        <CardContent className="p-4 md:p-6">
                          <div className="flex flex-col items-center text-center space-y-4">
                            <div className={`relative p-4 rounded-full ${
                              selectedRole === "advertiser"
                                ? "bg-orange-100"
                                : "bg-gray-100"
                            }`}>
                              <Megaphone className={`h-8 w-8 md:h-10 md:w-10 ${
                                selectedRole === "advertiser" ? "text-orange-500" : "text-gray-600"
                              }`} />
                              {selectedRole === "advertiser" && (
                                <div className="absolute -top-1 -right-1 bg-orange-500 text-white rounded-full p-1">
                                  <Check className="h-3 w-3 md:h-4 md:w-4" />
                                </div>
                              )}
                            </div>

                            <div>
                              <h2 className="text-2xl md:text-3xl font-bold mb-2">Advertiser</h2>
                              <p className="text-gray-600 text-sm md:text-base">
                                Buat kontes dan viralkan brand Anda
                              </p>
                            </div>

                            <ul className="text-left space-y-2 w-full">
                              <li className="flex items-start text-sm">
                                <span className="text-orange-500 mr-2 mt-0.5">✓</span>
                                <span>Buat kontes pemasaran</span>
                              </li>
                              <li className="flex items-start text-sm">
                                <span className="text-orange-500 mr-2 mt-0.5">✓</span>
                                <span>Atur reward dan anggaran</span>
                              </li>
                              <li className="flex items-start text-sm">
                                <span className="text-orange-500 mr-2 mt-0.5">✓</span>
                                <span>Pantau performa kampanye</span>
                              </li>
                              <li className="flex items-start text-sm">
                                <span className="text-orange-500 mr-2 mt-0.5">✓</span>
                                <span>Review konten clipper</span>
                              </li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Clipper Card */}
                      <Card
                        className={`cursor-pointer transition-all duration-200 rounded-none ${
                          selectedRole === "clipper"
                            ? "ring-2 ring-orange-500 border-orange-500 shadow-lg"
                            : "border-gray-200 hover:border-orange-300 hover:shadow-md"
                        }`}
                        onClick={() => setSelectedRole("clipper")}
                      >
                        <CardContent className="p-4 md:p-6">
                          <div className="flex flex-col items-center text-center space-y-4">
                            <div className={`relative p-4 rounded-full ${
                              selectedRole === "clipper"
                                ? "bg-orange-100"
                                : "bg-gray-100"
                            }`}>
                              <Scissors className={`h-8 w-8 md:h-10 md:w-10 ${
                                selectedRole === "clipper" ? "text-orange-500" : "text-gray-600"
                              }`} />
                              {selectedRole === "clipper" && (
                                <div className="absolute -top-1 -right-1 bg-orange-500 text-white rounded-full p-1">
                                  <Check className="h-3 w-3 md:h-4 md:w-4" />
                                </div>
                              )}
                            </div>

                            <div>
                              <h2 className="text-2xl md:text-3xl font-bold mb-2">Clipper</h2>
                              <p className="text-gray-600 text-sm md:text-base">
                                Buat konten dan hasilkan uang
                              </p>
                            </div>

                            <ul className="text-left space-y-2 w-full">
                              <li className="flex items-start text-sm">
                                <span className="text-orange-500 mr-2 mt-0.5">✓</span>
                                <span>Jelajahi kontes yang tersedia</span>
                              </li>
                              <li className="flex items-start text-sm">
                                <span className="text-orange-500 mr-2 mt-0.5">✓</span>
                                <span>Buat konten viral</span>
                              </li>
                              <li className="flex items-start text-sm">
                                <span className="text-orange-500 mr-2 mt-0.5">✓</span>
                                <span>Dapatkan penghasilan dari views</span>
                              </li>
                              <li className="flex items-start text-sm">
                                <span className="text-orange-500 mr-2 mt-0.5">✓</span>
                                <span>Lacak pendapatan Anda</span>
                              </li>
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Stepper.Controls>
                      <Button
                        size="lg"
                        className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => {
                          if (!selectedRole) {
                            toast.error("Silakan pilih peran Anda")
                            return
                          }
                          methods.next()
                        }}
                        disabled={!selectedRole}
                      >
                        Lanjutkan
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Stepper.Controls>
                  </Stepper.Panel>
                )}

                {/* Step 2: Referral Source */}
                {methods.current.id === "referral" && (
                  <Stepper.Panel>
                    <Card className="border-gray-200 shadow-sm rounded-none">
                      <CardContent className="p-4 md:p-6">
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">
                          Bagaimana Anda mengetahui <span className="text-orange-500">Clip Aja?</span>
                        </h2>
                        <p className="text-gray-600 mb-6 text-sm md:text-base">
                          Bantu kami memahami bagaimana Anda menemukan kami agar kami dapat meningkatkan jangkauan!
                        </p>

                        <RadioGroup value={referralSource} onValueChange={setReferralSource}>
                          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                            {referralOptions.map((option) => (
                              <div
                                key={option.value}
                                className={`flex items-center space-x-3 p-3 md:p-4 rounded-lg border-2 transition-all cursor-pointer ${
                                  referralSource === option.value
                                    ? "border-orange-500 bg-orange-50"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                                onClick={() => setReferralSource(option.value)}
                              >
                                <RadioGroupItem 
                                  value={option.value} 
                                  id={option.value} 
                                  className="border-orange-500 text-orange-500"
                                />
                                <Label
                                  htmlFor={option.value}
                                  className="flex-1 cursor-pointer text-sm md:text-base"
                                >
                                  {option.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </CardContent>
                    </Card>

                    <Stepper.Controls className="mt-6">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto border-orange-500 text-orange-500 hover:bg-orange-50"
                        onClick={() => methods.prev()}
                      >
                        Kembali
                      </Button>
                      <Button
                        size="lg"
                        className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={handleComplete}
                        disabled={!referralSource || isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Menyelesaikan...
                          </>
                        ) : (
                          <>
                            Selesai
                            <Check className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </Stepper.Controls>
                  </Stepper.Panel>
                )}
              </div>
            )}
          </Stepper.Provider>
        </div>
      </div>
    </div>
  )
}