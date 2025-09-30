"use client"

import { Navbar03 } from "@/components/ui/shadcn-io/navbar-03";
import { Footer2 } from "@/components/footer2";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ContestDetails } from "@/components/contest-details";

export default function ContestDetail() {

    const params = useParams<{ id: string }>()
    const [contest, setContest] = useState<any>(null);

    const fetchContest = async () => {
        const response = await fetch(`/api/contests/${params.id}`);
        const data = await response.json();
        setContest(data.data);
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
                {contest && (
                    <ContestDetails contest={contest} />
                )}
                <Footer2 />
            </div>
        </>
    );
}
