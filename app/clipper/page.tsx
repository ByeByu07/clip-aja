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
import { FlipWords } from "@/components/ui/flip-words";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import { Pointer } from "@/components/ui/pointer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CallToAction1 from "@/components/ui/call-to-action-1";
import { Marquee } from "@/components/ui/marquee";
import { Android } from "@/components/ui/shadcn-io/android";

const reviews = [
  {
    name: "Dika Pratama",
    username: "@dikacreate",
    body: "Enak banget jadi clipper di sini. Tinggal pilih sayembara, bikin video, views naik → komisi langsung cair. Simple dan jelas.",
    img: "https://avatar.vercel.sh/dika",
  },
  {
    name: "Stephanie Ong",
    username: "@steph.ong",
    body: "Sebagai content creator, platform ini ngebantu banget. Saya bisa dapet job rutin tanpa harus cari-cari client sendiri.",
    img: "https://avatar.vercel.sh/steph",
  },
  {
    name: "Bayu Kurniawan",
    username: "@bayuclip",
    body: "Saya suka karena sistemnya transparan. Dibayar per 1000 views bikin saya termotivasi bikin konten yang lebih kreatif.",
    img: "https://avatar.vercel.sh/bayu",
  },
  {
    name: "Angela Lim",
    username: "@angelalim",
    body: "Awalnya coba-coba, ternyata gampang banget. Upload video untuk brand F&B, views tembus puluhan ribu dan komisi langsung masuk.",
    img: "https://avatar.vercel.sh/angela",
  },
  {
    name: "Yusuf Rahman",
    username: "@yusufrahman",
    body: "Buat mahasiswa kayak saya, ini pas banget. Bisa dapet tambahan cuan dari bikin konten singkat yang saya suka kerjain.",
    img: "https://avatar.vercel.sh/yusuf",
  },
  {
    name: "Natalie Chandra",
    username: "@natalie.c",
    body: "Suka banget karena bisa bebas pilih project. Kadang BTS, kadang soft-selling, tergantung mood. Komisi selalu aman.",
    img: "https://avatar.vercel.sh/natalie",
  },
  {
    name: "Rizky Setiawan",
    username: "@rizkyset",
    body: "Daripada konten saya nganggur di HP, mending upload ke sayembara. Lumayan, sekali viral komisi langsung nambah drastis.",
    img: "https://avatar.vercel.sh/rizky",
  },
  {
    name: "Clara Wijaya",
    username: "@claraw",
    body: "Kerja santai tapi hasil nyata. Saya suka karena brand-brand yang masuk juga variatif, jadi nggak bosan bikin konten.",
    img: "https://avatar.vercel.sh/clara",
  },
  {
    name: "Fajar Hidayat",
    username: "@fajarcuts",
    body: "Komisi sesuai effort. Kalau video saya bagus dan banyak yang nonton, cuan juga makin gede. Fair banget sistemnya.",
    img: "https://avatar.vercel.sh/fajar",
  },
  {
    name: "Maya Susilo",
    username: "@maya.susilo",
    body: "Sebagai clipper baru, saya merasa dihargai. Nggak perlu follower besar, yang penting views jalan, komisi masuk.",
    img: "https://avatar.vercel.sh/maya",
  },
]

// const androidSrc = "https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
const clipperHeroImageSrc = ["/images/clipper-hero/1.jpg", "/images/clipper-hero/2.webp","/images/clipper-hero/3.png","/images/clipper-hero/4.png"]

const ClipperMockCard = ({ src }: { src: string }) => {
  return (
    <Android src={src} />
  )
}

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)
const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  )
}

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

  const captionWords = ["Cuan", "Joss", "Max", "Gokil", "Super"]

  return (
    <>
      <Pointer>
        <motion.div
          animate={{
            scale: [0.8, 1, 0.8],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-pink-600"
          >
            <motion.path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="currentColor"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </svg>
        </motion.div>
      </Pointer>
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
      <div className="relative h-[80vh] w-full overflow-hidden flex flex-col items-center justify-center">
        {/* <DotPattern
          className={cn(
            "[mask-image:radial-gradient(800px_circle_at_center,black,transparent)] -z-10"
          )}
        /> */}
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
          className="text-7xl uppercase text-[Rubik] tracking-wider font-bold"
        >
          <FlipWords words={captionWords} duration={1000} className="font-bold tracking-widest" /> komisi
        </motion.p>
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
          className="w-full relative overflow-hidden flex flex-col items-center justify-center"
        >
          <p className="text-9xl uppercase text-[Rubik] tracking-wider font-bold text-[#fb8500]">Clip Aja</p>
          {/* <VideoText fontSize={20} src="https://cdn.magicui.design/ocean-small.webm">Viral Saiki</VideoText> */}
        </motion.div>
        {/* <motion.h1
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
        >- Selalu viral -</motion.h1> */}
      </div>

      <section className=" flex flex-col justify-center items-center my-16 gap-5 relative overflow-hidden">
        <h2 className=" text-5xl uppercase text-[Bebas_Nue] font-medium z-99">Bantu <span className="text-[#fb8500]">Distribusi</span></h2>
        <h3 className="text-2xl text-center text-[Bebas_Nue]">gabung lebih dari 1000+ clipper mendistribusikan brand</h3>
        {/* <BeamComponent className="w-full h-fit" /> */}
        <Marquee repeat={5} reverse className="[--duration:20s]">
          {clipperHeroImageSrc.map((src) => (
            <ClipperMockCard key={src} src={src} />
          ))}
        </Marquee>

      </section>

      <section className="relative overflow-hidden flex flex-col justify-center items-center gap-10 my-20">
        {/* <TweetCard id="1869441984940986833" /> */}
        <h2 className="text-5xl uppercase text-[Bebas_Nue] font-medium">Apa <span className="text-[#fb8500]">Kata Mereka</span></h2>
        <Marquee className="[--duration:20s]">
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee reverse className="[--duration:20s]">
          {secondRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
        <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
      </section>

      <section className="flex flex-col justify-center items-center my-20">
        <CallToAction1 title="Dapatkan Komisi" description="Gabung 1316+ clipper untuk mendapatkan komisi" buttonLabel="Mulai Sekarang" buttonLink="/signin" />
      </section>

      



      <Footer2 />
    </>
  );
}
