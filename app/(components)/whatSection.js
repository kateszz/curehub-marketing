'use client'
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";
import { CustomEase } from "gsap/all";
import Image from "next/image";
gsap.registerPlugin(CustomEase);
gsap.registerPlugin(ScrollTrigger);

export default function WhatSection() {
    const firstRef = useRef();
    const secondRef = useRef();
    const thirdRef = useRef();
    useGSAP(() => {
      const whatTimeline = gsap.timeline({});
      const firstDiv = firstRef.current;
      const secondDiv = secondRef.current;
      const thirdDiv = thirdRef.current;

    whatTimeline.fromTo(firstDiv,{x:0, filter:'blur(0px)'},{
        x: '-100vw',
        filter: 'blur(40px)',
        ease: CustomEase.create("custom", "M0,0 C0.349,0.045 0.55,-0.009 0.748,0.062 0.844,0.097 0.818,1.001 1,1 "),
        scrollTrigger: {
          trigger: '#whatTwo',
          start: 'top bottom',
          end: 'top top',
          pin: '#whatOne',
          pinSpacing: false,
          markers: false,
          scrub: 1
      }
      });

      whatTimeline.fromTo(secondDiv,{x:0, filter:'blur(0px)'},{
        x: '-100vw',
        filter: 'blur(40px)',
        ease: CustomEase.create("custom", "M0,0 C0.349,0.045 0.55,-0.009 0.748,0.062 0.844,0.097 0.818,1.001 1,1 "),
        scrollTrigger: {
          trigger: '#whatThree',
          start: 'top bottom',
          end: 'top top',
          pin: '#whatTwo',
          pinSpacing: false,
          markers: false,
          scrub: 1
      }
      });
      
      whatTimeline.fromTo(thirdDiv,{x:0, filter:'blur(0px)'},{
        x: '-100vw',
        filter: 'blur(40px)',
        ease: CustomEase.create("custom", "M0,0 C0.349,0.045 0.55,-0.009 0.748,0.062 0.844,0.097 0.818,1.001 1,1 "),
        scrollTrigger: {
          trigger: '#how',
          start: 'top bottom',
          end: 'top top',
          pin: '#whatThree',
          pinSpacing: false,
          markers: false,
          scrub: 1
      }
      });

      whatTimeline.fromTo(firstDiv,{opacity: 1},{opacity: 0,
      scrollTrigger: {
        trigger: '#how',
        start: 'top 20%',
        end: 'top top',
        scrub: true,
      }
      });
      whatTimeline.fromTo(secondDiv,{opacity: 1},{opacity: 0,
        scrollTrigger: {
          trigger: '#how',
          start: 'top 20%',
          end: 'top top',
          scrub: true,
        }
        });
        whatTimeline.fromTo(thirdDiv,{opacity: 1},{opacity: 0,
          scrollTrigger: {
            trigger: '#how',
            start: 'top 20%',
            end: 'top top',
            scrub: true,
          }
          });


    },[]);

    return (
      <section id="what" className="flex flex-col gap-0">
        <div ref={firstRef} id="whatOne" className="h-[100vh] w-full flex flex-col justify-center items-center gap-4"><span className="flex flex-col justify-center gap-4"><h3 className="max-w-[20ch] ">No need for guessing.<br></br>The key to 10 more healthy years is in your DNA.</h3> <h5 className="max-w-[20ch]">We don&apos;t do vague reports or copy-paste plans based on a survey.</h5></span></div>
        <div ref={secondRef} id="whatTwo" className="h-[100vh] flex flex-row justify-center items-center gap-4"><h3 className="max-w-[20ch]">We analyse your genetic data to build your optimal supplement plan.</h3></div>
        <div ref={thirdRef} id="whatThree" className="h-[100vh] flex flex-col gap-12 justify-center items-center">
          <span className="flex flex-col justify-start gap-8 max-w-[60ch] max-sm:max-w-[80%]">
            <span className="flex flex-col gap-2">
            <h3 className="inline-flex items-center gap-4"><Image src="/personalised.png" alt="Personalisation Icon" width="100" height="100" className="w-10"></Image>100% You</h3>
            <h6>Based on your unique SNPs and methylation profile.</h6>
          </span>
          <span className="flex flex-col gap-2">
            <h3 className="inline-flex items-center gap-4"><Image src="/science.png" alt="Personalisation Icon" width="100" height="100" className="w-10"></Image>Science You Can Trust</h3>
            <h6>Every dosage backed by peer-reviewed studies.</h6>
          </span>
          <span className="flex flex-col gap-2">
            <h3 className="inline-flex items-center gap-4"><Image src="/secure.png" alt="Personalisation Icon" width="100" height="100" className="w-10"></Image>Highly Secure</h3>
            <h6>We take privacy seriously by following HIPAA and GDPR compliancy.</h6>
          </span>
          </span>
        </div>
      </section>
    );
  }