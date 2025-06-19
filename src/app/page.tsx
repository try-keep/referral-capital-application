"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Declare Facebook Pixel types
declare global {
  interface Window {
    fbq: (action: string, event: string, data?: object) => void;
  }
}

export default function Home() {
  const router = useRouter();

  // Fire Facebook Pixel event for homepage view
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', { content_name: 'Homepage' });
    }
  }, []);

  const handleApplyNow = () => {
    router.push('/step/1');
    
    // Fire Facebook Pixel event for application start
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'InitiateCheckout');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Image 
                src="/images/keep-logo.svg" 
                alt="Keep Logo" 
                width={120} 
                height={32} 
                priority
              />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#why-keep" className="text-gray-700 hover:text-gray-900">Why Keep</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-gray-900">How it Works</a>
              <a href="#solutions" className="text-gray-700 hover:text-gray-900">Solutions</a>
              <a href="#faq" className="text-gray-700 hover:text-gray-900">FAQ</a>
              <a href="#testimonials" className="text-gray-700 hover:text-gray-900">Testimonials</a>
            </div>
            <div className="flex items-center space-x-4">
              <a href="https://app.trykeep.com/login" target="_blank" className="text-gray-700 hover:text-gray-900">
                Log in
              </a>
              <button 
                onClick={handleApplyNow}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Image 
                src="/images/trusted-by-seal-50K.svg" 
                alt="Trusted by 50,000+ Canadian Businesses" 
                width={200} 
                height={60} 
                className="mb-8"
              />
              
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                <span className="gradient-yellow-pink-purple">2,000 Canadian Businesses</span> choose Keep each month
              </h1>
              
              <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-4">
                Business Loans - Fast, Flexible, Honest
              </h2>
              
              <p className="text-lg text-gray-600 mb-8">
                We lend money at rates that aren't predatory... And if we can't finance your business ourselves, we have 30+ other lenders we partner with to get you there.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Borrow from $5K to $1.5M</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Same day approval</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Fair rates; As low as 8%, based on your business</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Available to businesses with more than $10,000 per month in revenue</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleApplyNow}
                  className="bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Apply in Minutes
                </button>
                <a 
                  href="https://meetings.hubspot.com/speak-to-a-lending-expert/today" 
                  target="_blank"
                  className="border-2 border-black text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-black hover:text-white transition-colors text-center"
                >
                  Speak to a Lending Expert
                </a>
              </div>
              
              <p className="text-sm text-gray-500 mt-4">
                Applications do not impact your credit score<sup>1</sup>
              </p>
            </div>

            <div className="lg:pl-8">
              <Image 
                src="/images/cover.webp" 
                alt="Keep Capital Business Loans" 
                width={700} 
                height={500} 
                className="w-full h-auto rounded-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Keep Section */}
      <section id="why-keep" className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Keep?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              One application - Multiple lenders. We give you the best deal, whether it's from Keep or another lender.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mb-6">
                <Image 
                  src="/images/icon-honest_1icon-honest.webp" 
                  alt="Honest Finance" 
                  width={80} 
                  height={80} 
                  className="mx-auto"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">We're making finance honest.</h3>
              <p className="text-gray-600">We lend money at rates that aren't predatory</p>
            </div>

            <div className="text-center">
              <div className="mb-6">
                <Image 
                  src="/images/icon-application_1icon-application.webp" 
                  alt="One Application" 
                  width={80} 
                  height={80} 
                  className="mx-auto"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">One application, 30+ lenders</h3>
              <p className="text-gray-600">If we can't finance you, we work with 30+ other lenders</p>
            </div>

            <div className="text-center">
              <div className="mb-6">
                <Image 
                  src="/images/icon-fees_1icon-fees.webp" 
                  alt="No Fees" 
                  width={80} 
                  height={80} 
                  className="mx-auto"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">We don't charge fees</h3>
              <p className="text-gray-600">We're not brokers. No loan origination fees.</p>
            </div>

            <div className="text-center">
              <div className="mb-6">
                <Image 
                  src="/images/icon-best-offer_1icon-best-offer.webp" 
                  alt="Best Offer" 
                  width={80} 
                  height={80} 
                  className="mx-auto"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Best offer guarantee</h3>
              <p className="text-gray-600">If our partners can offer you a better loan, we'll share their offer with you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How it <span className="gradient-yellow-pink-purple">works</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              One application - Multiple lenders. We give you the best deal, whether it's from Keep or another lender.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mb-6">
                <Image 
                  src="/images/offer-step-01_1offer-step-01.webp" 
                  alt="Apply in Minutes" 
                  width={120} 
                  height={120} 
                  className="mx-auto"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Apply in Minutes</h3>
              <p className="text-gray-600">Minimal paperwork required. Just some business details, and your recent bank statement.</p>
            </div>

            <div className="text-center">
              <div className="mb-6">
                <Image 
                  src="/images/offer-step-02_1offer-step-02.webp" 
                  alt="We review your loan" 
                  width={120} 
                  height={120} 
                  className="mx-auto"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">We review your loan</h3>
              <p className="text-gray-600">We might get in touch if we need to know a little more about your business.</p>
            </div>

            <div className="text-center">
              <div className="mb-6">
                <Image 
                  src="/images/offer-step-03_1offer-step-03.webp" 
                  alt="Our partners review your loan" 
                  width={120} 
                  height={120} 
                  className="mx-auto"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Our partners review your loan</h3>
              <p className="text-gray-600">Up to 30+ other lenders review your loan at same time.</p>
            </div>

            <div className="text-center">
              <div className="mb-6">
                <Image 
                  src="/images/offer-step-04_1offer-step-04.webp" 
                  alt="We surface the best offer to you" 
                  width={120} 
                  height={120} 
                  className="mx-auto"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">We surface the best offer to you</h3>
              <p className="text-gray-600">Even if it not us financing your business, we will always give you the best offer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="bg-gray-50 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              One platform<br />
              <span className="gradient-yellow-pink-purple">A range of funding solutions</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Business Loans</h3>
                <p className="text-gray-600 mb-6">One off lump sum for big or small business plans. From $5K to $1.5M.</p>
              </div>
              <div className="relative">
                <Image 
                  src="/images/industries-features_00001.webp" 
                  alt="Business Loans" 
                  width={400} 
                  height={250} 
                  className="w-full h-48 object-cover"
                />
                <button 
                  onClick={handleApplyNow}
                  className="absolute bottom-4 right-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Lines of Credit</h3>
                <p className="text-gray-600 mb-6">Ongoing access to funds with interest only paid on what you use, and no monthly or annual fees.</p>
              </div>
              <div className="relative">
                <Image 
                  src="/images/industries-features_00002.webp" 
                  alt="Lines of Credit" 
                  width={400} 
                  height={250} 
                  className="w-full h-48 object-cover"
                />
                <button 
                  onClick={handleApplyNow}
                  className="absolute bottom-4 right-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Business Credit Card</h3>
                <p className="text-gray-600 mb-6">More rewards that Amex and the Big 5 Banks and the most interest free days in Canada.</p>
              </div>
              <div className="relative">
                <Image 
                  src="/images/industries-features_00003.webp" 
                  alt="Business Credit Card" 
                  width={400} 
                  height={250} 
                  className="w-full h-48 object-cover"
                />
                <button 
                  onClick={handleApplyNow}
                  className="absolute bottom-4 right-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <Image 
              src="/images/keep-logo.svg" 
              alt="Keep Logo" 
              width={120} 
              height={32} 
              className="mb-8 filter invert"
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-gray-400 mb-4">
                  This card is issued by Peoples Trust Company under license from Mastercard International Incorporated.<br /><br />
                  Mastercard is a registered trademark, and the circles design is a trademark of Mastercard International Incorporated.<br /><br />
                  Keep is not available to residents or businesses in Quebec.<br /><br />
                  <sup>1</sup>While applying and reviewing an offer will not impact your personal credit score, accepting an offer may result in a hard inquiry. At Keep, we partner with credit agencies to help issue the best possible terms and highest credit limit for our cardholders.
                </p>
                
                <div className="text-sm text-gray-400">
                  <p>Contact us at <a href="mailto:support@trykeep.com" className="text-white hover:text-gray-300">support@trykeep.com</a></p>
                  <p>For inquiries call/text <a href="tel:18664605337" className="text-white hover:text-gray-300">+1-866-460-5337</a></p>
                  <p className="mt-2">51 Wolseley St. Toronto, ON M5T 1A5</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">Explore</h4>
                <div className="space-y-2">
                  <a href="https://www.trykeep.com/" target="_blank" className="block text-sm text-gray-400 hover:text-white">Home</a>
                  <a href="https://help.trykeep.com/" target="_blank" className="block text-sm text-gray-400 hover:text-white">Help Centre</a>
                  <a href="tel:+18664605337" className="block text-sm text-gray-400 hover:text-white">Call Us</a>
                  <a href="https://www.trykeep.com/careers" target="_blank" className="block text-sm text-gray-400 hover:text-white">Jobs</a>
                  <a href="https://www.trykeep.com/media-coverage" target="_blank" className="block text-sm text-gray-400 hover:text-white">Media Coverage</a>
                  <a href="https://www.trykeep.com/newsroom" target="_blank" className="block text-sm text-gray-400 hover:text-white">Blog</a>
                  <a href="https://www.trykeep.com/legal/platform-agreement" target="_blank" className="block text-sm text-gray-400 hover:text-white">Legal</a>
                  <button onClick={handleApplyNow} className="block text-sm text-gray-400 hover:text-white text-left">Apply Today</button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-6 mb-4 md:mb-0">
                <a href="https://x.com/Keep_Card" target="_blank" aria-label="Twitter" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.1761 4H19.9362L13.9061 10.7774L21 20H15.4456L11.0951 14.4066L6.11723 20H3.35544L9.80517 12.7508L3 4H8.69545L12.6279 9.11262L17.1761 4ZM16.2073 18.3754H17.7368L7.86441 5.53928H6.2232L16.2073 18.3754Z" />
                  </svg>
                </a>
                <a href="https://www.linkedin.com/company/trykeep/" target="_blank" aria-label="LinkedIn" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/keep_hq/" target="_blank" aria-label="Instagram" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.987 11.987 11.987 6.621 0 11.987-5.366 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.23 18.482c-1.475 0-2.67-1.195-2.67-2.67s1.195-2.67 2.67-2.67 2.67 1.195 2.67 2.67-1.195 2.67-2.67 2.67zm7.65 0c-1.475 0-2.67-1.195-2.67-2.67s1.195-2.67 2.67-2.67 2.67 1.195 2.67 2.67-1.195 2.67-2.67 2.67z"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com/people/Keep/100080028222444/" target="_blank" aria-label="Facebook" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
              
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
                <span>© 2025 Keep Technologies Corp. All rights reserved</span>
                <a href="https://www.trykeep.com/legal/privacy-policy" target="_blank" className="hover:text-white">Privacy Policy</a>
                <a href="https://www.trykeep.com/legal/website-terms" target="_blank" className="hover:text-white">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Fixed CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 p-4">
        <div className="max-w-7xl mx-auto text-center">
          <button 
            onClick={handleApplyNow}
            className="bg-black text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Apply in Minutes
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Applications do not impact your credit score<sup>1</sup>
          </p>
        </div>
      </div>

      {/* Add padding to bottom to account for fixed CTA */}
      <div className="h-24"></div>
    </div>
  );
}