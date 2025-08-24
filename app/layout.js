
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import BgAnimated from "./(components)/bgAnims";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/all";
import LenisProvider from "./(components)/lenisProvider";
import StarfieldBackground from "./(components)/bgParticles";
gsap.registerPlugin(ScrollSmoother);


export const metadata = {
  title: "Curehub 2025",
  description: "Your DNA is the map. We are the guide.",
  keywords: ['Curehub', 'DNA-based supplement guide', 'DNA', 'Supplement plan', 'Supplements'],
};

const NavBar = () => {
  const Logo = () => {
    return(<Image src="/logotype-snow.png" alt="Curehub company logo" width="500" height="500" className="h-4 w-auto"></Image>)
  }
  return (
<div className="fixed top-0 navbar-wrapper w-full h-fit flex flex-row justify-center align-middle pt-8 z-1">
<nav className="navCard border-none px-8 py-6 flex flex-row justify-between items-center gap-8">
<Logo></Logo>
<div className="navlinks flex-row flex gap-8 max-sm:hidden">
  <Link className="secondary" href="#how">How It Works</Link>
  <Link className="secondary" href="#signup">Sign Up for Launch</Link>
</div>
</nav>
</div>
  );
};

export default function RootLayout({ children }) {

 

  return (
    <html lang="en" className="overflow-x-hidden overscroll-x-none">
      
      <body
        className={`antialiased relative overflow-x-hidden touch-pan-y touch-pinch-zoom`}
      >
        <LenisProvider>
        <StarfieldBackground />
       <BgAnimated></BgAnimated>
       
<NavBar></NavBar>
        {children}
        </LenisProvider>
      </body>
    </html>
  );
}
