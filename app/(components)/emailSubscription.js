'use client'
import { useState } from 'react';
import { ScrollTrigger } from 'gsap/all';


function freezeHeroScroll(freeze) {
  ScrollTrigger.getAll().forEach(st => {
    if (st.vars?.id === 'heroscroll') {
      if (freeze) st.disable(false); // freeze at current state, don't revert
      else st.enable();
    }
  })
  if (!freeze) ScrollTrigger.refresh(); // re-measure after keyboard closes
}


export default function EmailSubscriptionForm() {
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add your email submission logic here
    console.log('Email submitted:', email);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex border-[0px] border-glow-300 bg-glow-200/10 backdrop-blur-sm overflow-visible">
          <input
            type="email"
            value={email}
            onFocus={() => freezeHeroScroll(true)}
            onBlur={() => freezeHeroScroll(false)}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your e-mail address"
            className="flex-1 px-4 py-3 max-sm:px-2 bg-transparent text-white placeholder-gray-300 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="px-4 py-3 bg-glow-100/30 hover:bg-dark text-glow-100 font-medium transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-glow-100 focus:ring-offset-0"
          >
            Sign Up!
          </button>
        </div>
      </form>
    </div>
  );
}