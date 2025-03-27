import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, AlertCircle } from 'lucide-react';
import config from '../../configs/config';
import axios from 'axios';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FORMATS = ['.pdf', '.jpg', '.jpeg', '.png'];

const ArtistVerification = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    aadharCardNumber: '',
    bankDetails: {
      accountNumber: '',
      ifscCode: '',
    },
    verificationDocuments: {
      bankDocument: 'https://example.com/dummy-bank-doc.pdf',  // dummy URL
      aadharCardFile: 'https://example.com/dummy-aadhar.pdf',  // dummy URL
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileErrors, setFileErrors] = useState({
    bankDocument: '',
    aadharCardFile: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateFile = (file, fieldName) => {
    if (!file) return 'File is required';
    if (file.size > MAX_FILE_SIZE) return 'File size must be less than 5MB';
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_FORMATS.includes(fileExtension)) {
      return 'Invalid file format. Allowed formats: PDF, JPG, PNG';
    }
    return '';
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    
    // Generate random URLs for demonstration
    const dummyUrls = {
      bankDocument: `https://dummybank.com/doc-${Date.now()}.pdf`,
      aadharCardFile: `https://dummyaadhar.com/card-${Date.now()}.pdf`
    };

    setFormData(prev => ({
      ...prev,
      verificationDocuments: {
        ...prev.verificationDocuments,
        [name]: dummyUrls[name]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log(formData);
      const token = localStorage.getItem('artistToken');
      
      const response = await axios.put(
        `${config.baseUrl}/api/artists/submit-verify/kaan`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        navigate('/artist');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Verification submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Account Verification</h2>
          <p className="mt-2 text-gray-600">Please provide your verification details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            {/* Aadhar Card Section */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-medium text-gray-900 mb-4">Aadhar Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Aadhar Card Number
                  </label>
                  <input
                    type="text"
                    name="aadharCardNumber"
                    value={formData.aadharCardNumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                    pattern="[0-9]{12}"
                    title="Please enter a valid 12-digit Aadhar number"
                    placeholder="Enter 12-digit Aadhar number"
                  />
                </div>

                {/* File Upload Component */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Aadhar Card Copy
                  </label>
                  <div className="relative">
                    <div className="flex items-center justify-center w-full">
                      <label className={`w-full h-32 flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer
                        ${fileErrors.aadharCardFile ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PDF, PNG, JPG up to 5MB
                          </p>
                        </div>
                        <input
                          type="file"
                          name="aadharCardFile"
                          onChange={handleFileChange}
                          className="hidden"
                          accept={ALLOWED_FORMATS.join(',')}
                          required
                        />
                      </label>
                    </div>
                    {fileErrors.aadharCardFile && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {fileErrors.aadharCardFile}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Details Section */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-medium text-gray-900 mb-4">Bank Details</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="bankDetails.accountNumber"
                    value={formData.bankDetails.accountNumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="Enter bank account number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    name="bankDetails.ifscCode"
                    value={formData.bankDetails.ifscCode}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                    pattern="^[A-Z]{4}0[A-Z0-9]{6}$"
                    title="Please enter a valid IFSC code"
                    placeholder="Enter IFSC code"
                  />
                </div>

                {/* Bank Document Upload */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Bank Document
                  </label>
                  <div className="relative">
                    <div className="flex items-center justify-center w-full">
                      <label className={`w-full h-32 flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer
                        ${fileErrors.bankDocument ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PDF, PNG, JPG up to 5MB
                          </p>
                        </div>
                        <input
                          type="file"
                          name="bankDocument"
                          onChange={handleFileChange}
                          className="hidden"
                          accept={ALLOWED_FORMATS.join(',')}
                          required
                        />
                      </label>
                    </div>
                    {fileErrors.bankDocument && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {fileErrors.bankDocument}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || Object.values(fileErrors).some(error => error)}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Submit Verification'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ArtistVerification;