import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
} from "../../../api/setting";
import { notify } from "../../../utils/toast";
import { getImageUrl } from "../../../utils/imageHelper";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("personalDetails");
  const [activeSection, setActiveSection] = useState("Profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: "Admin Abdul",
    email: "admin@hsaacademy.com",
    profile_picture: null,
    phone: "0700 123 4567",
    address: "Admin Office, HSA Academy",
    country: "Nigeria",
    state: "Rivers",
    role: "Super Administrator",
    lastLogin: "",
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      const data = await getAdminProfile();

      if (!data) return;

      setProfile((prev) => ({
        ...prev,
        name: data?.name || prev.name,
        email: data?.email || prev.email,
        phone: data?.phone || prev.phone || "",
        profile_picture: data?.profile_picture || prev.profile_picture || null,
        role:
          typeof data?.role === "object"
            ? data?.role?.name || prev.role
            : data?.role || prev.role,
        lastLogin: data?.last_login
          ? new Date(data.last_login).toLocaleString()
          : prev.lastLogin,
      }));
    } catch (error) {
      console.error("Failed to fetch admin profile:", error);
      notify.error?.(
        error?.response?.data?.detail || "Failed to load admin profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const uploadImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);

      setProfile((prev) => ({
        ...prev,
        profile_picture: url,
      }));

      e.target.value = "";
      notify.success?.("Profile picture selected");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (activeTab === "personalDetails") {
        const payload = {
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
        };

        const response = await updateAdminProfile(payload);

        setProfile((prev) => ({
          ...prev,
          name: response?.name || prev.name,
          email: response?.email || prev.email,
          phone: response?.phone || prev.phone,
          role:
            typeof response?.role === "object"
              ? response?.role?.name || prev.role
              : response?.role || prev.role,
          lastLogin: response?.last_login
            ? new Date(response.last_login).toLocaleString()
            : prev.lastLogin,
        }));

        notify.success?.("Admin profile updated successfully");
      }

      if (activeTab === "updatePassword") {
        if (!profile.currentPassword) {
          notify.error?.("Current password is required");
          return;
        }

        if (profile.password.length < 8) {
          notify.error?.("New password must be at least 8 characters");
          return;
        }

        if (profile.password !== profile.confirmPassword) {
          notify.error?.("Passwords do not match");
          return;
        }

        await changeAdminPassword({
          current_password: profile.currentPassword,
          new_password: profile.password,
          confirm_password: profile.confirmPassword,
        });

        setProfile((prev) => ({
          ...prev,
          currentPassword: "",
          password: "",
          confirmPassword: "",
        }));

        notify.success?.("Password updated successfully");
      }
    } catch (error) {
      console.error("Admin settings update error:", error);
      notify.error?.(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  const profileImageSrc = profile.profile_picture
    ? getImageUrl(profile.profile_picture)
    : null;

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>

        <div className="mt-2 text-sm text-gray-600">
          <Link to="/admin" className="text-[#004aad] hover:underline">
            Dashboard
          </Link>{" "}
          &gt; Settings
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
              <ul className="space-y-2">
                <li
                  className={`cursor-pointer px-4 py-3 rounded-lg transition-colors duration-300 ${
                    activeSection === "Profile"
                      ? "font-medium text-white bg-[#004aad]"
                      : "hover:text-[#004aad] hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveSection("Profile")}
                >
                  Profile
                </li>

                {/* You can add more later */}
                {/* <li>System Settings</li> */}
                {/* <li>Notifications</li> */}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === "Profile" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-semibold text-gray-900">
                  Admin Profile
                </h2>

                {/* Profile Picture */}
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-5">
                  {profileImageSrc ? (
                    <img
                      src={profileImageSrc}
                      alt="Admin Profile"
                      className="w-28 h-28 rounded-full object-cover border-2 border-[#004aad]/30"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-[#004aad]/10 text-[#004aad] flex items-center justify-center text-3xl font-semibold border-2 border-[#004aad]/30">
                      {profile.name?.charAt(0)?.toUpperCase() || "A"}
                    </div>
                  )}

                  <div>
                    <button
                      type="button"
                      onClick={handleButtonClick}
                      className="border border-[#004aad] text-[#004aad] px-5 py-2.5 rounded-lg hover:bg-[#004aad]/10 transition"
                    >
                      Change Profile Picture
                    </button>

                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={uploadImage}
                      className="hidden"
                    />

                    <p className="mt-2 text-sm text-gray-500">
                      JPG, PNG • Max 2MB
                    </p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="mt-8 border-b border-gray-200 flex items-center gap-8">
                  <button
                    type="button"
                    className={`pb-3 px-1 font-medium transition-colors ${
                      activeTab === "personalDetails"
                        ? "border-b-2 border-[#004aad] text-[#004aad]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("personalDetails")}
                  >
                    Personal Details
                  </button>

                  <button
                    type="button"
                    className={`pb-3 px-1 font-medium transition-colors ${
                      activeTab === "updatePassword"
                        ? "border-b-2 border-[#004aad] text-[#004aad]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("updatePassword")}
                  >
                    Update Password
                  </button>
                </div>

                {/* Tab Content */}
                <div className="mt-8">
                  {loading ? (
                    <div className="text-gray-500">Loading profile...</div>
                  ) : (
                    <>
                      {activeTab === "personalDetails" && (
                        <form
                          className="space-y-6 max-w-3xl"
                          onSubmit={handleSubmit}
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={profile.name}
                              onChange={handleChange}
                              className="w-full p-3.5 border border-gray-300 rounded-lg outline-none"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={profile.email}
                              onChange={handleChange}
                              className="w-full p-3.5 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                              disabled
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={profile.phone}
                              onChange={handleChange}
                              className="w-full p-3.5 border border-gray-300 rounded-lg outline-none"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Role
                            </label>
                            <input
                              type="text"
                              name="role"
                              value={profile.role}
                              readOnly
                              className="w-full p-3.5 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Address
                            </label>
                            <input
                              type="text"
                              name="address"
                              value={profile.address}
                              onChange={handleChange}
                              className="w-full p-3.5 border border-gray-300 rounded-lg outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                State
                              </label>
                              <input
                                type="text"
                                name="state"
                                value={profile.state}
                                onChange={handleChange}
                                className="w-full p-3.5 border border-gray-300 rounded-lg outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Country
                              </label>
                              <input
                                type="text"
                                name="country"
                                value={profile.country}
                                onChange={handleChange}
                                className="w-full p-3.5 border border-gray-300 rounded-lg outline-none"
                              />
                            </div>
                          </div>

                          <div className="text-sm text-gray-500">
                            Last Login: {profile.lastLogin || "N/A"}
                          </div>

                          <button
                            type="submit"
                            disabled={saving}
                            className="mt-6 bg-linear-to-r from-[#004aad] to-blue-700 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-70"
                          >
                            {saving ? "Saving..." : "Save Changes"}
                          </button>
                        </form>
                      )}

                      {activeTab === "updatePassword" && (
                        <form
                          className="space-y-6 max-w-md"
                          onSubmit={handleSubmit}
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Current Password
                            </label>
                            <input
                              type="password"
                              name="currentPassword"
                              value={profile.currentPassword}
                              onChange={handleChange}
                              className="w-full p-3.5 border border-gray-300 rounded-lg outline-none"
                              required
                              placeholder="Enter current password"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              name="password"
                              value={profile.password}
                              onChange={handleChange}
                              className="w-full p-3.5 border border-gray-300 rounded-lg outline-none"
                              required
                              minLength={8}
                              placeholder="At least 8 characters"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              name="confirmPassword"
                              value={profile.confirmPassword}
                              onChange={handleChange}
                              className="w-full p-3.5 border border-gray-300 rounded-lg outline-none"
                              required
                              placeholder="Re-type password"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={saving}
                            className="mt-6 bg-linear-to-r from-[#004aad] to-blue-700 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-70"
                          >
                            {saving ? "Updating..." : "Update Password"}
                          </button>
                        </form>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSettings;
