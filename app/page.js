import Hero from "./(components)/hero";
import WhatSection from "./(components)/whatSection";
import HowSection from "./(components)/howSection";
import BenefitsSection from "./(components)/benefitsSection";
import CtaSection from "./(components)/ctaSection";


export default function Home() {
  
 
  return (
    <div>
      
      <Hero></Hero>
      <WhatSection></WhatSection>
      <HowSection></HowSection>
      <BenefitsSection></BenefitsSection>
      <CtaSection></CtaSection>
    </div>
  );
}