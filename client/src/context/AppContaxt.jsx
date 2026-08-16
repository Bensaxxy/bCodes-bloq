import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [user, setUser] = useState(null);

  // Important for protected routes.
  // While authentication is being checked, protected routes
  // should not redirect the user yet.
  const [authLoading, setAuthLoading] = useState(true);

  // Allow cookies to be sent with all Axios requests
  axios.defaults.withCredentials = true;

  // ==================================================
  // GET CURRENT USER
  // ==================================================
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/profile`);

      if (data.success) {
        setUser(data.user);
        setIsLoggedin(true);

        return data.user;
      }

      setUser(null);
      setIsLoggedin(false);

      return null;
    } catch (error) {
      console.error(
        "Get user data error:",
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );

      setUser(null);
      setIsLoggedin(false);

      return null;
    }
  };

  // ==================================================
  // UPDATE USER STATE
  // ==================================================
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  // ==================================================
  // CHECK AUTHENTICATION STATE
  // ==================================================
  const getAuthState = async () => {
    try {
      setAuthLoading(true);

      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);

      if (data.success) {
        setIsLoggedin(true);

        // Get the complete user including role
        await getUserData();
      } else {
        setIsLoggedin(false);
        setUser(null);
      }
    } catch (error) {
      // 401 simply means the user is not logged in.
      if (error.response?.status === 401) {
        setIsLoggedin(false);
        setUser(null);
        return;
      }

      console.error(
        "Auth state error:",
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );

      setIsLoggedin(false);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  // ==================================================
  // INITIAL AUTH CHECK
  // ==================================================
  useEffect(() => {
    getAuthState();
  }, []);

  // ==================================================
  // CONTEXT VALUE
  // ==================================================
  const value = {
    backendUrl,

    // Authentication
    isLoggedin,
    setIsLoggedin,

    // Current user
    user,
    setUser,

    // Auth loading state
    authLoading,

    // Functions
    getUserData,
    getAuthState,

    updateUser
  };

  return (
    <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
  );
};
