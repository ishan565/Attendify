import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { account } from "../appwrite/appwriteConfig";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        await account.get();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkUser();
  }, []);

  if (isAuthenticated === null) return null; // or a loading spinner

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
