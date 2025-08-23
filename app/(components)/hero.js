'use client'
import Image from "next/image";
import EmailSubscriptionForm from "./emailSubscription";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";
gsap.registerPlugin(ScrollTrigger);


export default function Hero () {
    const heroRef = useRef();
    useGSAP(() => {
        const hero = heroRef.current;
        const heroElems = gsap.utils.toArray(heroRef.current.children);
        const heroTimeline = gsap.timeline({});

        heroElems.forEach((heroElem) => {
            gsap.fromTo(heroElem,{y: 3, opacity: 0, scale: 0.5},{y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power1.inOut'});
        });

        heroTimeline.fromTo(heroElems,{opacity: 1, blur: 0, scale: 1},{
            opacity: 0,
            blur: 100,
            scale: 0.1,
            delay: 1,
            scrollTrigger: {
                trigger: '#whatOne',
                start: 'top bottom',
                end: 'top top',
                pin: '#hero',
                pinSpacing: false,
                markers: false,
                scrub: 1
            }
        });

    },[]);
    return (
        <section ref={heroRef} id="hero" className=" realtive h-[100vh] flex flex-col justify-center items-center gap-10 max-sm:gap-12 px-4">
            <div className="absolute top-[-90] md:right-[-100] right-[-120] lg:right-[-50]">
                <Image src="supplement.svg" alt="Illustration of a supplement pill" width="76" height="200" className="w-50 h-auto lg:w-80 md:w-70"></Image>
            </div>
            <div className="absolute bottom-[-100] left-[-200] md:left-[-60] lg:left-[-50]">
                <Image src="molecules.svg" alt="Illustration of molecules" width="76" height="200" className="w-80 h-auto"></Image>
            </div>
           <span><p className="bg-linear-(--snow-gradient) bg-clip-text opacity-70 text-center"><b>Coming to you in Q4 of 2025</b></p>
            <h1 className="text-center w-[70vw] lg:max-w-[50vw]">Your genetic blueprint holds
the key to feeling your best 
— every day.</h1></span>
        <div className="heroform-wrapper flex flex-row gap-8 items-center max-md:flex-col">
        
        <EmailSubscriptionForm></EmailSubscriptionForm>
       
        </div>
        <h6 className="max-w-[30ch] text-center">Use your genetic data to get a personalised supplement and lifestyle plan, tailored to the microgram.</h6>
        </section>
    );
}