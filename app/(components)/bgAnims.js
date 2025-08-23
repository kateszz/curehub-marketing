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
        const blobTimeline = gsap.timeline({});
        blobTimeline.from(blob,{scale:1});
        blobTimeline.to (blob,{
            scale: 2.5,
            duation: 3,
            scrollTrigger: {
                trigger: '#whatOne',
                start: 'top, 80%',
                end: 'top top',
                scrub: 1.5,
                markers: false
            }
        });

        blobTimeline.fromTo (blob,{scale: 2.5},{
            scale: 10,
            duation: 3,
            scrollTrigger: {
                trigger: '#how',
                start: 'top, 80%',
                end: 'top top',
                scrub: 1.5,
                markers: false
            }
        });

        blobTimeline.fromTo (blob,{scale: 10},{
            scale: 3,
            duation: 3,
            scrollTrigger: {
                preventOverlaps: true,
                trigger: '#benefits',
                start: 'top, 80%',
                end: 'top top',
                scrub: 1.5,
                markers: false
            }
        });

        blobTimeline.fromTo (blob,{scale: 3},{
            scale: 1,
            duation: 3,
            scrollTrigger: {
                preventOverlaps: true,
                trigger: '#cta',
                start: 'top, 80%',
                end: 'top top',
                scrub: 1,
                markers: false
            }
        });

    },[]);
    return (
        
           
        <div className="bg-(image:--blue-gradient) z-[-1] fixed pointer-events-none w-[100vw] h-[100vh] flex flex-row justify-center align-middle">
             
          <div id="darkblob" ref={scrollRef} className="bg-dark w-[30vh] h-[30vh] my-auto blur-3xl rounded-[50%] will-change-transform pointer-events-none"></div>
        </div>
      
    );

}