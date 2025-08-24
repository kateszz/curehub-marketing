'use client'
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";
import { CustomEase } from "gsap/all";
import Image from "next/image";
gsap.registerPlugin(CustomEase);
gsap.registerPlugin(ScrollTrigger);
export default function BenefitsSection () {

    return (
        <section id="benefits" className="h-[100vh] flex flex-col justify-center items-center mx-8 gap-4 max-md:gap-10 relative">
         
            <h3 className="max-w-[30ch]">Your body and mind thanks you generously, when you let your genetic blueprint build your health regime.</h3>
            <div className="ml-[30vw] flex flex-col relative max-md:gap-4">
            <div className="absolute left-[-70%] bottom-[-10%] max-sm:left-[-60%] max-md:left-[-75%]">
                <Image src="/benefits-pics.png" alt="People living a helathy and active life in pictures" width="2296" height="2817" className="w-50 h-auto max-sm:w-35"></Image> 
            </div>
                <span className="flex flex-row gap-2 justify-start items-center"><h1>+</h1><h6> More energy & sharper focus</h6></span>
                <span className="flex flex-row gap-2 justify-start items-center"><h1>+</h1><h6> Reduced fatigue & stable mood</h6></span>
                <span className="flex flex-row gap-2 justify-start items-center"><h1>+</h1><h6> Lower stress hormones & improved mobility</h6></span>
            </div>
        </section>
    );

}