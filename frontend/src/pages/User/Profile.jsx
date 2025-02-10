import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import config from '../../configs/config';
import { FaCoins, FaUser, FaPhone, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';

export default function Profile() {
  const { user: authUser, token } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    address: '',
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `${config.baseUrl}/api/users/me`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setUser(response.data);
      setFormData({
        name: response.data.name || '',
        mobileNumber: response.data.mobileNumber || '',
        address: response.data.address || '',
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${config.baseUrl}/api/users/${user?._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setUser(response.data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
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
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-8 sm:px-10">
            <div className="flex flex-col sm:flex-row items-center">
              <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-pink-600 shadow-lg">
                {user?.name?.charAt(0)?.toUpperCase() || <FaUser className="h-12 w-12 text-pink-600" />}
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-white">{user?.name || 'Welcome!'}</h1>
                <div className="flex items-center justify-center sm:justify-start mt-2">
                  <FaEnvelope className="h-5 w-5 text-pink-200" />
                  <p className="ml-2 text-pink-100">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* SyncCoin Balance Card */}
          <div className="px-6 py-6 sm:px-10">
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-6 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-yellow-900">Your Balance</p>
                <p className="text-3xl font-bold text-white mt-1">{user?.SyncCoin || 0} SyncCoins</p>
              </div>
              <FaCoins className="h-12 w-12 text-yellow-100" />
            </div>
          </div>

          {/* Profile Form */}
          <div className="px-6 py-6 sm:px-10">
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
                      onClick={() => setIsEditing(false)}
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
