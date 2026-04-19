import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  getAdminProfile, 
  updateAdminProfile, 
  changeAdminPassword 
} from "../../../api/setting";
import { notify } from "../../../utils/toast";
import { getImageUrl } from "../../../utils/imageHelper";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("personalDetails");
  const [activeSection, setActiveSection] = useState("Profile");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    country: "Nigeria",
    state: "",
    role: "",
    last_login: "",
    profile_picture: null,
  });

  const fileInputRef = useRef(null);

  // Load profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await getAdminProfile();
    
        if (data) {
          setProfile({
            id: data.id || "",
            name: data.name || "Admin",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
            state: data.state || "",
            country: data.country || "Nigeria",
            role: data.role?.name || data.role || "Administrator",
            last_login: data.last_login 
              ? new Date(data.last_login).toLocaleString('en-US', { 
                  month: 'long', day: 'numeric', year: 'numeric', 
                  hour: 'numeric', minute: '2-digit', hour12: true 
                }) + " WAT"
              : "Never",
            profile_picture: data.profile_picture || null,
          });
        } else {
          // Keep default empty values - user can still fill and save
          notify.info("Profile details will load once backend endpoint is ready.");
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        notify.error("File size must be less than 2MB");
        return;
      }
      const url = URL.createObjectURL(file);
      setProfile({ ...profile, profile_picture: url });
      // You can call uploadProfilePicture(file) here if you want immediate upload
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (activeTab === "personalDetails") {
        const payload = {
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          // Add address, state, country if your backend accepts them
        };

        await updateAdminProfile(payload);
        notify.success("Profile updated successfully!");
      } 
      else if (activeTab === "updatePassword") {
        if (profile.password !== profile.confirmPassword) {
          notify.error("Passwords do not match!");
          setSaving(false);
          return;
        }

        await changeAdminPassword({
          current_password: profile.currentPassword || "", // Add this field if needed
          new_password: profile.password,
          confirm_password: profile.confirmPassword,
        });

        notify.success("Password updated successfully!");
        
        // Clear password fields
        setProfile(prev => ({
          ...prev,
          password: "",
          confirmPassword: "",
          currentPassword: ""
        }));
      }
    } catch (error) {
      console.error("Update failed:", error);
      const message = error.response?.data?.message || "Failed to update. Please try again.";
      notify.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="bg-white px-6 py-4 mb-6">
        <h1 className="text-2xl font-medium mb-3">Admin Settings</h1>
        <p className="text-gray-500">
          <Link to="/admin" className="text-[#004aad] hover:underline">Dashboard</Link> &gt; Settings
        </p>
      </div>

      <div className="flex flex-col md:flex-row bg-gray-100">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-1/5 bg-white md:mb-0 mb-6 h-fit p-4 rounded-lg shadow-sm">
          <ul className="space-y-2 text-gray-600">
            <li
              className={`cursor-pointer px-4 py-3 rounded-lg transition-colors duration-300 ${
                activeSection === "Profile" ? "font-medium text-white bg-[#004aad]" : "hover:text-[#004aad] hover:bg-gray-50"
              }`}
              onClick={() => setActiveSection("Profile")}
            >
              Profile
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-4/5 bg-white p-6 rounded-lg md:ml-6 shadow-sm">
          {activeSection === "Profile" && (
            <div>
              <h2 className="text-xl font-medium mb-6">Admin Profile</h2>

              {/* Profile Picture */}
              <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
                {profile.profile_picture ? (
                  <img
                    src={getImageUrl(profile.profile_picture)}
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-[#004aad] flex items-center justify-center text-4xl font-bold text-white shadow-md">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : "A"}
                  </div>
                )}

                <div>
                  <button
                    type="button"
                    onClick={handleButtonClick}
                    className="border border-[#004aad] text-[#004aad] px-6 py-3 rounded-lg hover:bg-[#004aad]/10 transition font-medium"
                  >
                    Change Profile Picture
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-500 mt-2">JPG or PNG • Maximum 2MB</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex space-x-10 border-b border-gray-200 mb-8">
                <button
                  className={`pb-4 px-1 font-medium text-lg transition-colors ${
                    activeTab === "personalDetails" ? "border-b-2 border-[#004aad] text-[#004aad]" : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("personalDetails")}
                >
                  Personal Details
                </button>
                <button
                  className={`pb-4 px-1 font-medium text-lg transition-colors ${
                    activeTab === "updatePassword" ? "border-b-2 border-[#004aad] text-[#004aad]" : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("updatePassword")}
                >
                  Change Password
                </button>
              </div>

              {/* Forms */}
              <form onSubmit={handleSubmit} className="max-w-3xl">
                {activeTab === "personalDetails" && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={profile.name}
                          onChange={handleChange}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004aad] outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleChange}
                          className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50 cursor-not-allowed"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={profile.phone}
                          onChange={handleChange}
                          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004aad] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Role</label>
                        <input
                          type="text"
                          value={profile.role}
                          readOnly
                          className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={profile.address}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004aad] outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="mt-8 bg-gradient-to-r from-[#004aad] to-blue-700 text-white px-10 py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-70"
                    >
                      {saving ? "Saving Changes..." : "Save Changes"}
                    </button>
                  </div>
                )}

                {activeTab === "updatePassword" && (
                  <div className="space-y-8 max-w-md">
                    {/* Add current password field if your API requires it */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">New Password</label>
                      <input
                        type="password"
                        name="password"
                        value={profile.password || ""}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004aad] outline-none"
                        placeholder="Minimum 8 characters"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={profile.confirmPassword || ""}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#004aad] outline-none"
                        placeholder="Re-enter new password"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="mt-8 bg-gradient-to-r from-[#004aad] to-blue-700 text-white px-10 py-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-70"
                    >
                      {saving ? "Updating Password..." : "Update Password"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminSettings;