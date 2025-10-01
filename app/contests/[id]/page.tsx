"use client"

import { Navbar03 } from "@/components/ui/shadcn-io/navbar-03";
import { Footer2 } from "@/components/footer2";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ContestDetailsMainPage } from "@/components/contest-details-main-page";
import { Loader2 } from "lucide-react";

export default function ContestDetail() {

    const params = useParams<{ id: string }>()
    const [contest, setContest] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchContest = async () => {
        const response = await fetch(`/api/contests/${params.id}`);
        const data = await response.json();
        setContest(data.data[0]);
        setLoading(false);
    };

    useEffect(() => {
        fetchContest();
    }, []);

    return (
        <>
            <Navbar03
                signInText="Sign In"
                signInHref="/signin"
                ctaText="Get Started"
                ctaHref="/signin"
            />
            <div className="flex flex-col gap-5 px-10 mt-10">
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : contest && (
                    <ContestDetailsMainPage contest={contest} />
                )}
                <Footer2 />
            </div>
        </>
    );
}
