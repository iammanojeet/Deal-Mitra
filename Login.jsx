import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Client, Account } from "appwrite";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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

  const handleSignup = (e) => {
    e.preventDefault();
    navigate("/signup");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!client) {
      setError(
        "Appwrite client is not initialized. Check environment variables."
      );
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    try {
      console.log("Logging in with:", { email, password });
      await account.createEmailPasswordSession(email, password);
      console.log("Login successful for:", { email });
      navigate("/searchpagev3");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Login error:", err);
      if (err.message.includes("invalid credentials")) {
        setError("Invalid email or password. Please try again.");
      } else if (err.message.includes("Rate limit")) {
        setError("Rate limit exceeded. Please try again after a few minutes.");
        setTimeout(() => setError(""), 5000);
      } else {
        setError(err.message || "An error occurred during login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = {
    container: {
      height: "100vh",
      width: "100%",
      background: "linear-gradient(to bottom right, #0f2027, #203a43, #2c5364)",
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
      cursor: "pointer",
    },
    error: {
      marginTop: "12px",
      fontSize: "14px",
      color: "red",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.container}>
      <style>
        {`
          input:focus {
            border-color: #06beb6;
            box-shadow: 0 0 0 2px rgba(6, 190, 182, 0.4);
          }

          button:hover {
            background: linear-gradient(to right, #48b1bf, #06beb6);
            transform: translateY(-1px);
          }
        `}
      </style>

      <div style={styles.formWrapper}>
        <h2 style={styles.heading}>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <i className="fas fa-envelope" style={styles.icon}></i>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <i className="fas fa-lock" style={styles.icon}></i>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={styles.input}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              ...styles.button,
              background: isSubmitting ? "#999" : styles.button.background,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>
        <p style={styles.backLink}>
          Don&apos;t have an account?{" "}
          <span style={styles.anchor} onClick={handleSignup}>
            Sign Up
          </span>
        </p>
        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;
