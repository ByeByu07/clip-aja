import { SectionCards } from "@/components/section-cards"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { SiTiktok } from "react-icons/si"

const dummyAccounts = [
    {
        name: "@dandy",
        icon: <SiTiktok className="size-10"/>
    }
]


export default function Page() {
  return (
    <>
      <div className="@container/main flex flex-1 flex-col gap-2 px-4">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="flex flex-col gap-4">
                <p className="text-2xl font-semibold">Social Accounts</p>
                <p className="text-muted-foreground">Social accounts are the accounts you use to post your content.</p>
            </div>
            <div className="flex gap-4">
                {dummyAccounts.map((account, index) => (
                    <Card key={index} className="h-[100px] w-[100px] border-2 border-gray-400 border border-dashed hover:border-gray-900 group transition-all duration-500 ease-in-out">
                        <div className="w-full h-full flex flex-col items-center justify-center">
                            {account.icon}
                            <p className="text-center">{account.name}</p>
                        </div>
                    </Card>
                ))}
                <Card className="h-[100px] w-[100px] border-2 border-gray-400 border border-dashed hover:border-gray-900 group transition-all duration-500 ease-in-out">
                    <div className="w-full h-full flex items-center justify-center">
                        <SiTiktok className="size-10 group-hover:-translate-y-1 transition-all duration-500 ease-in-out"/>
                        <Plus className="group-hover:-translate-y-4 transition-all duration-500 ease-in-out"/>
                    </div>
                </Card>
            </div>
        </div>
      </div>
    </>
  )
}
