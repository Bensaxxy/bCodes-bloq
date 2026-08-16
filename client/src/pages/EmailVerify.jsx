import React, { useContext, useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContaxt";
import { toast } from "react-toastify";
import axios from "axios";

const EmailVerify = () => {
  const navigate = useNavigate();
  const { backendUrl, user, setUser, isLoggedin } = useContext(AppContent);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);

    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) return;

    const newOtp = [...otp];

    pastedData.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-account",
        {
          otp: enteredOtp,
        },
      );

      if (data.success) {
        toast.success(data.message);

        // Update user verification state
        if (user) {
          setUser({
            ...user,
            isAccountVerified: true,
          });
        }

        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  useEffect(() => {
    isLoggedin && user && user.isAccountVerified && navigate("/");
  }, [isLoggedin, user]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-200 to-purple-400 px-4">
      {/* Logo */}
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 top-5 w-28 cursor-pointer sm:left-20 sm:w-32"
      />

      {/* Form */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-md rounded-lg bg-slate-900 p-8 text-sm shadow-xl"
      >
        <h1 className="mb-2 text-center text-2xl font-semibold text-white">
          Email Verify OTP
        </h1>

        <p className="mb-8 text-center text-indigo-300">
          Enter the 6-digit code sent to your email.
        </p>

        {/* OTP Inputs */}
        <div
          className="mb-8 flex justify-center gap-2 sm:gap-3"
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="h-12 w-10 rounded-lg border border-transparent bg-[#333a5c] text-center text-xl font-semibold text-white outline-none transition focus:border-indigo-500 sm:h-14 sm:w-12"
            />
          ))}
        </div>

        {/* Verify */}
        <button
          type="submit"
          className="w-full rounded-full bg-linear-to-r from-indigo-500 to-indigo-900 py-3 font-medium text-white transition-all hover:opacity-90"
        >
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
