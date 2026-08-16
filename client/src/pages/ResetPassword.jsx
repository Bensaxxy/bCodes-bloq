import React, { useContext, useRef, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContaxt";

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContent);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);
  const [loading, setLoading] = useState(false);
  // OTP state
  const [otp, setOtp] = useState(new Array(6).fill(""));

  // References for the 6 OTP inputs
  const inputRefs = useRef([]);

  // Handle OTP input
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

  // Handle keyboard navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle pasting a complete OTP
  const handlePaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) return;

    const newOtp = new Array(6).fill("");

    pastedData.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    // Focus the next empty input, or last input
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  //  send otp to the input email
  const onSubmitEmail = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        backendUrl + "/api/auth/send-reset-otp",
        { email },
      );

      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  // Submit OTP
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-reset-otp",
        {
          email,
          otp: otpValue,
        },
      );

      if (data.success) {
        toast.success(data.message);
        setIsOtpSubmited(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  // newPassword implementation
  const onSubmitNewPassword = async (e) => {
    e.preventDefault();

    if (!password) {
      toast.error("Please enter your new password");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        backendUrl + "/api/auth/reset-password",
        {
          email,
          otp: otp.join(""),
          newPassword: password,
        },
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-200 to-purple-400 px-4">
      {/* Logo */}
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 top-5 w-28 cursor-pointer sm:left-20 sm:w-32"
      />

      {/* enter email id */}
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="w-full max-w-md rounded-lg bg-slate-900 p-8 text-sm shadow-xl"
        >
          <h1 className="mb-2 text-center text-2xl font-semibold text-white">
            Reset Password
          </h1>

          <p className="mb-8 text-center text-indigo-300">
            Enter your register email address
          </p>

          <div className=" mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
            <img src={assets.mail_icon} />

            <input
              className=" outline-none text-white bg-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              name="email"
              placeholder="Email Id"
              required
            />
          </div>

          <button className="w-full bg-linear-to-r from-indigo-500 to-indigo-900 text-white font-medium py-2.5 rounded-full hover:opacity-90 transition-all mb-4">
            {loading ? "Sending..." : "Submit"}
          </button>
        </form>
      )}

      {/* otp form */}
      {!isOtpSubmited && isEmailSent && (
        <form
          onSubmit={onSubmitHandler}
          className="w-full max-w-md rounded-lg bg-slate-900 p-8 text-sm shadow-xl"
        >
          <h1 className="mb-2 text-center text-2xl font-semibold text-white">
            Reset Password OTP
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
            className="w-full rounded-full bg-linear-to-r from-indigo-500 to-indigo-900 py-2.5 font-medium text-white transition-all hover:opacity-90"
          >
            {loading ? "Verifying..." : "Submit"}
          </button>
        </form>
      )}

      {/* Enter new password */}
      {isOtpSubmited && isEmailSent && (
        <form
          onSubmit={onSubmitNewPassword}
          className="w-full max-w-md rounded-lg bg-slate-900 p-8 text-sm shadow-xl"
        >
          <h1 className="mb-2 text-center text-2xl font-semibold text-white">
            New Password
          </h1>

          <p className="mb-8 text-center text-indigo-300">
            Enter your new password below
          </p>

          <div className=" mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
            <img src={assets.lock_icon} />

            <input
              className=" outline-none text-white bg-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              name="password"
              placeholder="Enter your new password"
              required
            />
          </div>

          <button className="w-full bg-linear-to-r from-indigo-500 to-indigo-900 text-white font-medium py-2.5 rounded-full hover:opacity-90 transition-all mb-4">
            {loading ? "Resetting..." : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
