"use client"
import React from "react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Modal from "../Modal";
import 'react-toastify/dist/ReactToastify.css';
import "./Login.css"
import { set } from "react-hook-form";

const Login = ({modalOpen,closeModal}: {modalOpen: boolean, closeModal: () => void}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
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
      toast.success("Login successful",{
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
      closeModal();
      console.log("response:", response.data);
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
        <h2>Login</h2>
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
        <button type="submit">Login</button>
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
