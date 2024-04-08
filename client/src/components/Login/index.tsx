"use client";
import React from "react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Modal from "../Modal";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";
import { UploadButton } from "../../utils/uploadthing";
import { set } from "react-hook-form";

const Login = ({
  modalOpen,
  closeModal,
}: {
  modalOpen: boolean;
  closeModal: () => void;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginSignup, setLoginSignup] = useState<"login" | "signup">("login");
  const [userName, setUserName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [fullname, setFullname] = useState("");
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      if(loginSignup === "login"){
        const authData = {
          email,
          password,
        };
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          authData
        );
        if (response?.data) {
          localStorage.setItem(
            "common-auth",
            response?.data?.authentication?.sessionToken
          );
          localStorage.setItem("username", response?.data?.username);
          localStorage.setItem("profilePicture", response?.data?.profilePicture);
        }
        window.location.reload();
        closeModal();

      }
      else{
        const authData = {
          email,
          password,
          username: userName,
          fullname,
          profilePicture,
        };
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
          authData
        );
        // if (response?.data) {
        //   localStorage.setItem(
        //     "common-auth",
        //     response?.data?.authentication?.sessionToken
        //   );
        //   localStorage.setItem("username", response?.data?.username);
        //   localStorage.setItem("profilePicture", response?.data?.profilePicture);
        // }
        toast.success("Signup successful", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.response?.data?.message || "An error occurred", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };
  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  return (
    <Modal isOpen={modalOpen} onRequestClose={closeModal}>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{loginSignup === "login" ? "Login" : "Signup"}</h2>
        <div>
          <label>Email:</label>
          <input
            type="email"
            required
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            required
            onChange={handlePasswordChange}
          />
        </div>
        {loginSignup === "signup" && (
          <>
            <div>
              <label>Full-Name:</label>
              <input
                type="text"
                value={fullname}
                required
                onChange={(e) => setFullname(e.target.value)}
              />
            </div>
            <div>
              <label>Username:</label>
              <input
                type="text"
                value={userName}
                required
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="upload-photo">
              <UploadButton
                className="upload-button"
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  console.log("Files: ", res[0].url);
                  setProfilePicture(res[0].url);
                }}
                onUploadError={(error: Error) => {
                  alert(`ERROR! ${error.message}`);
                }}
              />
            </div>
          </>
        )}
        <button type="submit" className="auth-button" disabled={loading}>
          {loginSignup === "login" ? "Login" : "Signup"}
        </button>
        <span className="signup-button">
          {loginSignup === "login" ? (
            <>
              Don't have an account?{" "}
              <p
                style={{ textDecoration: "underline" }}
                onClick={() => setLoginSignup("signup")}
              >
                Register
              </p>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <p
                style={{ textDecoration: "underline" }}
                onClick={() => setLoginSignup("login")}
              >
                Login
              </p>
            </>
          )}
        </span>
      </form>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Modal>
  );
};

export default Login;
