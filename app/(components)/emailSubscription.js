'use client'
import { useState, useEffect, useRef } from 'react';

export default function EmailSubscriptionForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  
  const inputRef = useRef(null);
  const buttonRef = useRef(null);

  // Detect keyboard open/close for mobile optimization
  useEffect(() => {
    const handleViewportChange = () => {
      if (!window.visualViewport) return;
      
      const currentHeight = window.visualViewport.height;
      const fullHeight = window.screen.height;
      
      // Detect if keyboard is likely open (viewport significantly smaller)
      const keyboardOpen = currentHeight < fullHeight * 0.75;
      setIsKeyboardOpen(keyboardOpen);
      
      // Add/remove body class for CSS targeting
      document.body.classList.toggle('keyboard-open', keyboardOpen);
    };

    const handleResize = () => {
      // Fallback for browsers without visualViewport
      const currentHeight = window.innerHeight;
      const fullHeight = window.screen.height;
      const keyboardOpen = currentHeight < fullHeight * 0.75;
      setIsKeyboardOpen(keyboardOpen);
      document.body.classList.toggle('keyboard-open', keyboardOpen);
    };

    // Use visualViewport if available (better mobile support)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
    } else {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      } else {
        window.removeEventListener('resize', handleResize);
      }
      document.body.classList.remove('keyboard-open');
    };
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Immediately blur the input to close keyboard
    if (document.activeElement && document.activeElement.tagName === 'INPUT') {
      document.activeElement.blur();
    }
    
    // Reset states
    setIsLoading(true);
    setMessage('');
    setIsSuccess(false);
    
    // Small delay to ensure smooth keyboard closing
    const performSubmit = async () => {
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

        // Debug logging - remove this after testing
        console.log('Response status:', response.status);
        console.log('Response data:', data);

        if (response.ok) {
          setIsSuccess(true);
          setMessage('Successfully subscribed! Please check your email for our free guide!');
          setEmail(''); // Clear the form
        } else {
          // Check if it's an "already subscribed" error - more flexible checking
          if (data.error && (
            data.error.toLowerCase().includes('already subscribed') ||
            data.error.toLowerCase().includes('already exists') ||
            data.error.toLowerCase().includes('already signed up')
          )) {
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

    // Add slight delay for smoother UX on mobile
    setTimeout(() => {
      performSubmit();
      // Also clean up body styles after submission
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.classList.remove('keyboard-open');
    }, isKeyboardOpen ? 200 : 0);
  };

  const handleButtonTouchStart = (e) => {
    // Prevent scrolling/jumping when keyboard is open
    if (isKeyboardOpen && document.activeElement?.tagName === 'INPUT') {
      e.preventDefault();
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent double submission
    if (isLoading) return;
    
    handleSubmit();
  };

  const handleInputFocus = () => {
    // Freeze body scroll while typing AND add keyboard-open class immediately
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.classList.add('keyboard-open');
  };

  const handleInputBlur = () => {
    // Small delay to ensure we don't interfere with button clicks
    setTimeout(() => {
      if (!isLoading) {
        // Re-enable body scroll when done typing and remove keyboard-open class
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.classList.remove('keyboard-open');
      }
    }, 200);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="relative">
        <div className="flex border-[0px] border-glow-300 bg-glow-200/10 backdrop-blur-sm overflow-visible">
          <input
            ref={inputRef}
            type="email"
            value={email}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Your e-mail address"
            className="flex-1 px-4 py-3 max-sm:px-2 bg-transparent text-white placeholder-gray-300 focus:outline-none disabled:opacity-50"
            required
            disabled={isLoading}
          />
          <button
            ref={buttonRef}
            type="submit"
            onTouchStart={handleButtonTouchStart}
            onClick={handleButtonClick}
            disabled={isLoading || !email.trim()}
            className="px-4 py-3 bg-glow-100/30 hover:bg-dark text-glow-100 font-medium transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-glow-100 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing Up...' : 'Sign Up!'}
          </button>
        </div>
        
        {/* Status message */}
        {message && (
          <div className={`mt-3 p-3 rounded-0 text-sm transition-all duration-300 ${
            isSuccess 
              ? 'bg-green-100/20 text-green-800 border border-green-200' 
              : 'bg-red-100/20 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}