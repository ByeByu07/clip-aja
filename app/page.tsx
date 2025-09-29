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

export default function Home() {

  const t = useTranslations("HomePage");
  const router = useRouter();

  const handleSignInClick = () => {
    console.log("Sign In clicked");
    router.push("/signin");
  };

  const handleCtaClick = () => {
    console.log("Get Started clicked");
    router.push("/signin");
  };

  return (
    <>
      <Navbar03
        signInText="Sign In"
        signInHref="/signin"
        ctaText="Get Started"
        ctaHref="/signin"
        onSignInClick={handleSignInClick}
        onCtaClick={handleCtaClick}
      />
      {/* <HeroHighlight>
        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
        >
          With insomnia, nothing&apos;s real. Everything is far away. Everything
          is a{" "}
          <Highlight className="text-black dark:text-white">
            copy, of a copy, of a copy.
          </Highlight>
        </motion.h1>
      </HeroHighlight> */}
      <div className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center px-20 gap-2">
        <DotPattern
          className={cn(
            "[mask-image:radial-gradient(800px_circle_at_center,black,transparent)] -z-10"
          )}
        />
        <motion.p
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 1,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="text-3xl uppercase"
        >Distribusi kontenmu 121x lebih cepat</motion.p>
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 1,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="h-[220px] w-full relative overflow-hidden flex flex-col items-center justify-center"
        >
          <VideoText fontSize={20} src="https://cdn.magicui.design/ocean-small.webm">Viral Saiki</VideoText>
        </motion.div>
        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 1,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto uppercase"
        >- Selalu viral -</motion.h1>
      </div>

      <BeamComponent />

      <section className="flex justify-center items-center gap-10">
        <div className="flex flex-col items-center gap-5">
          <Image src="/images/web/dummy.png" className="w-70" alt="hero" width={1000} height={1000} />
          <NumberTicker className="text-3xl" value={1000000} delay={2} />
        </div>
        <div className="flex flex-col items-center gap-5">
          <Image src="/images/web/dummy.png" className="w-50" alt="hero" width={1000} height={1000} />
          <NumberTicker className="text-3xl" value={4426900} delay={2} />
        </div>
        <div className="flex flex-col items-center gap-5">
          <Image src="/images/web/dummy.png" className="w-80" alt="hero" width={1000} height={1000} />
          <NumberTicker className="text-3xl" value={10000000} delay={2} />
        </div>
      </section>

      <section>
        {/* <TweetCard id="1869441984940986833" /> */}
      </section>



      <Footer2 />
    </>
  );
}
