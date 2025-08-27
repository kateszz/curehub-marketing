// app/api/subscribe/route.js
import { NextResponse } from 'next/server';

// Rate limiting storage (in production, use Redis or a database)
const rateLimitMap = new Map();

// Simple rate limiting function
function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5; // Max 5 requests per 15 minutes per IP
  
  const requests = rateLimitMap.get(ip) || [];
  const validRequests = requests.filter(timestamp => now - timestamp < windowMs);
  
  if (validRequests.length >= maxRequests) {
    return true;
  }
  
  validRequests.push(now);
  rateLimitMap.set(ip, validRequests);
  return false;
}

// Simple email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Honeypot and timing-based bot detection
function detectBot(body, headers) {
  // Check for honeypot field (add this to your form as a hidden field)
  if (body.website || body.url || body.honeypot) {
    return true;
  }
  
  // Check suspicious user agents
  const userAgent = headers.get('user-agent') || '';
  const suspiciousAgents = ['bot', 'crawler', 'spider', 'scraper'];
  if (suspiciousAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
    return true;
  }
  
  // Check for missing common headers
  if (!headers.get('accept') || !headers.get('accept-language')) {
    return true;
  }
  
  return false;
}

export async function POST(request) {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    
    // Rate limiting check
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    const { email } = body;
    
    // Bot detection
    if (detectBot(body, request.headers)) {
      console.log('Bot detected from IP:', ip);
      return NextResponse.json(
        { error: 'Invalid request.' },
        { status: 400 }
      );
    }
    
    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }
    
    // Check environment variables
    if (!process.env.SENDER_API_KEY) {
      console.error('SENDER_API_KEY environment variable is not set');
      return NextResponse.json(
        { error: 'Server configuration error.' },
        { status: 500 }
      );
    }
    
    // Prepare data for Sender API
    const subscriberData = {
      email: email.trim().toLowerCase(),
      // Add additional fields as needed:
      // firstname: body.firstname || '',
      // lastname: body.lastname || '',
      // Add custom fields if you have them set up in Sender
      // fields: {
      //   source: 'website',
      //   signup_date: new Date().toISOString()
      // }
    };
    
    // Call Sender API to add subscriber
    const senderResponse = await fetch('https://api.sender.net/v2/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDER_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(subscriberData)
    });
    
    const senderData = await senderResponse.json();
    
    // Debug logging - remove after testing
    console.log('Sender API response status:', senderResponse.status);
    console.log('Sender API response data:', senderData);
    
    if (!senderResponse.ok) {
      console.error('Sender API error:', senderData);
      
      if (senderResponse.status === 401) {
        console.error('Invalid Sender API key');
        return NextResponse.json(
          { error: 'Server authentication error.' },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      );
    }
    
    // Check if this is a duplicate subscription based on creation date
    const createdDate = new Date(senderData.data.created);
    const now = new Date();
    const timeDifference = now - createdDate;
    const oneMinuteInMs = 60 * 1000;
    
    // If the subscriber was created more than 1 minute ago, it's likely a duplicate
    if (timeDifference > oneMinuteInMs) {
      console.log('Duplicate subscription detected for:', email);
      return NextResponse.json(
        { error: 'This email is already subscribed to our newsletter.' },
        { status: 400 }
      );
    }
    
    console.log('Successfully subscribed:', email);
    
    return NextResponse.json(
      { 
        message: 'Successfully subscribed!',
        subscriber: {
          email: senderData.data.email,
          id: senderData.data.id
        }
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}