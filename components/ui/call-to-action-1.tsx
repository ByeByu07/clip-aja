import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CallToAction1Props {
    title: string;
    description: string;
    buttonLabel: string;
    buttonLink: string;
}

export default function CallToAction1({
    title,
    description,
    buttonLabel,
    buttonLink
}: CallToAction1Props) {

    const router = useRouter();

    const handleButtonClick = () => {
        router.push(buttonLink);
    };

    return (
        <>
            <div className="max-w-5xl my-10 md:w-full mx-2 md:mx-auto flex flex-col items-center justify-center text-center rounded-none px-10 text-black text-[Rubik] font-medium">
                <div className="flex flex-wrap items-center justify-center p-1 rounded-full bg-[#fb8500]/90 backdrop-blur border border-[#fb8500]/40 text-sm">
                    <div className="flex items-center">
                        <Image className="size-6 md:size-7 rounded-full border-3 border-white"
                            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50" alt="userImage1" width={50} height={50} />
                        <Image className="size-6 md:size-7 rounded-full border-3 border-white -translate-x-2"
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50" alt="userImage2" width={50} height={50} />
                        <Image className="size-6 md:size-7 rounded-full border-3 border-white -translate-x-4"
                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop"
                            alt="userImage3" width={50} height={50} />
                    </div>
                    <p className="-translate-x-2 font-medium">{description}</p>
                </div>
                <h1 className="text-4xl md:text-5xl md:leading-[60px] font-bold uppercase max-w-xl mt-5 text-[#fb8500] ">{title}</h1>
                <button className="px-8 py-3 text-black rounded-none bg-[#fb8500] hover:bg-[#fb8500]/80 transition-all duration-500 ease-in-out uppercase text-sm mt-8 font-medium"
                    onClick={handleButtonClick}>
                    {buttonLabel}
                </button>
            </div>
        </> 
    );
};