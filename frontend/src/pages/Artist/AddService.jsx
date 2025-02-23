import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUpload, FaArrowLeft, FaTrash } from 'react-icons/fa';
import config from '../../configs/config';

const AddService = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Add new files to existing ones
    setSelectedImages(prev => [...prev, ...files]);

    // Create preview URLs for new files
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);
  };

  // Add function to remove individual images
  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => {
      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', config.UPLOAD_PRESET_SERVICE);
    formData.append('cloud_name', config.CLOUD_NAME);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${config.CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error('Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('artistToken');
      
      // Upload images to Cloudinary first
      setUploadingImages(true);
      const uploadedUrls = await Promise.all(
        selectedImages.map(image => uploadImageToCloudinary(image))
      );
      setUploadingImages(false);

      // Create service with uploaded image URLs
      const serviceData = {
        ...formData,
        photos: uploadedUrls
      };

      await axios.post(
        `${config.baseUrl}/api/services/`,
        serviceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      navigate('/artist/services');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create service');
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            <span className="text-sm font-medium">Back to Services</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-800 ml-auto mr-auto">
            Create New Service
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Image Upload Section */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Service Images
              </h2>
              <span className="text-sm text-gray-500">
                {selectedImages.length} images selected
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {previewImages.map((preview, index) => (
                <div key={index} className="relative group aspect-square">
                  <div className="w-full h-full rounded-xl overflow-hidden shadow-md">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
              
              {/* Always show upload button */}
              <label className="aspect-square rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors flex flex-col items-center justify-center cursor-pointer">
                <FaUpload className="text-blue-500 text-2xl mb-2" />
                <span className="text-sm text-blue-600 font-medium">Add More Photos</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            
            {selectedImages.length > 0 && (
              <p className="text-sm text-gray-500 mt-4">
                * First image will be used as the cover image
              </p>
            )}
          </div>

          {/* Service Details Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Service Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="Enter service name"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="Enter price"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                  placeholder="Describe your service..."
                  required
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || uploadingImages}
                className={`
                  w-full py-4 rounded-xl text-white font-semibold text-sm
                  ${(loading || uploadingImages)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                  }
                  transition-colors shadow-lg shadow-blue-200
                `}
              >
                {uploadingImages ? 'Uploading Images...' : loading ? 'Creating Service...' : 'Create Service'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddService;
