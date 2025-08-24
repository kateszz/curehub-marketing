'use client'
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";
import DnaIllustration from "./dnaIllustration";
gsap.registerPlugin(ScrollTrigger);

export default function BgAnimated() {
    const scrollRef = useRef();
    useGSAP (() => {
        const blob = scrollRef.current;
        const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;
        const blobTimeline = gsap.timeline({});
        blobTimeline.from(blob,{ scale: 1 });
        blobTimeline.to (blob,{
            scale: 2,
            scrollTrigger: {
                trigger: '#whatOne',
                start: 'top 80%',
                end: 'top top',
                scrub: 1.5,
                markers: false
            }
        });

        blobTimeline.fromTo (blob,{scale: 2},{
            scale: isMobile ? 3 : 8,
            scrollTrigger: {
                trigger: '#how',
                start: 'top 80%',
                end: 'top top',
                scrub: 1.5,
                markers: false
            }
        });

        blobTimeline.fromTo (blob,{scale: 8},{
            scale: 3,
            scrollTrigger: {
                preventOverlaps: true,
                trigger: '#benefits',
                start: 'top 80%',
                end: 'top top',
                scrub: 1.5,
                markers: false
            }
        });

        blobTimeline.fromTo (blob,{scale: 3},{
            scale: 1,
            scrollTrigger: {
                preventOverlaps: true,
                trigger: '#cta',
                start: 'top 80%',
                end: 'top top',
                scrub: 1,
                markers: false
            }
        });

    },[]);
    return (
        
           
        <div className="bg-(image:--blue-gradient) z-[-2] fixed pointer-events-none w-[100vw] h-[100vh] flex flex-row justify-center items-center">
             
          <div id="darkblob" ref={scrollRef} className="bg-dark w-[30vmax] h-[30vmax] my-auto blur-3xl rounded-[50%] will-change-transform pointer-events-none max-sm:blur-2xl max-sm:w-[45vh] max-sm:h-[40vh] max-sm:rounded-[50%]"></div>
        </div>
      
    );

}