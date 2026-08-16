import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContaxt";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    backendUrl,
    setIsLoggedin,
    getUserData,
  } = React.useContext(AppContent);

  const [state, setState] = useState("Sign Up");
  const isSignUp = state === "Sign Up";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      axios.defaults.withCredentials = true;

      // ==================================================
      // SIGN UP
      // ==================================================
      if (state === "Sign Up") {
        const { data } = await axios.post(
          `${backendUrl}/api/auth/register`,
          {
            name,
            email,
            password,
          },
        );

        if (!data.success) {
          toast.error(data.message || "Registration failed");
          return;
        }

        setIsLoggedin(true);

        const currentUser = await getUserData();

        if (currentUser?.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }

        return;
      }

      // ==================================================
      // LOGIN
      // ==================================================
      const { data } = await axios.post(
        `${backendUrl}/api/auth/login`,
        {
          email,
          password,
        },
      );

      if (!data.success) {
        toast.error(data.message || "Login failed");
        return;
      }

      setIsLoggedin(true);

      // Get the authenticated user from the backend.
      // This gives us the user's role.
      const currentUser = await getUserData();

      console.log("Logged in user:", currentUser);
      console.log("Logged in role:", currentUser?.role);

      // ==================================================
      // ADMIN LOGIN
      // ==================================================
      if (currentUser?.role === "admin") {
        navigate("/admin", { replace: true });
        return;
      }

      // ==================================================
      // NORMAL USER LOGIN
      // ==================================================
      // If the user originally tried to access a protected
      // page, return them there. Otherwise go home.
      const from = location.state?.from?.pathname;

      if (from && from !== "/login") {
        navigate(from, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-200 to-purple-400 px-6 sm:px-0">
      {/* Logo */}
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="absolute left-5 top-5 w-28 cursor-pointer sm:left-20 sm:w-32"
      />

      {/* Form Container */}
      <div className="w-full rounded-lg bg-slate-900 p-10 text-sm text-indigo-300 shadow-lg sm:w-96">
        {/* Heading */}
        <h2 className="mb-2 text-center text-3xl font-semibold text-white">
          {isSignUp ? "Create account" : "Login"}
        </h2>

        <p className="mb-6 text-center text-sm">
          {isSignUp
            ? "Create your account"
            : "Login to your account"}
        </p>

        <form onSubmit={onSubmitHandler}>
          {/* Full Name - Only for Sign Up */}
          {isSignUp && (
            <div className="mb-4 flex w-full items-center gap-3 rounded-full bg-[#333a5c] px-5 py-2.5">
              <img
                src={assets.person_icon}
                alt="Person"
                className="h-5 w-5 object-contain"
              />

              <input
                className="w-full bg-transparent text-white outline-none placeholder:text-indigo-200"
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Full Name"
              />
            </div>
          )}

          {/* Email */}
          <div className="mb-4 flex w-full items-center gap-3 rounded-full bg-[#333a5c] px-5 py-2.5">
            <img
              src={assets.mail_icon}
              alt="Email"
              className="h-5 w-5 object-contain"
            />

            <input
              className="w-full bg-transparent text-white outline-none placeholder:text-indigo-200"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email Id"
            />
          </div>

          {/* Password */}
          <div className="mb-4 flex w-full items-center gap-3 rounded-full bg-[#333a5c] px-5 py-2.5">
            <img
              src={assets.lock_icon}
              alt="Password"
              className="h-5 w-5 object-contain"
            />

            <input
              className="w-full bg-transparent text-white outline-none placeholder:text-indigo-200"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>

          {/* Forgot Password */}
          {!isSignUp && (
            <p
              onClick={() => navigate("/reset-password")}
              className="mb-4 cursor-pointer text-right text-indigo-500 hover:underline"
            >
              Forgot password?
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="mb-4 w-full rounded-full bg-linear-to-r from-indigo-500 to-indigo-900 py-2.5 font-medium text-white transition-all hover:opacity-90"
          >
            {state}
          </button>
        </form>

        {/* Switch Between Login / Sign Up */}
        <p className="text-center text-sm text-indigo-300">
          {isSignUp
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <span
            onClick={() =>
              setState(isSignUp ? "Login" : "Sign Up")
            }
            className="cursor-pointer font-medium text-indigo-500 hover:underline"
          >
            {isSignUp ? "Login here" : "Sign up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;