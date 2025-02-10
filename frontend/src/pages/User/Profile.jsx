import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import config from '../../configs/config';
import { FaCoins, FaUser, FaPhone, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';

export default function Profile() {
  const { user: authUser, token } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    address: '',
    profilePic: ''
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    
    if (!storedToken) {
      toast.error('Please login to view profile');
      navigate('/login');
      return;
    }

    fetchUserProfile(storedToken);
  }, []); // Remove token dependency to prevent infinite loops

  const fetchUserProfile = async (storedToken) => {
    try {
      const response = await axios.get(
        `${config.baseUrl}/api/users/me`,
        {
          headers: { 
            Authorization: `Bearer ${storedToken}`,
            'Cache-Control': 'no-cache'
          }
        }
      );
      
      if (!response.data) {
        throw new Error('No user data received');
      }
      setUser(response.data);
      setFormData({
        name: response.data.name || '',
        mobileNumber: response.data.mobileNumber || '',
        address: response.data.address || '',
        profilePic: response.data.profilePic || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.error('Session expired. Please login again');
        navigate('/login');
        return;
      }
      
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const storedToken = localStorage.getItem('token');
      const response = await axios.put(
        `${config.baseUrl}/api/users/${user?._id}`,
        {
          name: formData.name,
          mobileNumber: formData.mobileNumber,
          address: formData.address,
          profilePic: formData.profilePic || user?.profilePic // Include current profile pic
        },
        {
          headers: { Authorization: `Bearer ${storedToken}` }
        }
      );

      if (response.data) {
        setUser(response.data);
        setIsEditing(false);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const uploadImageToCloudinary = async (file) => {
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', config.UPLOAD_PRESET_PROFILE);
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
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const deleteOldImage = async (imageUrl) => {
    // Only attempt to delete if it's not the default image
    const defaultImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMggZhOIH1vXmnv0bCyBu8iEuYQO-Dw1kpp7_v2mwhw_SKksetiK0e4VWUak3pm-v-Moc&usqp=CAU";
    if (imageUrl && imageUrl !== defaultImage) {
      try {
        // Extract public_id from the URL
        const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
        
        // Make API call to delete the image
        await axios.post(
          `${config.baseUrl}/api/users/delete-image`,
          { public_id: publicId },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } catch (error) {
        console.error('Error deleting old image:', error);
        // Continue with the update even if deletion fails
      }
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      const imageUrl = await uploadImageToCloudinary(file);
      console.log(imageUrl);
      
      // Delete old image if exists
      if (user?.profilePic) {
        await deleteOldImage(user.profilePic);
      }

      // Update user profile with new image URL
      const response = await axios.put(
        `${config.baseUrl}/api/users/${user?._id}`,
        { ...formData, profilePic: imageUrl },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUser(response.data);
      setFormData(prev => ({
        ...prev,
        profilePic: imageUrl
      }));
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.error('Error updating profile picture:', error);
      toast.error('Failed to update profile picture');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header with Image */}
          <div className="relative h-32 bg-gradient-to-r from-pink-500 to-purple-500">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <img
                  src={formData.profilePic || user?.profilePic}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white object-cover"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-pink-600 rounded-full p-2 cursor-pointer hover:bg-pink-700 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    {uploadingImage ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white"></div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    )}
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'Welcome!'}</h1>
                <div className="flex items-center justify-center sm:justify-start mt-2">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                  <p className="ml-2 text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* SyncCoin Balance Card */}
            <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-yellow-900">Your Balance</p>
                  <p className="text-3xl font-bold text-white mt-1">{user?.SyncCoin || 0} SyncCoins</p>
                </div>
                <FaCoins className="h-12 w-12 text-yellow-100" />
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <FaUser className="h-5 w-5 text-gray-400 mr-2" />
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-lg ${
                    isEditing 
                      ? 'border-gray-300 focus:ring-pink-500 focus:border-pink-500' 
                      : 'border-transparent bg-gray-50'
                  } shadow-sm transition-all duration-200`}
                />
              </div>

              {/* Mobile Number Input */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <FaPhone className="h-5 w-5 text-gray-400 mr-2" />
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`mt-1 block w-full rounded-lg ${
                    isEditing 
                      ? 'border-gray-300 focus:ring-pink-500 focus:border-pink-500' 
                      : 'border-transparent bg-gray-50'
                  } shadow-sm transition-all duration-200`}
                />
              </div>

              {/* Address Input */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <FaMapMarkerAlt className="h-5 w-5 text-gray-400 mr-2" />
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="3"
                  className={`mt-1 block w-full rounded-lg ${
                    isEditing 
                      ? 'border-gray-300 focus:ring-pink-500 focus:border-pink-500' 
                      : 'border-transparent bg-gray-50'
                  } shadow-sm transition-all duration-200`}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        // Reset form data to current user data
                        setFormData({
                          name: user?.name || '',
                          mobileNumber: user?.mobileNumber || '',
                          address: user?.address || '',
                          profilePic: user?.profilePic || ''
                        });
                      }}
                      className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-200"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-200"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
