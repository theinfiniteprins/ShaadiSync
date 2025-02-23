import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ChevronRight, Shield } from 'lucide-react';

const VerificationPrompt = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br to-indigo-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* Custom notification banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900">
              Account Verification Required
            </h3>
            <p className="text-blue-700 text-sm">
              Complete this step to access all features
            </p>
          </div>
        </div>

        {/* Main content container */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-gray-100">
          {/* Header section */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-900">
              Verify Your Account
            </h2>
          </div>
          
          {/* Content section */}
          <div className="p-6 space-y-4">
            <p className="text-gray-600 text-center">
              Your account needs to be verified before you can access your dashboard and start using our services.
            </p>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-blue-700">
                  <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                  Enhanced security features
                </li>
                <li className="flex items-center text-sm text-blue-700">
                  <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                  Access to all platform features
                </li>
                <li className="flex items-center text-sm text-blue-700">
                  <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                  Verified account badge
                </li>
              </ul>
            </div>
          </div>

          {/* Footer section */}
          <div className="p-6 border-t border-gray-100">
            <Link 
              to="/artist/verify"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg text-base font-semibold shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 group"
            >
              Start Verification
              <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPrompt;