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

export default function Home() {

    const [contests, setContests] = useState<any>(null);

    const fetchContests = async () => {
        const response = await fetch('/api/contests');
        const data = await response.json();
        setContests(data.data);
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
                    {contests && contests.length > 0 ? contests.map((c: any) => (
                        <Card key={c.id} className="rounded-none hover:-translate-y-1 transition-all duration-500 ease-in-out">
                            <CardContent className="flex justify-between">
                                <div className="flex flex-col gap-5 w-full px-10">
                                    <Badge className="text-xs">Clip</Badge>
                                    <Link href={`/contests/${c.id}`} className="text-xl font-bold underline flex items-center gap-2">Create a clip from our podcast Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minus, praesentium? <ArrowRight /></Link>
                                    <div className="flex items-center gap-2 justify-start">
                                        <p className="text-2xl font-thin basis-1/2">Rp. {c.payPerView} / 1000 views</p>
                                        <div className="flex items-center gap-2 basis-1/2">
                                            <p>{c.currentPayout}%</p>
                                            <Progress value={c.currentPayout} />
                                        </div>
                                        <p className="flex items-center gap-2 basis-1/2"><Calendar /> {c.submissionDeadline}</p>
                                    </div>
                                </div>
                                {/* <div className="flex gap-2 flex-col items-center">
                                    <p className="">Rp. {c.payPerView} / 1000 views</p>
                                    <div className="flex items-center gap-2 w-full">
                                        <p>{c.currentPayout}%</p>
                                        <Progress value={c.currentPayout} />
                                    </div>
                                    <p>Deadline: {c.submissionDeadline}</p>
                                    <Button className="w-40">Join</Button>
                                </div> */}
                            </CardContent>
                        </Card>
                    )) : (
                        <p className="text-center">Tidak ada sayembara</p>
                    )}
                </section>

                <Footer2 />
            </div>
        </>
    );
}
