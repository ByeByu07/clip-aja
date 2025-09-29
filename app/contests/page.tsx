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

export default function Home() {

    const t = useTranslations("HomePage");
    const router = useRouter();

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
                    {Array.from({ length: 20 }).map((_, index) => (
                        <Card key={index} className="rounded-none">
                            <CardContent className="flex justify-between">
                                <div className="flex flex-col gap-5 w-full px-10">
                                    <Badge className="text-xs">Clip</Badge>
                                    <Link href={`/contests/${index}`} className="text-xl font-bold underline flex items-center gap-2">Create a clip from our podcast Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minus, praesentium? <ArrowRight /></Link>
                                    <div className="flex items-center gap-2 justify-start">
                                        <p className="text-2xl font-thin basis-1/2">Rp. 1000 / 1000 views</p>
                                        {/* <div className="flex items-center gap-2 basis-1/2">
                                            <p>50%</p>
                                            <Progress value={50 / index} />
                                        </div>
                                        <p className="flex items-center gap-2 basis-1/2"><Calendar /> 2025-09-30</p> */}
                                    </div>
                                </div>
                                {/* <div className="flex gap-2 flex-col items-center">
                                    <p className="">Rp. 1000 / 1000 views</p>
                                    <div className="flex items-center gap-2 w-full">
                                        <p>50%</p>
                                        <Progress value={50 / index} />
                                    </div>
                                    <p>Deadline: 2025-09-30</p>
                                    <Button className="w-40">Join</Button>
                                </div> */}
                            </CardContent>
                        </Card>
                    ))}
                </section>

                <Footer2 />
            </div>
        </>
    );
}
