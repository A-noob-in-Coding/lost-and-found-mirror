
import API from "./api.js";
export const utilityService = {
  sendContactMessage: async (formData) => {
    try {
      const response = await API.post("/utility/contact", formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to send message" };
    }
  }, fetchCategories: async () => {
    try {
      const response = await API.get("/api/categories");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Could not fetch categories" };
    }
  }, fetchCampuses: async () => {
    try {
      const response = await API.get(`/utility/campus`);
      return response.data;
    }
    catch (error) {
      throw error.response?.data || { message: "Could not fetch campuses" };
    }
  }
  , fetchVerifiedUsers: async () => {
    try {
      const response = await API.get('/utility/verified-users');
      return response.data; // array of roll numbers
    } catch (error) {
      throw error.response?.data || { message: 'Could not fetch verified users' };
    }
  }
};
