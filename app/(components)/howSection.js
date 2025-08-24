'use client'
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useRef } from "react";
import { CustomEase } from "gsap/all";
import Image from "next/image";
gsap.registerPlugin(CustomEase);
gsap.registerPlugin(ScrollTrigger);

export default function HowSection() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const container = containerRef.current;
    const section = container.querySelector('#how');
    const howTwoTexts = container.querySelectorAll('#howTwo h5');
    const howFour = container.querySelector<HTMLElement>('#howFour');
    // Calculate total width needed (4 slides * 100vw each)
    const totalWidth = 4 * window.innerWidth;
    
    // Set the section width to accommodate all slides
    gsap.set(section, { width: totalWidth });

    // Create the horizontal scroll animation
    gsap.to(section, {
      x: () => -(totalWidth - window.innerWidth), // Move left by total width minus viewport
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${3 * window.innerHeight}`, // 3 screen heights to scroll through 4 slides
        pin: true,
        pinSpacing: false,
        preventOverlaps: true,
        scrub: 1,
        markers: false // Remove this when you're happy with the animation
      }
    });

    const hScroll = gsap.getTweensOf(section).find(
      (t) => t.vars?.scrollTrigger && t.vars.scrollTrigger.trigger === container
    );
    const seqImgs = gsap.utils.toArray<HTMLElement>('.seqImg');
    if (seqImgs.length && hScroll && howFour) {
      // Start off-screen RIGHT, invisible
      gsap.set(seqImgs, {
        x: () => window.innerWidth * 0.8,
        opacity: 0,
        willChange: "transform, opacity",
        force3D: true,
      });
    
      const seqTL = gsap.timeline({
        scrollTrigger: {
          trigger: howFour,
          containerAnimation: hScroll,   // sync to horizontal scroll
          start: "left 70%",             // when #howFour is ~30% inside
          end: "right left",             // until #howFour fully exits
          scrub: true,
          invalidateOnRefresh: true,
          markers: false,
        }
      });
    
      // Slide in → hold → slide out
      seqTL
        .to(seqImgs, {
          x: 0,
          visibility: "visible",
          opacity: 1,
          ease: "power2.out",
          duration: 0.5,
        })
        .to(seqImgs, {
          x: () => -window.innerWidth * 0.8,
          opacity: 0,
          ease: "power2.in",
          duration: 0.5,
        });
    }

    if (hScroll) {
      

      gsap.timeline({
        scrollTrigger: {
          trigger: "#howTwo",
          containerAnimation: hScroll,   // ⬅️ key: tie to the horizontal tween
          start: "left 20%",          // when #howTwo's left hits center of viewport
          once: true,                   // keep your one-shot behavior
          invalidateOnRefresh: true,
          markers: false
        }
      })
      .to(howTwoTexts, {
        scale: 1.2,
        duration: 0.5,
        stagger: 1,
        ease: "back.out(1.7)"
      })
      
    }
  

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div>
    <div ref={containerRef} className="overflow-hidden">
   
      <section id="how" className="flex flex-row gap-0 h-[100vh] w-fit overflow-clip">
        <div id="howOne" className="w-[100vw] mx-8 flex flex-col justify-center items-center">
          <h3 className="max-w-[25ch] max-sm:max-w-[15ch]">This is how we go from your DNA to an actionable supplement plan.</h3>
        </div>
        <div id="howTwo" className="w-[100vw] flex flex-col justify-center items-center">
          <span className="max-w-[80vw] flex flex-col justify-start gap-4 max-sm:max-w-[25ch]">
            <h5>01</h5> <h6>You share your DNA report, we get your genotype.</h6>
            <h5>02</h5> <h6>Our engine decodes key SNPs and methylation pathways.</h6>
            <h5>03 </h5><h6>You get a personalised supplement plan and lifestyle protocol<br></br> — complete with exact dosages.</h6>
          </span>
        </div>
        <div id="howThree" className="w-[100vw] flex flex-col justify-center items-center">
          <h3>Our process is fully scientific. <br /> And transparent.</h3>
        </div>
        <div id="howFour" className="w-[100vw] flex flex-col justify-center items-center relative">
        <div className="absolute bottom-[10vh] right-[-5] max-sm:right-0 opacity-70">
                <Image src="helix-hor.svg" alt="Illustration of a DNA helix" width="300" height="76" className="w-200 max-sm:w-50 h-auto"></Image>
            </div>
          <span className="max-w-[80vw] flex flex-col justify-start gap-4">
            <h5>THIS IS THE GIST OF THE SCIENCE:</h5>
            <span className="flex flex-row gap-8 max-sm:flex-col">
            <span className="w-[50%] max-sm:w-[80%] h-auto"><p className="primary">Your <b>DNA</b> contains tiny <b>variations</b> called SNPs that can change how your <b>body processes nutrients,</b> detoxifies, and makes energy.</p></span>
            <span className="w-[50%] h-auto max-sm:w-[80%] lg:w-[50vh]"><p className="primary">By mapping these <b>SNPs</b> and the methylation <b>pathways they affect</b>, we can pinpoint exactly <b>which nutrients</b> you need — and at <b>what dosage</b> — to keep those biological systems running at their best.</p></span>
            </span>
          </span>
        </div>
      </section>
    </div>
    <div className="h-[300vh]"></div>
    </div>
  );
}