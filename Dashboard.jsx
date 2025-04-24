import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Client, Account } from "appwrite";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const envVars = {
    VITE_APPWRITE_URL: import.meta.env.VITE_APPWRITE_URL,
    VITE_APPWRITE_PROJECT_ID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  };

  let client = null;
  if (envVars.VITE_APPWRITE_URL && envVars.VITE_APPWRITE_PROJECT_ID) {
    client = new Client()
      .setEndpoint(envVars.VITE_APPWRITE_URL)
      .setProject(envVars.VITE_APPWRITE_PROJECT_ID);
  } else {
    console.error("Missing required environment variables:", envVars);
  }

  const account = client ? new Account(client) : null;

  useEffect(() => {
    const fetchUser = async () => {
      if (!account) return;

      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user data. Please log in again.");
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    if (!account) return;
    try {
      console.log("Logout successful for user:", user.email);
      await account.deleteSession("current");
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      alert("Failed to log out. Please try again.");
    }
  };

  const [formData, setFormData] = useState({
    Name: "",
    age: "",
    contact_no: "",
    email: "",
  });

  const [avatarSeed, setAvatarSeed] = useState(() =>
    Math.random().toString(36).substring(7)
  );
  const generateRandomAvatar = () => {
    const newSeed = Math.random().toString(36).substring(7);
    setAvatarSeed(newSeed);
  };

  const [activeTab, setActiveTab] = useState("profileDetails");
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    console.log("Profile updated:", formData);
  };
  const handlePasswordChange = (e) =>
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    console.log("Password changed:", passwordData);
  };

  const handleTemporaryDelete = () => {
    if (!deletePassword) return alert("Please enter your password to confirm.");
    if (confirm("Are you sure you want to temporarily delete your account?")) {
      console.log(
        "Temporary account deletion triggered with password:",
        deletePassword
      );
    }
  };

  const handlePermanentDelete = () => {
    if (!deletePassword) return alert("Please enter your password to confirm.");
    if (
      confirm(
        "⚠️ This action is irreversible. Do you really want to permanently delete your account?"
      )
    ) {
      console.log(
        "Permanent account deletion triggered with password:",
        deletePassword
      );
    }
  };

  const renderMainContent = () => {
    if (activeTab === "profileDetails") {
      return (
        <div className="w-full xl:w-[500px] bg-white shadow-lg p-6 rounded-2xl transition-all">
          <div className="text-center mb-6">
            <img
              src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${avatarSeed}`}
              alt="Avatar"
              className="w-28 h-28 mx-auto rounded-full border-4 border-[#06AED5]"
            />
            <button
              type="button"
              onClick={generateRandomAvatar}
              className="mt-3 text-sm text-[#086788] underline hover:text-[#DD1C1A] transition"
            >
              Generate Random Avatar
            </button>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-5">
            {["Name", "Age", "Contact No.", "Email"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-semibold text-gray-700 capitalize mb-1">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AED5]"
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-[#06AED5] text-white py-2 rounded-lg font-semibold hover:bg-[#086788] transition"
            >
              Save Changes
            </button>
          </form>
        </div>
      );
    }

    if (activeTab === "changePassword") {
      return (
        <div className="w-full xl:w-[500px] bg-white shadow-lg p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-6 text-gray-800">
            Change Password
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-5">
            {[
              {
                label: "Old Password",
                name: "oldPassword",
                visible: showOldPassword,
                toggle: () => setShowOldPassword(!showOldPassword),
              },
              {
                label: "New Password",
                name: "newPassword",
                visible: showNewPassword,
                toggle: () => setShowNewPassword(!showNewPassword),
              },
              {
                label: "Confirm Password",
                name: "confirmPassword",
                visible: showConfirmPassword,
                toggle: () => setShowConfirmPassword(!showConfirmPassword),
              },
            ].map(({ label, name, visible, toggle }) => (
              <div className="relative" key={name}>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  {label}
                </label>
                <input
                  type={visible ? "text" : "password"}
                  name={name}
                  value={passwordData[name]}
                  onChange={handlePasswordChange}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AED5]"
                />
                <button
                  type="button"
                  onClick={toggle}
                  className="absolute right-3 top-9 text-gray-500"
                >
                  {visible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            ))}

            <button
              type="submit"
              className="w-full bg-[#F0C808] text-white py-2 rounded-lg font-semibold hover:bg-[#DD1C1A] transition"
            >
              Change Password
            </button>
          </form>
        </div>
      );
    }

    if (activeTab === "deleteAccount") {
      return (
        <div className="w-full xl:w-[500px] bg-white shadow-lg p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            Delete Account
          </h2>
          <p className="mb-4 text-gray-600">
            You can temporarily deactivate your account or permanently delete
            it. Please choose carefully.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AED5]"
                placeholder="Enter your password to confirm"
              />
            </div>

            <button
              onClick={handleTemporaryDelete}
              className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
            >
              Temporarily Delete Account
            </button>
            <button
              onClick={handlePermanentDelete}
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
            >
              Permanently Delete Account
            </button>
          </div>
        </div>
      );
    }

    return null;
  };
  if (activeTab === "logout") {
    return (
      <div className="w-full xl:w-[500px] bg-white shadow-lg p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Logout</h2>
        <p className="text-gray-600 mb-4">
          Are you sure you want to log out? You will be redirected to the login
          page.
        </p>
        <button
          onClick={() => {
            handleLogout();
          }}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF1D0] p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-[240px_1fr] gap-6">
          <aside className="bg-white p-6 rounded-2xl shadow-lg space-y-2">
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              Account Settings
            </h2>
            {[
              { label: "My Dashboard", tab: "profileDetails" },
              { label: "Change Password", tab: "changePassword" },
              { label: "Delete Account", tab: "deleteAccount" },
              { label: "Logout", tab: "logout" },
            ].map(({ label, tab }) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium transition ${
                  activeTab === tab
                    ? "bg-[#06AED5]/10 text-[#06AED5]"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </aside>

          <main className="min-h-[500px]">{renderMainContent()}</main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
