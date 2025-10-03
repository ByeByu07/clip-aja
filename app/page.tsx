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
    name: "Budi Santoso",
    username: "@budionline",
    body: "Awalnya saya mikir susah buat naikin awareness brand, tapi dengan platform ini semua jadi lebih gampang. View naik, biaya tetap terjangkau.",
    img: "https://avatar.vercel.sh/budi",
  },
  {
    name: "Michelle Tan",
    username: "@michelle_tan",
    body: "Sebagai pemilik brand fashion, saya butuh exposure cepat. Tim clipper dan soft awareness di sini benar-benar bantu brand saya dikenal lebih luas.",
    img: "https://avatar.vercel.sh/michelle",
  },
  {
    name: "Hendra Wijaya",
    username: "@hendra_w",
    body: "Yang bikin beda, sistem bayar per 1000 views sangat transparan. Saya bisa ukur ROI iklan dengan jelas tanpa takut boncos.",
    img: "https://avatar.vercel.sh/hendra",
  },
  {
    name: "Cindy Pranata",
    username: "@cindyy",
    body: "Saya butuh cara cepat supaya brand kuliner saya viral. Dengan clipper di sini, konten saya langsung tersebar di TikTok & IG. Hasilnya nyata.",
    img: "https://avatar.vercel.sh/cindy",
  },
  {
    name: "Andi Gunawan",
    username: "@andibiz",
    body: "Solusi ini cocok banget buat UMKM digital. Nggak ribet, timnya udah ngerti cara bikin awareness yang efektif.",
    img: "https://avatar.vercel.sh/andi",
  },
  {
    name: "Felicia Lim",
    username: "@felicialim",
    body: "Sangat puas! Brand saya dapat exposure cepat tanpa harus keluar budget besar. Clipper-nya kreatif dan hasilnya organik banget.",
    img: "https://avatar.vercel.sh/felicia",
  },
  // tambahan 10 review baru
  {
    name: "Ricky Halim",
    username: "@rickyhalim",
    body: "Saya minta konten BTS produksi kopi shop saya, hasilnya natural banget dan bikin orang penasaran datang langsung. Kreatif & engaging!",
    img: "https://avatar.vercel.sh/ricky",
  },
  {
    name: "Putri Amalia",
    username: "@putriamalia",
    body: "Saya punya bisnis skincare. Cuma bikin sayembara, lalu banyak clipper buat konten review jujur. Hasilnya lebih dipercaya audiens.",
    img: "https://avatar.vercel.sh/putri",
  },
  {
    name: "Kevin Prasetyo",
    username: "@kevinp",
    body: "Saya minta video behind-the-scenes launching mobil bekas di dealer saya. Hasilnya keren, bikin trust meningkat dan stok cepat laku.",
    img: "https://avatar.vercel.sh/kevin",
  },
  {
    name: "Siska Gunarti",
    username: "@sisg",
    body: "Nggak nyangka, bahkan bisnis catering rumahan bisa ikut. Clipper bikin video simple, views banyak, langsung ada pesanan baru.",
    img: "https://avatar.vercel.sh/siska",
  },
  {
    name: "Adrian Kusuma",
    username: "@adrikusuma",
    body: "Saya butuh video soft-selling buat kursus online. Dengan sistem sayembara, banyak ide fresh masuk. Hasilnya beda dari ads biasa.",
    img: "https://avatar.vercel.sh/adrian",
  },
  {
    name: "Lina Hartono",
    username: "@linahartono",
    body: "Mau bikin awareness butik kecil saya? Tinggal bikin sayembara. Clipper kasih konten reels kece yang bikin followers naik drastis.",
    img: "https://avatar.vercel.sh/lina",
  },
  {
    name: "Davin Ong",
    username: "@davinong",
    body: "Saya coba untuk event musik kecil-kecilan. Clipper rekam konten behind-the-scenes, view ribuan, orang jadi tau acara kami.",
    img: "https://avatar.vercel.sh/davin",
  },
  {
    name: "Rani Kurnia",
    username: "@ranik",
    body: "Saya minta testimoni user untuk aplikasi belajar bahasa. Clipper bantu bikin konten UGC yang authentic, hasilnya lebih meyakinkan.",
    img: "https://avatar.vercel.sh/rani",
  },
  {
    name: "Thomas Lie",
    username: "@thomaslie",
    body: "Yang saya suka, fleksibel banget. Mau request konten edukasi, soft awareness, sampai behind-the-scenes, semua bisa lewat sayembara.",
    img: "https://avatar.vercel.sh/thomas",
  },
  {
    name: "Melati Susanto",
    username: "@melatis",
    body: "Awareness brand florist saya naik pesat setelah clipper bikin video aesthetic di TikTok. Harga terjangkau, hasil memuaskan.",
    img: "https://avatar.vercel.sh/melati",
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

  const captionWords = ["Distribusi", "Viralin", "Gemain", "Bangun", "Bangkitin"]

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
          <FlipWords words={captionWords} duration={1000} className="font-bold tracking-widest" /> brandmu
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
        <h2 className=" text-5xl uppercase text-[Bebas_Nue] font-medium z-99">Distribusi <span className="text-[#fb8500]">Mudah</span></h2>
        <h3 className="text-2xl text-center text-[Bebas_Nue]">lebih dari 1000+ clipper mendistribusikan brandmu</h3>
        {/* <BeamComponent className="w-full h-fit" /> */}
        <Marquee repeat={5} reverse className="[--duration:10s]">
          {clipperHeroImageSrc.map((src, index) => (
            <ClipperMockCard key={index} src={src} />
          ))}
        </Marquee>

      </section>

      <section className="flex flex-col justify-center items-center gap-10">
        <h2 className="text-5xl uppercase text-[Bebas_Nue] font-medium">Awareness <span className="text-[#fb8500]">Meningkat</span></h2>
        <div className="flex gap-10">
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
            className="flex flex-col items-center gap-5"
          >
            <Image src="/images/result-main-page/1.jpg" className="w-80 rounded-lg" alt="hero" width={1000} height={1000} />
            {/* <NumberTicker className="text-3xl" value={1000000} delay={2} /> */}
          </motion.div>
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
            className="flex flex-col items-center gap-5"
          >
            <Image src="/images/result-main-page/2.jpeg" className="w-80 rounded-lg" alt="hero" width={1000} height={1000} />
            {/* <NumberTicker className="text-3xl" value={4426900} delay={2} /> */}
          </motion.div>
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: [20, -5, 0],
            }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              // repeat: Infinity,
              duration: 1,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className="flex flex-col items-center gap-5"
          >
            <Image src="/images/result-main-page/3.jpg" className="w-80 rounded-lg" alt="hero" width={1000} height={1000} />
            {/* <NumberTicker className="text-3xl" value={10000000} delay={2} /> */}
          </motion.div>
        </div>
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
        <CallToAction1 title="Buka Awarenessmu" description="Gabung 20+ Pemilik Brand untuk membangun brandmu" buttonLabel="Mulai Sekarang" buttonLink="/signin" />
      </section>

      <Footer2 />
    </>
  );
}
