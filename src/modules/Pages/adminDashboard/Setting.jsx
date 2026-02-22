import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("personalDetails");
  const [activeSection, setActiveSection] = useState("Profile");

  const [profile, setProfile] = useState({
    name: "Admin Abdul",
    email: "admin@hsaacademy.com",
    profile_picture: null,
    phone: "0700 123 4567",
    address: "Admin Office, HSA Academy",
    country: "Nigeria",
    state: "Rivers",
    role: "Super Administrator", // typical admin field
    lastLogin: "February 22, 2026 08:15 AM WAT",
    password: "",
    confirmPassword: "",
  });

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const uploadImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setProfile({ ...profile, profile_picture: url });
      e.target.value = ""; // reset input
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "updatePassword" && profile.password !== profile.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // Here you would normally call an API to update profile / password
    alert("Admin profile updated successfully!");
  };

  return (
    <>
      <div className="bg-white px-6 py-4 mb-6">
        <h1 className="text-2xl font-medium mb-3">Admin Settings</h1>
        <p className="text-gray-500">
          <Link to="/admin" className="text-[#004aad] hover:underline">
            Dashboard
          </Link>{" "}
          &gt; Settings
        </p>
      </div>

      <div className="flex flex-col md:flex-row bg-gray-100">
        {/* Sidebar */}
        <div className="w-full md:w-1/5 bg-white md:mb-0 mb-6 h-fit p-4 rounded-lg shadow-sm">
          <ul className="space-y-2 text-gray-600">
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
            {/* You can add more later e.g. */}
            {/* <li className="cursor-pointer px-4 py-3 rounded-lg hover:text-[#004aad] hover:bg-gray-50">System Settings</li> */}
            {/* <li className="cursor-pointer px-4 py-3 rounded-lg hover:text-[#004aad] hover:bg-gray-50">Notifications</li> */}
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-4/5 bg-white p-6 rounded-lg md:ml-6 shadow-sm">
          {activeSection === "Profile" && (
            <div>
              <h2 className="text-xl font-medium mb-4">Admin Profile</h2>

              {/* Profile Picture */}
              <div className="mt-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                {profile.profile_picture ? (
                  <img
                    src={profile.profile_picture}
                    alt="Admin Profile"
                    className="w-28 h-28 rounded-full object-cover border-2 border-[#004aad]/30"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-[#004aad] flex items-center justify-center text-2xl font-bold text-white">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <button
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
                  <p className="text-sm text-gray-500 mt-1">JPG, PNG • Max 2MB</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="mt-8 flex space-x-8 border-b border-gray-200">
                <button
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
                {activeTab === "personalDetails" && (
                  <form className="space-y-6 max-w-3xl" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
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
                        <label className="block text-gray-700 font-medium mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleChange}
                          className="w-full p-3.5 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                          disabled // usually admin email is not changeable or verified separately
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
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
                        <label className="block text-gray-700 font-medium mb-2">
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
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
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
                        <label className="block text-gray-700 font-medium mb-2">
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
                        <label className="block text-gray-700 font-medium mb-2">
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

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Last Login: <span className="font-medium">{profile.lastLogin}</span>
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="mt-6 bg-linear-to-r from-[#004aad] to-blue-700 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                      Save Changes
                    </button>
                  </form>
                )}

                {activeTab === "updatePassword" && (
                  <form className="space-y-6 max-w-md" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
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
                      <label className="block text-gray-700 font-medium mb-2">
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
                      className="mt-6 bg-linear-to-r from-[#004aad] to-blue-700 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                      Update Password
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminSettings;