import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import config from "../configs/config";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      const loadingToast = toast.loading('Logging in with Google...');
      try {
        // Send authorization code to backend
        const backendResponse = await axios.post(
          `${config.baseUrl}/api/auth/google`,
          {
            code: codeResponse.code
          }
        );

        if (backendResponse.data.success) {
          login(backendResponse.data.token);
          toast.success('Successfully logged in!');
          navigate('/');
        }
      } catch (error) {
        console.error('Google login error:', error);
        toast.error(error.response?.data?.message || 'Failed to login with Google');
      } finally {
        toast.dismiss(loadingToast);
      }
    },
    onError: (errorResponse) => {
      console.error('Google login error:', errorResponse);
      toast.error('Google login failed. Please try again.');
    }
  });

  return (
    <button
      onClick={() => handleGoogleLogin()}
      className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 transition-colors"
    >
      <FcGoogle className="w-5 h-5" />
      <span>Continue with Google</span>
    </button>
  );
};

export default GoogleLoginButton;