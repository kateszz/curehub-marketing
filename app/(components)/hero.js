'use client'
import Image from "next/image";
import EmailSubscriptionForm from "./emailSubscription";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useRef, useEffect, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const heroTimelineRef = useRef();
  
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;

  // Keyboard detection effect
  useEffect(() => {
    let scrollTriggerInstance = null;
    
    const handleViewportChange = () => {
      if (!window.visualViewport) return;
      
      const currentHeight = window.visualViewport.height;
      const fullHeight = window.screen.height;
      
      // Detect if keyboard is likely open (viewport significantly smaller)
      const keyboardOpen = currentHeight < fullHeight * 0.75;
      setIsKeyboardOpen(keyboardOpen);
      
      // More robust ScrollTrigger control
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars?.id === 'heroscroll') {
          scrollTriggerInstance = st;
          if (keyboardOpen) {
            st.disable(false); // Don't revert to start position
          } else {
            st.enable();
            // Small delay before refresh to ensure smooth transition
            setTimeout(() => ScrollTrigger.refresh(), 100);
          }
        }
      });
    };

    const handleResize = () => {
      // Fallback for browsers without visualViewport
      const currentHeight = window.innerHeight;
      const fullHeight = window.screen.height;
      const keyboardOpen = currentHeight < fullHeight * 0.75;
      setIsKeyboardOpen(keyboardOpen);
      
      // Same ScrollTrigger logic
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars?.id === 'heroscroll') {
          scrollTriggerInstance = st;
          if (keyboardOpen) {
            st.disable(false);
          } else {
            st.enable();
            setTimeout(() => ScrollTrigger.refresh(), 100);
          }
        }
      });
    };

    // Also listen for focus/blur events on email inputs
    const handleInputFocus = () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars?.id === 'heroscroll') {
          st.disable(false);
        }
      });
    };

    const handleInputBlur = () => {
      setTimeout(() => {
        ScrollTrigger.getAll().forEach(st => {
          if (st.vars?.id === 'heroscroll') {
            st.enable();
          }
        });
        ScrollTrigger.refresh();
      }, 300);
    };

    // Use visualViewport if available (better mobile support)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
    } else {
      window.addEventListener('resize', handleResize);
    }

    // Listen for email input focus/blur throughout the document
    document.addEventListener('focusin', (e) => {
      if (e.target.type === 'email') {
        handleInputFocus();
      }
    });
    
    document.addEventListener('focusout', (e) => {
      if (e.target.type === 'email') {
        handleInputBlur();
      }
    });

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      } else {
        window.removeEventListener('resize', handleResize);
      }
      document.removeEventListener('focusin', handleInputFocus);
      document.removeEventListener('focusout', handleInputBlur);
    };
  }, []);

  useGSAP(() => {
    const hero = heroRef.current;
    const heroElems = gsap.utils.toArray(heroRef.current.children);
    const heroTimeline = gsap.timeline({});
    
    heroElems.forEach((heroElem) => {
      gsap.fromTo(heroElem, {y: 3, opacity: 0, scale: 0.5}, {y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'power1.inOut'});
    });
    
    heroTimeline.fromTo(heroElems, {opacity: 1, blur: 0, scale: 1}, {
      opacity: 0,
      blur: 100,
      scale: 0.1,
      delay: 1,
      scrollTrigger: {
        id: 'heroscroll',
        trigger: '#whatOne',
        start: 'top bottom',
        end: 'top top',
        pin: '#hero',
        pinSpacing: false,
        markers: false,
        scrub: 1
      }
    });

    // Store reference to timeline for keyboard control
    heroTimelineRef.current = heroTimeline;
  }, []);

  return (
    <section ref={heroRef} id="hero" className="relative h-[100vh] flex flex-col justify-center items-center gap-10 max-sm:gap-12 px-4">
      <div className="absolute top-[-90] md:right-[-100] right-[-120] lg:right-[-50]">
        <Image src="supplement.svg" alt="Illustration of a supplement pill" width="76" height="200" className="w-50 h-auto lg:w-80 md:w-70"></Image>
      </div>
      <div className="absolute bottom-[-100] left-[-200] md:left-[-60] lg:left-[-50]">
        <Image src="molecules.svg" alt="Illustration of molecules" width="76" height="200" className="w-80 h-auto"></Image>
      </div>
      <span>
        <p className="bg-linear-(--snow-gradient) bg-clip-text opacity-70 text-center"><b>Coming to you in Q4 of 2025</b></p>
        <h1 className="text-center w-[70vw] lg:max-w-[50vw]">Your genetic blueprint holds the key to feeling your best — every day.</h1>
      </span>
      <div className="heroform-wrapper flex flex-row gap-8 items-center max-md:flex-col">
        <EmailSubscriptionForm></EmailSubscriptionForm>
      </div>
      <h6 className="max-w-[30ch] text-center">Use your genetic data to get a personalised supplement and lifestyle plan, tailored to the microgram.</h6>
    </section>
  );
}