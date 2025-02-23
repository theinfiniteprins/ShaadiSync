import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, ArrowRight } from 'lucide-react';

const VerificationPendingPrompt = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* Status banner */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <Clock className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0 animate-pulse" />
          <div>
            <h3 className="font-semibold text-yellow-900">
              Verification In Progress
            </h3>
            <p className="text-yellow-700 text-sm">
              We're reviewing your verification details
            </p>
          </div>
        </div>

        {/* Main content container */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-gray-100">
          {/* Header section */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900">
              Verification Under Review
            </h2>
          </div>
          
          {/* Content section */}
          <div className="p-6 space-y-4">
            <p className="text-gray-600 text-center">
              Thanks for submitting your verification details. Our team is currently reviewing your information to ensure everything meets our standards.
            </p>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-medium text-yellow-800 mb-2">What happens next?</h4>
              <ul className="space-y-3">
                <li className="flex items-center text-sm text-yellow-700">
                  <ArrowRight className="h-4 w-4 mr-2 flex-shrink-0" />
                  We'll review your submitted documents
                </li>
                <li className="flex items-center text-sm text-yellow-700">
                  <ArrowRight className="h-4 w-4 mr-2 flex-shrink-0" />
                  You'll receive an email notification once verified
                </li>
                <li className="flex items-center text-sm text-yellow-700">
                  <ArrowRight className="h-4 w-4 mr-2 flex-shrink-0" />
                  This usually takes 1-2 business days
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
              <p>Need to update your verification details?</p>
              <p>Contact our support team at support@example.com</p>
            </div>
          </div>

          {/* Footer section */}
          <div className="p-6 border-t border-gray-100">
            <Link 
              to="/artist/profile"
              className="w-full bg-yellow-600 text-white px-6 py-3 rounded-lg text-base font-semibold shadow-md hover:bg-yellow-700 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              View Profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPendingPrompt;