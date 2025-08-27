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
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setIsLoading(true);
    setMessage('');
    setIsSuccess(false);
    
    try {
      // Make API call to your backend endpoint
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase() 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage('Successfully subscribed! Please check your email for confirmation. and our free guide on how DNA affects your health!');
        setEmail(''); // Clear the form
      } else {
        // Check if it's an "already subscribed" error
        if (response.status === 400 && data.error && 
            data.error.toLowerCase().includes('already subscribed')) {
          setIsSuccess(true); // Show as success (green)
          setMessage('You have already signed up for our launch!');
        } else {
          setIsSuccess(false);
          setMessage(data.error || 'Something went wrong. Please try again.');
        }
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setIsSuccess(false);
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="relative">
        <div className="flex border-[0px] border-glow-300 bg-glow-200/10 backdrop-blur-sm overflow-visible">
          <input
            type="email"
            value={email}
            onFocus={() => freezeHeroScroll(true)}
            onBlur={() => freezeHeroScroll(false)}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
            placeholder="Your e-mail address"
            className="flex-1 px-4 py-3 max-sm:px-2 bg-transparent text-white placeholder-gray-300 focus:outline-none disabled:opacity-50"
            required
            disabled={isLoading}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !email.trim()}
            className="px-4 py-3 bg-glow-100/10 hover:bg-dark text-glow-100 font-medium transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-glow-100 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing Up...' : 'Sign Up!'}
          </button>
        </div>
        
        {/* Status message */}
        {message && (
          <div className={`mt-3 p-3 rounded-0 ${
            isSuccess 
              ? 'bg-green-100/20 text-green-800 border border-green-200' 
              : 'bg-red-100/20 text-red-800 border border-red-200'
          }`}>
            <p className={` ${ isSuccess ? 'text-green-800' : 'text-red-800' } `}>
            {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}