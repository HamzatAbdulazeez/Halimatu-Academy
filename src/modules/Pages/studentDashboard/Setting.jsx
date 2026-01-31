import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("personalDetails");
  const [activeSection, setActiveSection] = useState("Profile");

  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    profile_picture: null,
    phone: "0700 000 0000",
    address: "123 Main Street",
    country: "Nigeria",
    state: "Lagos",
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
      e.target.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "updatePassword" && profile.password !== profile.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Profile updated successfully!");
  };

  return (
    <>
      <div className="bg-white px-6 py-4 mb-6">
        <h1 className="text-2xl font-medium mb-3">Settings</h1>
        <p className="text-gray-500">
          <Link to="/student" className="text-[#004aad] hover:underline">
            Dashboard
          </Link>{" "}
          &gt; Settings
        </p>
      </div>

      <div className="flex flex-col md:flex-row bg-gray-100">
        {/* Sidebar */}
        <div className="w-full md:w-1/5 bg-white md:mb-0 mb-6 h-fit p-4 rounded-lg">
          <ul className="space-y-2 text-gray-600">
            <li
              className={`cursor-pointer px-4 py-3 rounded-lg transition-colors duration-300 ${
                activeSection === "Profile"
                  ? "font-medium text-white bg-[#004aad]"
                  : "hover:text-[#004aad]"
              }`}
              onClick={() => setActiveSection("Profile")}
            >
              Profile
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-4/5 bg-white p-6 rounded-lg md:ml-6">
          {activeSection === "Profile" && (
            <div>
              <h2 className="text-xl font-medium mb-4">Profile</h2>

              {/* Profile Picture */}
              <div className="mt-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                {profile.profile_picture ? (
                  <img
                    src={profile.profile_picture}
                    alt="Profile"
                    className="w-24 h-24 rounded-full"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-white">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <button
                  onClick={handleButtonClick}
                  className="border px-4 py-2 text-[#004aad] rounded-lg border-[#004aad]"
                >
                  Change Picture
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={uploadImage}
                  className="hidden"
                />
              </div>

              {/* Tabs */}
              <div className="mt-6 flex space-x-6 text-gray-500">
                <button
                  className={`pb-2 ${
                    activeTab === "personalDetails"
                      ? "border-b-2 border-[#004aad] text-[#004aad]"
                      : ""
                  }`}
                  onClick={() => setActiveTab("personalDetails")}
                >
                  Personal Details
                </button>
                <button
                  className={`pb-2 ${
                    activeTab === "updatePassword"
                      ? "border-b-2 border-[#004aad] text-[#004aad]"
                      : ""
                  }`}
                  onClick={() => setActiveTab("updatePassword")}
                >
                  Update Password
                </button>
              </div>

              {/* Tab Content */}
              <div className="mt-6">
                {activeTab === "personalDetails" && (
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={profile.phone}
                          onChange={handleChange}
                          className="w-full p-4 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleChange}
                          className="w-full p-4 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={profile.address}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-2">State</label>
                        <input
                          type="text"
                          name="state"
                          value={profile.state}
                          onChange={handleChange}
                          className="w-full p-4 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Country</label>
                        <input
                          type="text"
                          name="country"
                          value={profile.country}
                          onChange={handleChange}
                          className="w-full p-4 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="mt-4 bg-gradient text-white px-6 py-2 rounded-lg"
                    >
                      Update Profile
                    </button>
                  </form>
                )}

                {activeTab === "updatePassword" && (
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={profile.password}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={profile.confirmPassword}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="mt-4 bg-gradient text-white px-6 py-2 rounded-lg"
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

export default Settings;
