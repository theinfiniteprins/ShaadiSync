import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import config from '../../configs/config';
import { FaUser, FaPhone, FaMapMarkerAlt, FaEnvelope, FaCamera, FaEdit, FaPalette, FaBriefcase, FaLock } from 'react-icons/fa';

export default function ArtistProfile() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    artistType: '',
    address: '',
    profilePic: '',
    description: '',
    isVerified: false
  });
  const [artistTypes, setArtistTypes] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('artistToken');
    
    if (!storedToken) {
      toast.error('Please login to view profile');
      navigate('/artist/login');
      return;
    }

    fetchArtistProfile(storedToken);
  }, []);

  const fetchArtistType = async (typeId) => {
    try {
      const response = await axios.get(`${config.baseUrl}/api/artist-types/${typeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching artist type:', error);
      return null;
    }
  };

  const fetchArtistProfile = async (storedToken) => {
    try {
      const response = await axios.get(
        `${config.baseUrl}/api/artists/me`,
        {
          headers: { 
            Authorization: `Bearer ${storedToken}`,
            'Cache-Control': 'no-cache'
          }
        }
      );

      if (!response.data) {
        throw new Error('No artist data received');
      }

      let artistTypeDetails = null;
      if (response.data.artistType) {
        artistTypeDetails = await fetchArtistType(response.data.artistType);
      }

      setArtist(response.data);
      setFormData({
        name: response.data.name || '',
        mobileNumber: response.data.mobileNumber || '',
        address: response.data.address || '',
        profilePic: response.data.profilePic || '',
        artistType: response.data.artistType || '',
        description: response.data.description || '',
        isVerified: response.data.isVerified || false
      });

      if (artistTypeDetails) {
        setArtistTypes(prevTypes => ({
          ...prevTypes,
          [response.data.artistType]: artistTypeDetails
        }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('artistToken');
        toast.error('Session expired. Please login again');
        navigate('/artist/login');
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
      const storedToken = localStorage.getItem('artistToken');
      const response = await axios.put(
        `${config.baseUrl}/api/artists/${artist?._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${storedToken}` }
        }
      );

      if (response.data) {
        setArtist(response.data);
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
    const defaultImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMggZhOIH1vXmnv0bCyBu8iEuYQO-Dw1kpp7_v2mwhw_SKksetiK0e4VWUak3pm-v-Moc&usqp=CAU";
    if (imageUrl && imageUrl !== defaultImage) {
      try {
        const storedToken = localStorage.getItem('artistToken');
        const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];
        
        await axios.post(
          `${config.baseUrl}/api/artists/delete-image`,
          { public_id: publicId },
          {
            headers: { Authorization: `Bearer ${storedToken}` }
          }
        );
      } catch (error) {
        console.error('Error deleting old image:', error);
      }
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      setUploadingImage(true);
      const storedToken = localStorage.getItem('artistToken');

      // First upload new image
      const imageUrl = await uploadImageToCloudinary(file);

      // Then delete old image if it exists
      if (artist?.profilePic) {
        await deleteOldImage(artist.profilePic);
      }

      // Update profile with new image
      const response = await axios.put(
        `${config.baseUrl}/api/artists/${artist?._id}`,
        { ...formData, profilePic: imageUrl },
        {
          headers: { Authorization: `Bearer ${storedToken}` }
        }
      );

      if (response.data) {
        setArtist(response.data);
        setFormData(prev => ({
          ...prev,
          profilePic: imageUrl
        }));
        toast.success('Profile picture updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
  
    const loadingToast = toast.loading('Updating password...', {
      style: {
        background: '#fff',
        color: '#333',
        padding: '16px',
        borderRadius: '10px',
      }
    });
  
    try {
      const storedToken = localStorage.getItem('artistToken');
      await axios.put(
        `${config.baseUrl}/api/artists/change-password`,
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: { Authorization: `Bearer ${storedToken}` }
        }
      );
  
      toast.success('Password updated successfully', {
        id: loadingToast,
        duration: 3000,
        style: {
          background: '#10B981',
          color: 'white',
          padding: '16px',
          borderRadius: '10px',
        }
      });
      setShowPasswordModal(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password', {
        id: loadingToast,
        duration: 4000,
        style: {
          background: '#EF4444',
          color: 'white',
          padding: '16px',
          borderRadius: '10px',
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row">
            {/* Left Sidebar - Profile Info */}
            <div className="w-full md:w-1/3 bg-blue-600 p-8 text-center md:text-left">
              <div className="flex flex-col items-center md:items-start">
                {/* Profile Picture with Verification Badge */}
                <div className="relative mb-6">
                  <img
                    src={formData.profilePic || artist?.profilePic}
                    alt="Profile"
                    className="w-40 h-40 rounded-full border-4 border-white shadow-xl object-cover"
                  />
                  {artist?.isVerified && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
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
                        <div className="animate-spin h-5 w-5 border-2 border-blue-600 rounded-full border-t-transparent"></div>
                      ) : (
                        <FaCamera className="h-4 w-4 text-blue-600" />
                      )}
                    </label>
                  )}
                </div>

                <div className="w-full max-w-[300px] text-white">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full text-2xl font-bold mb-2 bg-white/10 text-white rounded-lg px-3 py-1 border border-white/20 focus:ring-2 focus:ring-white/50 focus:border-transparent placeholder-white/50"
                      placeholder="Enter your name"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold mb-2">{artist?.name}</h1>
                  )}
                  <p className="text-blue-100 mb-2">
                    {artistTypes[artist?.artistType]?.type || 'Unknown Artist'}
                  </p>
                  <div className="flex items-center justify-center md:justify-start">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      artist?.isVerified 
                        ? 'bg-green-500 text-white' 
                        : 'bg-yellow-500 text-white'
                    }`}>
                      {artist?.isVerified ? 'Verified Artist' : 'Pending Verification !!'}
                    </span>
                  </div>
                </div>

                {!isEditing && (
                  <div className="flex flex-col gap-2 mt-4">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center justify-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <FaEdit className="mr-2" />
                      Edit Profile
                    </button>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="flex items-center justify-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <FaLock className="mr-2" />
                      Change Password
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Content Area */}
            <div className="w-full md:w-2/3 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field - Read Only */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FaEnvelope className="h-4 w-4 text-gray-400 mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={artist?.email || ''}
                    disabled
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border-transparent"
                  />
                </div>

                {/* Mobile Number Field */}
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
                    className={inputClassName(isEditing)}
                  />
                </div>

                {/* Artist Type Field */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FaPalette className="h-4 w-4 text-gray-400 mr-2" />
                    Artist Type
                  </label>
                  <input
                    type="text"
                    value={artistTypes[formData.artistType]?.type || ''}
                    disabled
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border-transparent"
                  />
                </div>

                {/* Description Field */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FaUser className="h-4 w-4 text-gray-400 mr-2" />
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="2"
                    className={inputClassName(isEditing)}
                  />
                </div>

                {/* Address Field */}
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
                    className={inputClassName(isEditing)}
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
                          name: artist?.name || '',
                          mobileNumber: artist?.mobileNumber || '',
                          address: artist?.address || '',
                          profilePic: artist?.profilePic || '',
                          artistType: artist?.artistType || '',
                          description: artist?.description || '',
                        });
                      }}
                      className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
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
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {/* Current Password */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <FaLock className="h-4 w-4 text-gray-400 mr-2" />
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.old ? "text" : "password"}
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      oldPassword: e.target.value
                    }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, old: !prev.old }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPasswords.old ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <FaLock className="h-4 w-4 text-gray-400 mr-2" />
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      newPassword: e.target.value
                    }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPasswords.new ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <FaLock className="h-4 w-4 text-gray-400 mr-2" />
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      confirmPassword: e.target.value
                    }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPasswords.confirm ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Utility function for input styling
const inputClassName = (isEditing) => `
  w-full px-4 py-2.5 rounded-lg border 
  ${isEditing 
    ? 'border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400' 
    : 'bg-gray-50 border-transparent'
  }
`;
