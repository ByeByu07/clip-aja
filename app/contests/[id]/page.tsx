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
import React from "react";
import { useParams } from "next/navigation";

export default function ContestDetail() {

    const params = useParams<{ id: string }>()
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
                <p>Contest Detail : {params.id}</p>
                <Footer2 />
            </div>
        </>
    );
}
