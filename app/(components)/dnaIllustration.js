"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const DnaIllustration = () => {
  const containerRef = useRef(null);
  const dnaRef = useRef(null);
  const profileRef = useRef(null);
  const labelsRef = useRef(null);
  const floatingTlRef = useRef(null);
 


  useEffect(() => {
    const container = containerRef.current;
    const dna = dnaRef.current;
    const profile = profileRef.current;
    const labels = labelsRef.current;
    const isMobile = window.innerWidth <= 768;

    if (!container || !dna || !profile || !labels) return;
    
    
    // Initial setup - hide profile and labels immediately
    gsap.set(profile, { opacity: 0, scale: 0.8, visibility: 'hidden' });
    gsap.set(labels.children, { opacity: 0, y: 20, scale: 0.8, visibility: 'hidden' });

    // Continuous floating animation for DNA (default state)
    const floatingTl = gsap.timeline({ repeat: -1, yoyo: true });
    floatingTl.to(dna, {
      y: -10,
      rotation: 2,
      duration: 3,
      ease: "power2.inOut"
    });
    floatingTlRef.current = floatingTl;

    



    // State 1 -> State 2: Show profile when #whatOne is in view
    ScrollTrigger.create({
      trigger: "#whatOne",
      start: "top 20%",
      end: "bottom 40%",
      onEnter: () => {
        gsap.set(container, { css: { zIndex: 1 } });
        gsap.to(dna, { scale: 1.2 });
       if (isMobile) { gsap.to(container,{y:100}) };
        gsap.set(profile, { visibility: 'visible' });
        gsap.to(profile, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)"
        });
      },
      onLeave: () => {
        gsap.to(profile, {
          opacity: 0,
          scale: 0.8,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => gsap.set(profile, { visibility: 'hidden' })
        });
      },
      onEnterBack: () => {
        gsap.set(profile, { visibility: 'visible' });
        gsap.to(profile, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)"
        });
      },
      onLeaveBack: () => {
        gsap.set(container, { css: { zIndex: -3 } });
        gsap.to(dna, { scale: 1 });
        if (isMobile) {gsap.to(container,{y:0})};
        gsap.to(profile, {
          opacity: 0,
          scale: 0.8,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => gsap.set(profile, { visibility: 'hidden' })
        });
      }
    });

    // State 2 -> State 3: Show labels when #whatTwo is in view
    ScrollTrigger.create({
      trigger: "#whatTwo",
      start: "top 20%",
      end: "bottom 40%",
      onEnter: () => {
        gsap.set(container, { css: { zIndex: 1 }});
        
        gsap.to(dna, { scale: 1.2 });
        gsap.set(labels.children, { visibility: 'visible' });
        gsap.to(labels.children, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)"
        });
      },
      onLeave: () => {
        gsap.to(labels.children, {
          opacity: 0,
          y: 20,
          scale: 0.8,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.inOut",
          onComplete: () => gsap.set(labels.children, { visibility: 'hidden' })
        });
      },
      onEnterBack: () => {
        gsap.set(labels.children, { visibility: 'visible' });
        gsap.to(labels.children, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)"
        });
      },
      onLeaveBack: () => {
        gsap.to(labels.children, {
          opacity: 0,
          y: 20,
          scale: 0.8,
          duration: 0.4,
          stagger: 0.05,
          ease: "power2.inOut",
          onComplete: () => gsap.set(labels.children, { visibility: 'hidden' })
        });
      }
    });
    ScrollTrigger.create({
        trigger: "#whatThree",
        start: "top 50%",
        onEnter: () => {
          gsap.to(container, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut"
          });
        },
        onLeaveBack: () => {
          gsap.to(container, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.inOut"
          });
        }
      });

    // Cleanup function
    return () => {
      if (floatingTlRef.current) {
        floatingTlRef.current.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed top-1/2 lg:left-[6vw] left-[-5vw] -translate-y-1/2 max-md:top-[15vh] max-md:left-1/2 max-md:-translate-x-1/2  w-[40vw] max-w-[20rem] min-w-[45px] h-auto pointer-events-none">
      {/* DNA Illustration */}
      <div ref={dnaRef} className="relative w-full h-full">
        <img
          src="/helix-glass.png"
          alt="DNA Helix"
          className="w-full h-full object-contain drop-shadow-lg max-md:rotate-90"
        />
      </div>

      {/* Profile Icon Overlay (State 2) */}
      <div 
        ref={profileRef}
        className="absolute top-8 left-8 w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white opacity-0 invisible"
      >
        <img
          src="https://plus.unsplash.com/premium_photo-1664369473447-64172945caa0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Text Labels Overlay (State 3) */}
      <div ref={labelsRef} className="absolute inset-0 pointer-events-none overflow-visible z-[-3]">
        <div className="absolute md:left-[0%] max-md:left-[-20%] top-[30%] left-[-10%] bg-blue-400 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg opacity-0 invisible">
          SNPs
        </div>
        <div className="absolute top-[100%] right-[-20%] bg-glow-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg opacity-0 invisible">
          methylation
        </div>
        <div className="absolute bottom-[100%] left-8 bg-dark text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg opacity-0 invisible">
          genotype
        </div>
      </div>
    </div>
  );
};

export default DnaIllustration;