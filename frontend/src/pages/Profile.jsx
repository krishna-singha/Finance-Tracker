import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiEndpoints, fetchWithAuth } from "../utils/api";
import {
  FaUser,
  FaEnvelope,
  FaEdit,
  FaSave,
  FaTimes,
  FaSpinner,
  FaSignOutAlt,
} from "react-icons/fa";

const Profile = () => {
  const { user, token, fetchUserProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth(apiEndpoints.profile, {
        method: "PUT",
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        await fetchUserProfile(); // Refresh user data
        setIsEditing(false);
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileData({
      name: user?.name || "",
      email: user?.email || "",
    });
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Profile Settings
            </h1>
            <p className="text-gray-300">Manage your account information</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className={`w-full p-4 bg-slate-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                    isEditing ? "border-purple-500" : "border-slate-600"
                  }`}
                />
              ) : (
                <div className="w-full p-4 bg-slate-700/30 border border-slate-600 rounded-lg text-white">
                  {profileData.name || "Not provided"}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="w-full p-4 bg-slate-700/30 border border-slate-600 rounded-lg text-gray-400">
                {profileData.email || "Not provided"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Member Since
              </label>
              <div className="w-full p-4 bg-slate-700/30 border border-slate-600 rounded-lg text-gray-400">
                {user && user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Unknown"}
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <FaTimes />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaEdit />
                  Edit Profile
                </button>
              )}
            </div>
            <div className="w-full">
              <button
                onClick={handleLogout}
                className="hidden w-full md:flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                <FaSignOutAlt />
                <span className="hidden lg:block">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
