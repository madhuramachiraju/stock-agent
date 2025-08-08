'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, FaEnvelope, FaCalendar, FaEdit, FaSave, FaTimes,
  FaCamera, FaShieldAlt, FaChartLine, FaBookmark
} from 'react-icons/fa';
import Header from '@/components/Header';
import { useAuth } from '@/components/providers/AuthProvider';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    joinDate: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        bio: 'Passionate investor focused on technology and growth stocks.',
        location: 'San Francisco, CA',
        joinDate: 'January 2024'
      });
    }
  }, [user]);

  const handleSave = () => {
    // Here you would typically save to a database
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original data
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        bio: 'Passionate investor focused on technology and growth stocks.',
        location: 'San Francisco, CA',
        joinDate: 'January 2024'
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="text-gray-500 text-6xl mb-4">🔐</div>
            <h2 className="text-2xl font-bold text-white mb-4">Sign in to view your profile</h2>
            <p className="text-gray-400">Please sign in to access your profile settings</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Profile</h1>
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <FaEdit />
                  Edit Profile
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSave}
                    className="btn-primary flex items-center gap-2"
                  >
                    <FaSave />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <FaTimes />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="card">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                        <FaUser />
                      </div>
                    )}
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                        <FaCamera size={14} />
                      </button>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="text-xl font-bold text-white bg-transparent border-b border-gray-600 focus:border-blue-500 outline-none text-center w-full"
                    />
                  ) : (
                    <h2 className="text-xl font-bold text-white">{profileData.name}</h2>
                  )}
                  
                  <p className="text-gray-400 text-sm">{profileData.joinDate}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <FaEnvelope className="text-gray-400" />
                    <span className="text-sm">{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <FaCalendar className="text-gray-400" />
                    <span className="text-sm">Member since {profileData.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <div className="card">
                <h3 className="text-xl font-bold text-white mb-6">Profile Information</h3>
                
                <div className="space-y-6">
                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                    {isEditing ? (
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        rows={3}
                        className="input-field w-full"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-gray-300">{profileData.bio}</p>
                    )}
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        className="input-field w-full"
                        placeholder="Enter your location"
                      />
                    ) : (
                      <p className="text-gray-300">{profileData.location}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="card text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-2">12</div>
                  <div className="text-sm text-gray-400">Stocks in Portfolio</div>
                </div>
                <div className="card text-center">
                  <div className="text-2xl font-bold text-green-400 mb-2">8</div>
                  <div className="text-sm text-gray-400">Watchlist Items</div>
                </div>
                <div className="card text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-2">24</div>
                  <div className="text-sm text-gray-400">Days Active</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 