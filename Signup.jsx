import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Client, Account, Databases, ID } from "appwrite";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const envVars = {
    VITE_APPWRITE_URL: import.meta.env.VITE_APPWRITE_URL,
    VITE_APPWRITE_PROJECT_ID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    VITE_APPWRITE_DATABASE_ID: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    VITE_APPWRITE_COLLECTION_ID: import.meta.env.VITE_APPWRITE_COLLECTION_ID,
  };

  let client = null;
  if (envVars.VITE_APPWRITE_URL && envVars.VITE_APPWRITE_PROJECT_ID) {
    client = new Client()
      .setEndpoint(envVars.VITE_APPWRITE_URL)
      .setProject(envVars.VITE_APPWRITE_PROJECT_ID);
  } else {
    console.error("Missing required environment variables:", envVars);
  }

  const databases = client ? new Databases(client) : null;
  const account = client ? new Account(client) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!client) {
      setError(
        "Appwrite client is not initialized. Check environment variables."
      );
      return;
    }
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!email.trim() || !/^[^ ]+@[^ ]+\.[a-z]{2,3}$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    try {
      await account.create(ID.unique(), email, password, name);
      await databases.createDocument(
        envVars.VITE_APPWRITE_DATABASE_ID,
        envVars.VITE_APPWRITE_COLLECTION_ID,
        ID.unique(),
        { email, password, name }
      );
      navigate("/login");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setName("");
    } catch (err) {
      setError(err.message || "An error occurred during signup");
    }
  };

  const styles = {
    container: {
      height: "100vh",
      width: "100%",
      background: `linear-gradient(to bottom right, #0f2027, #203a43, #2c5364)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#fff",
    },
    formWrapper: {
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(16px)",
      borderRadius: "18px",
      padding: "2.5rem 2.5rem",
      boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
      maxWidth: "480px",
      width: "100%",
      animation: "fadeIn 0.9s ease-out",
      border: "1px solid rgba(255, 255, 255, 0.2)",
    },
    heading: {
      marginBottom: "24px",
      fontSize: "30px",
      fontWeight: "bold",
      textAlign: "center",
      color: "#FFF",
    },
    inputGroup: {
      position: "relative",
      margin: "16px 0",
    },
    icon: {
      position: "absolute",
      top: "50%",
      left: "14px",
      transform: "translateY(-50%)",
      color: "#aaa",
      fontSize: "14px",
      pointerEvents: "none",
    },
    input: {
      width: "100%",
      padding: "13px 13px 13px 42px",
      borderRadius: "10px",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      backgroundColor: "rgba(255, 255, 255, 0.06)",
      color: "#fff",
      fontSize: "15px",
      outline: "none",
      transition: "0.3s ease",
    },
    button: {
      width: "100%",
      padding: "14px",
      background: "linear-gradient(to right, #06beb6, #48b1bf)",
      border: "none",
      borderRadius: "10px",
      color: "#fff",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "20px",
      transition: "all 0.3s ease",
    },
    backLink: {
      marginTop: "22px",
      fontSize: "14px",
      textAlign: "center",
      color: "#ccc",
    },
    anchor: {
      color: "#ffffff",
      textDecoration: "underline",
      fontWeight: 500,
    },
    error: {
      color: "#ff4d4f",
      marginBottom: "10px",
      fontSize: "14px",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formWrapper}>
        <h2 style={styles.heading}>
          <i className="fas fa-store"></i> Create Your Account
        </h2>
        <form onSubmit={handleSubmit}>
          {error && <div style={styles.error}>{error}</div>}
          {[
            {
              icon: "fas fa-user",
              id: "name",
              type: "text",
              placeholder: "Full Name",
              value: name,
              onChange: setName,
            },
            {
              icon: "fas fa-envelope",
              id: "email",
              type: "email",
              placeholder: "Email Address",
              value: email,
              onChange: setEmail,
            },
            {
              icon: "fas fa-lock",
              id: "password",
              type: "password",
              placeholder: "Password",
              value: password,
              onChange: setPassword,
            },
            {
              icon: "fas fa-lock",
              id: "confirmPassword",
              type: "password",
              placeholder: "Confirm Password",
              value: confirmPassword,
              onChange: setConfirmPassword,
            },
          ].map(({ icon, id, type, placeholder, value, onChange }) => (
            <div style={styles.inputGroup} key={id}>
              <i className={icon} style={styles.icon}></i>
              <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          ))}
          <button type="submit" style={styles.button}>
            Register
          </button>
        </form>
        <p style={styles.backLink}>
          Already registered?{" "}
          <a href="/login" style={styles.anchor}>
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
