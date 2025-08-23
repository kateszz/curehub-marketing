import EmailSubscriptionForm
 from "./emailSubscription";
 import Image from "next/image";
export default function CtaSection() {
    return(
        <section id="cta" className="h-[100vh] flex flex-col justify-center items-center gap-10 max-sm:gap-12 px-4">
        <span><p className="bg-linear-(--snow-gradient) secondary bg-clip-text opacity-80 text-center">Coming to you in Q4 of 2025</p>
         <h1 className="text-center w-[70vw] lg:max-w-[50vw]">Your DNA Is the Map.<br></br>
We’re the Guide.</h1></span>
     <div className="heroform-wrapper flex flex-row gap-8 items-center max-md:flex-col">
    
     <EmailSubscriptionForm></EmailSubscriptionForm>
    
     </div>
     <Image src="/logomark_snow.png" alt="Curehub Logo Mark" width="300" height="300" className="w-[10vw] h-auto"></Image>
     <h4 className="max-w-[30ch] text-center">Curehub</h4>
     </section>
    );
}