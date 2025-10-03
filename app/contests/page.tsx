"use client"

import Image from "next/image";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { Navbar03 } from "@/components/ui/shadcn-io/navbar-03";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { motion } from "motion/react";
import { Footer2 } from "@/components/footer2";
import { BeamComponent } from "@/components/beam-component";
import { NumberTicker } from "@/components/ui/number-ticker";
import { TweetCard } from "@/components/ui/tweet-card";
import { VideoText } from "@/components/ui/video-text";
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/ui/dot-pattern";
import { WavyBackground } from "@/components/ui/wavy-background";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { ContestListMainPage } from "@/components/contest-list-main-page";
import { Loader2 } from "lucide-react";

export default function Home() {

    const [contests, setContests] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchContests = async () => {
        setLoading(true);
        const response = await fetch('/api/contests?status=active');
        const data = await response.json();
        setContests(data.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchContests();
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
                <section className="flex flex-col gap-5">
                    {/* <h1 className="text-5xl text-center font-bold my-10">Cari Sayemmmbaraaamu</h1> */}
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    ) : contests ? <ContestListMainPage contests={contests} />
                        : (
                            <p className="text-center">Tidak ada sayembara</p>
                        )}
                </section>
                <Footer2 />
            </div>
        </>
    );
}