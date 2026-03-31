import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { getProfile, updateProfile, changePassword } from "../../../api/authApi";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("personalDetails");
  const [activeSection, setActiveSection] = useState("Profile");

  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    gender: "",
    country: "",
    profile_picture: null,
  });

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef(null);

  // ── Fetch profile on mount ──────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      setFetchLoading(true);
      setFetchError("");

      const applyProfile = (data) => {
        setProfile({
          first_name:      data.first_name      || "",
          last_name:       data.last_name       || "",
          email:           data.email           || "",
          phone_number:    data.phone_number    || "",
          date_of_birth:   data.date_of_birth   || "",
          gender:          data.gender          || "",
          country:         data.country         || "",
          profile_picture: data.profile_picture || null,
        });
      };

      try {
        const data = await getProfile();
        applyProfile(data);
      } catch (err) {
        console.error("Fetch profile error:", err);
        try {
          const stored = localStorage.getItem("user");
          if (stored) {
            applyProfile(JSON.parse(stored));
            setFetchError("Showing saved data. ");
          } else {
            setFetchError("Could not load profile. Please check your connection.");
          }
        } catch {
          setFetchError("Could not load profile. Please check your connection.");
        }
      } finally {
        setFetchLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ── Handlers ────────────────────────────────────────────────────
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleButtonClick = () => fileInputRef.current?.click();

  const uploadImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setProfile({ ...profile, profile_picture: url });
      e.target.value = "";
    }
  };

  const clearMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  // ── Submit: Personal Details ─────────────────────────────────────
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    clearMessages();
    setSubmitLoading(true);
    try {
      await updateProfile(profile);
      setSuccessMessage("Profile updated successfully!");
      setFetchError("");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to update profile. Please try again."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  // ── Submit: Change Password ──────────────────────────────────────
  const handleChangePassword = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!currentPassword) {
      setErrorMessage("Please enter your current password.");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("New password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setSubmitLoading(true);
    try {
      await changePassword({
        current_password: currentPassword,
        new_password:     password,
        confirm_password: confirmPassword,
      });
      setSuccessMessage("Password changed successfully!");
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to change password. Please try again."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  // ── Derived display values ───────────────────────────────────────
  const displayName = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "User";
  const initials = ((profile.first_name?.charAt(0) || "") + (profile.last_name?.charAt(0) || "")).toUpperCase() || "U";

  if (fetchLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#004aad]" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
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

              {/* Soft warning banner */}
              {fetchError && (
                <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
                  <span>⚠️ {fetchError}</span>
                  <button
                    onClick={() => window.location.reload()}
                    className="ml-4 text-yellow-800 underline text-xs font-medium whitespace-nowrap"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Profile Picture */}
              <div className="mt-2 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                {profile.profile_picture ? (
                  <img
                    src={profile.profile_picture}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#004aad] flex items-center justify-center text-xl font-bold text-white">
                    {initials}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-800 text-lg">{displayName}</p>
                  <p className="text-gray-400 text-sm mb-2">{profile.email}</p>
                  <button
                    onClick={handleButtonClick}
                    className="border px-4 py-2 text-[#004aad] rounded-lg border-[#004aad] text-sm hover:bg-blue-50 transition"
                  >
                    Change Picture
                  </button>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={uploadImage}
                  className="hidden"
                />
              </div>

              {/* Tabs */}
              <div className="mt-6 flex space-x-6 text-gray-500 border-b border-gray-200">
                <button
                  className={`pb-3 text-sm font-medium transition ${
                    activeTab === "personalDetails"
                      ? "border-b-2 border-[#004aad] text-[#004aad]"
                      : "hover:text-gray-700"
                  }`}
                  onClick={() => { setActiveTab("personalDetails"); clearMessages(); }}
                >
                  Personal Details
                </button>
                <button
                  className={`pb-3 text-sm font-medium transition ${
                    activeTab === "updatePassword"
                      ? "border-b-2 border-[#004aad] text-[#004aad]"
                      : "hover:text-gray-700"
                  }`}
                  onClick={() => { setActiveTab("updatePassword"); clearMessages(); }}
                >
                  Update Password
                </button>
              </div>

              {/* Feedback */}
              {successMessage && (
                <div className="mt-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm">
                  ✓ {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {errorMessage}
                </div>
              )}

              <div className="mt-6">

                {/* ── Personal Details ── */}
                {activeTab === "personalDetails" && (
                  <form className="space-y-4" onSubmit={handleUpdateProfile}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-2 text-sm font-medium">First Name</label>
                        <input
                          type="text"
                          name="first_name"
                          value={profile.first_name}
                          onChange={handleChange}
                          className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:border-[#004aad] transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2 text-sm font-medium">Last Name</label>
                        <input
                          type="text"
                          name="last_name"
                          value={profile.last_name}
                          onChange={handleChange}
                          className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:border-[#004aad] transition"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-2 text-sm font-medium">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleChange}
                          className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:border-[#004aad] transition"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2 text-sm font-medium">Phone Number</label>
                        <input
                          type="tel"
                          name="phone_number"
                          value={profile.phone_number}
                          onChange={handleChange}
                          className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:border-[#004aad] transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-2 text-sm font-medium">Date of Birth</label>
                        <input
                          type="date"
                          name="date_of_birth"
                          value={profile.date_of_birth}
                          onChange={handleChange}
                          className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:border-[#004aad] transition"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2 text-sm font-medium">Gender</label>
                        <select
                          name="gender"
                          value={profile.gender}
                          onChange={handleChange}
                          className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:border-[#004aad] transition bg-white"
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2 text-sm font-medium">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={profile.country}
                        onChange={handleChange}
                        className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:border-[#004aad] transition"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="mt-2 bg-[#004aad] text-white px-8 py-3 rounded-lg hover:bg-[#003a8c] transition font-medium flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {submitLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Update Profile"
                      )}
                    </button>
                  </form>
                )}

                {/* ── Change Password ── */}
                {activeTab === "updatePassword" && (
                  <form className="space-y-5 max-w-md" onSubmit={handleChangePassword}>

                    {/* Current Password */}
                    <div>
                      <label className="block text-gray-700 mb-2 text-sm font-medium">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrent ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full p-4 pr-12 border border-gray-300 rounded-lg outline-none focus:border-[#004aad] transition"
                          placeholder="Enter your current password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrent(!showCurrent)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                        >
                          {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-gray-700 mb-2 text-sm font-medium">New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full p-4 pr-12 border border-gray-300 rounded-lg outline-none focus:border-[#004aad] transition"
                          placeholder="At least 8 characters"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-gray-700 mb-2 text-sm font-medium">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showConfirm ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full p-4 pr-12 border border-gray-300 rounded-lg outline-none focus:border-[#004aad] transition"
                          placeholder="Re-enter new password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                        >
                          {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {confirmPassword.length > 0 && (
                        <p className={`text-xs mt-1 ${password === confirmPassword ? "text-emerald-600" : "text-red-500"}`}>
                          {password === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="mt-2 bg-[#004aad] text-white px-8 py-3 rounded-lg hover:bg-[#003a8c] transition font-medium flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {submitLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Changing Password...
                        </>
                      ) : (
                        "Change Password"
                      )}
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