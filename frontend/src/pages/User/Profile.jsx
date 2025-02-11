import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import config from '../../configs/config';
import { FaCoins, FaUser, FaPhone, FaMapMarkerAlt, FaEnvelope, FaCamera, FaEdit } from 'react-icons/fa';

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
      console.log(response.data);
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
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Sidebar - Profile Info */}
            <div className="w-full md:w-1/3 bg-pink-300 p-8 text-center md:text-left">
              <div className="flex flex-col items-center md:items-start">
                {/* Profile Picture */}
                <div className="relative mb-6">
                  <img
                    src={formData.profilePic || user?.profilePic}
                    alt="Profile"
                    className="w-40 h-40 rounded-full border-4 border-white shadow-xl object-cover"
                  />
                  {isEditing && (
                    <label className="absolute bottom-2 right-2 bg-white rounded-full p-2.5 cursor-pointer hover:bg-gray-100 transition-all duration-300 shadow-lg">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                      {uploadingImage ? (
                        <div className="animate-spin h-5 w-5 border-2 border-rose-400 rounded-full border-t-transparent"></div>
                      ) : (
                        <FaCamera className="h-4 w-4 text-rose-400" />
                      )}
                    </label>
                  )}
                </div>

                {/* Name - Now with constrained width */}
                <div className="w-full max-w-[300px]">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full text-3xl font-bold text-gray-800 mb-2 bg-white rounded-lg px-3 py-1 border border-gray-300 focus:ring-2 focus:ring-rose-400 focus:border-rose-400"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{user?.name || 'Welcome!'}</h1>
                  )}
                </div>
                
                {/* Edit Profile Button */}
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 flex items-center justify-center px-4 py-2 bg-white text-rose-400 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <FaEdit className="mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Right Content Area */}
            <div className="w-full md:w-2/3 p-8">
              {/* SyncCoin Card */}
              <div className="bg-pink-300 rounded-xl p-6 text-white shadow-lg mb-8">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white text-sm">SyncCoin Balance</p>
                    <p className="text-3xl font-bold mt-1">{user?.SyncCoin || 0}</p>
                  </div>
                  <div className="bg-white/10 rounded-full p-3">
                    <FaCoins className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>

              {/* Profile Details Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field - Read Only */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FaEnvelope className="h-4 w-4 text-gray-400 mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border-transparent"
                  />
                </div>

                {/* Mobile Number Field - Editable */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FaPhone className="h-4 w-4 text-gray-400 mr-2" />
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      isEditing 
                        ? 'border-gray-300 focus:ring-2 focus:ring-rose-400 focus:border-rose-400' 
                        : 'bg-gray-50 border-transparent'
                    } transition-all duration-200`}
                  />
                </div>

                {/* Address Field - Editable */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FaMapMarkerAlt className="h-4 w-4 text-gray-400 mr-2" />
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="3"
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      isEditing 
                        ? 'border-gray-300 focus:ring-2 focus:ring-rose-400 focus:border-rose-400' 
                        : 'bg-gray-50 border-transparent'
                    } transition-all duration-200`}
                  />
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user?.name || '',
                          mobileNumber: user?.mobileNumber || '',
                          address: user?.address || '',
                          profilePic: user?.profilePic || ''
                        });
                      }}
                      className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-rose-400 text-white rounded-lg hover:bg-rose-500 transition-all duration-200"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
