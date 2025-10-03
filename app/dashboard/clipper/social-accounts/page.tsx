"use client"

import { SectionCards } from "@/components/section-cards"
import { Card } from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"
import { Plus, Loader2 } from "lucide-react"
import { SiTiktok } from "react-icons/si"
import { useEffect, useState } from "react"
import Image from "next/image"

interface Account {
    id: string
    createdAt: string;
    updatedAt: string;
    provider: string;
    scopes: string[];
    accountId: string;
    username: string;
    avatar_url: string;
}

export default function Page() {

    const [accounts, setAccounts] = useState<Account[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const handleAddNewTiktokAccount = async () => {
        await authClient.linkSocial({
            provider: "tiktok",
            scopes: ["user.info.profile", "video.list", "user.info.basic"],
            fetchOptions: {
                body: {
                    redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/tiktok`,
                    // redirect_url: process.env.NODE_ENV === "development" ? `${process.env.BETTER_AUTH_TIKTOK_URL}/api/auth/callback/tiktok` : `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/tiktok`,
                }
            }
        })
    }

    const loadAccounts = async () => {
        setIsLoading(true)
        const accounts = await authClient.listAccounts();

        if (!accounts.data) {
            setIsLoading(false)
            return;
        }

        // Filter and process TikTok accounts
        const tiktokAccounts = await Promise.all(
            accounts.data
                .filter((account: Account) => account.provider === "tiktok")
                .map(async (account: Account) => {
                    const info = await authClient.accountInfo({
                        accountId: account.accountId,
                    });

                    return {
                        ...account,
                        username: info.data?.user?.name || account.username,
                        avatar_url: info.data?.user?.image || account.avatar_url,
                    };
                })
        );

        // Set all accounts at once
        setAccounts(tiktokAccounts);
        setIsLoading(false)
        console.log(tiktokAccounts);
    };

    useEffect(() => {
        loadAccounts()
    }, [])

    return (
        <>
            <div className="@container/main flex flex-1 flex-col gap-2 px-4">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <div className="flex flex-col gap-4">
                        <p className="text-2xl font-semibold">Social Accounts</p>
                        <p className="text-muted-foreground">Social accounts are the accounts you use to post your content.</p>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                        {isLoading ? (
                            <Card className="h-[140px] w-[140px] border-2 border-gray-200">
                                <div className="w-full h-full flex items-center justify-center">
                                    <Loader2 className="size-8 animate-spin text-gray-400" />
                                </div>
                            </Card>
                        ) : (
                            <>
                                {accounts.map((account: Account, index: number) => (
                                    <Card key={index} className="h-[140px] w-[140px] border-2 border-gray-200 hover:border-gray-400 group transition-all duration-300 ease-in-out relative overflow-hidden">
                                        <div className="w-full h-full flex flex-col items-center justify-center p-3 gap-2">
                                            <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={account.avatar_url}
                                                    alt={account.username}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <SiTiktok className="size-3 flex-shrink-0" />
                                                <p className="text-xs text-center truncate max-w-[100px]">{account.username}</p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                                <Card
                                    onClick={handleAddNewTiktokAccount}
                                    className="h-[140px] w-[140px] border-2 border-gray-400 border-dashed hover:border-gray-900 group transition-all duration-300 ease-in-out cursor-pointer">
                                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                                        <div className="relative">
                                            <SiTiktok className="size-10 group-hover:scale-110 transition-all duration-300 ease-in-out" />
                                            <Plus className="size-5 absolute -top-1 -right-1 bg-white rounded-full group-hover:scale-110 transition-all duration-300 ease-in-out" />
                                        </div>
                                        <p className="text-xs text-gray-600">Add Account</p>
                                    </div>
                                </Card>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}