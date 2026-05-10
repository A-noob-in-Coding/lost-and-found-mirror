import { createContext, useContext, useState, useEffect } from "react";
import { utilityService } from "../services/utilService";
const UtilContext = createContext();

export const UtilProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [campuses, setCampuses] = useState([])
  const [verifiedUsers, setVerifiedUsers] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchCampuses();
    fetchVerifiedUsers();
  }, []);

  const fetchCampuses = async () => {
    try {
      const res = await utilityService.fetchCampuses();
      setCampuses(res);
    } catch (err) {
      console.error("Error fetching campuses");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await utilityService.fetchCategories();
      setCategories(response);
    } catch (error) {
      console.error("Error fetching categories");
    }
  };

  const fetchVerifiedUsers = async () => {
    try {
      const response = await utilityService.fetchVerifiedUsers();
      setVerifiedUsers(response || []);
    } catch (error) {
      console.error("Error fetching verified users");
    }
  };

  const isUserVerified = (rollno) => {
    return verifiedUsers.includes(String(rollno));
  };

  return (
    <UtilContext.Provider
      value={{
        categories,
        setCategories,
        campuses,
        setCampuses,
        fetchCategories,
        fetchCampuses,
        verifiedUsers,
        isUserVerified,
      }}    >
      {children}
    </UtilContext.Provider>
  );
};
export const useUtil = () => {
  const context = useContext(UtilContext);
  return context;
};

