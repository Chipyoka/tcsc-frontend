// components/CookieBanner.jsx
import { useState, useEffect } from 'react';
import { Cookie, X, Info } from 'lucide-react';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if user has already accepted
    const hasAccepted = localStorage.getItem('tcsc-essential_cookies_accepted');
    
    // Only show if not accepted before
    if (!hasAccepted) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsAnimating(true);
        setTimeout(() => setIsVisible(true), 50);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    // Store acceptance with timestamp
    const acceptanceData = {
      accepted: true,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };

    localStorage.setItem('tcsc-essential_cookies_accepted', JSON.stringify(acceptanceData));

    // Animate out
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Backdrop for mobile - subtle overlay */}
      <div 
        className={`fixed inset-0 bg-gray-900/30 transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        } md:bg-transparent pointer-events-auto`}
        onClick={handleAccept}
      />
      
      {/* Banner Container */}
      <div className="bg-gray-50 border-t-4 border-gray-200 inset-shadow-lg inset-shadow-indigo-500 fixed inset-x-0 bottom-0 pointer-events-auto">
        <div 
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 transform ${
            isAnimating 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-full opacity-0'
          }`}
        >
          {/* Banner Card */}
          <div className=" md:max-w-4xl mx-auto rounded-t-xl  mb-4 md:mb-6">
            <div className="p-4 md:p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-sm">
                    <Cookie className="w-5 h-5 text-(--color-primary)" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Essential Cookies
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      We use cookies necessary for site operation
                    </p>
                  </div>
                </div>
                
                {/* Close button - desktop */}
                <button
                  onClick={handleAccept}
                  className="hidden md:flex items-center justify-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-sm transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100 my-4" />

              {/* Content */}
              <div className="space-y-3">
                <p className="text-gray-700">
                  This website uses essential cookies to ensure proper functionality. 
                  These cookies are necessary for security, session management, and site performance.
                </p>
                
                <div className="flex items-start gap-2 p-3 bg-gray-100 rounded-sm border border-gray-200">
                  <Info className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600">
                    No personal data is collected. You can manage cookies in your browser settings.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-end">
                <a
                  href="/privacy#cookies"
                  className="flex-1 sm:flex-none px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-sm font-medium text-center transition-colors"
                >
                  Learn more
                </a>
                
                <button
                  onClick={handleAccept}
                  className="w-full md:w-fit btn-primary-sm"
                >
                  Accept & Continue
                </button>
              </div>

              {/* Mobile close button */}
              <button
                onClick={handleAccept}
                className="md:hidden w-full mt-4 py-2 text-gray-600 hover:text-gray-900 font-medium border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
          
          {/* Optional: Site credit/attribution */}
          <div className="text-center">
            <p className="text-xs text-gray-400 mb-2">
              This site uses essential cookies only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;