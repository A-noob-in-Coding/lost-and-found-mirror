import API from "./api";
import { supabase } from "../config/supabaseClient";

// Helper function to get user-friendly error messages
const getUserFriendlyError = (error) => {
  const message = error?.response?.data?.message || error?.message || '';
  
  // Network/connection errors
  if (message.includes('signal is aborted') || message.includes('aborted')) {
    return 'Connection was interrupted. Please try again.';
  }
  if (message.includes('Network Error') || message.includes('network')) {
    return 'Unable to connect to server. Please check your internet connection.';
  }
  if (message.includes('timeout') || message.includes('ETIMEDOUT')) {
    return 'Request timed out. Please try again.';
  }
  if (message.includes('ECONNREFUSED')) {
    return 'Server is currently unavailable. Please try again later.';
  }
  
  // Return the original message if it's already user-friendly
  return error?.response?.data?.message || 'Something went wrong. Please try again.';
};

export const authService = {
  login: async (email, password) => {
    try {
      const response = await API.post('/api/auth/login', {
        email,
        password,
      });

      return response.data;
    } catch (error) {
      throw { message: getUserFriendlyError(error) };
    }
  },

  register: async (formData) => {
    try {
      const email = formData.get('email');
      const password = formData.get('password');
      const rollNo = formData.get('rollNo');
      const name = formData.get('name');
      const campusID = formData.get('campusID');
      const imageFile = formData.get('imageFile');
      const otp = formData.get('otp');



      let image_url = "";
      if (imageFile && imageFile instanceof File) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${rollNo}-${Math.random()}.${fileExt}`;
        const filePath = `profile/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('image-bucket')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('image-bucket')
          .getPublicUrl(filePath);

        image_url = publicUrlData.publicUrl;
      }

      const payload = {
        rollNo,
        email,
        name,
        password,
        campusID,
        image_url,
        otp
      };

      const response = await API.post("/api/users/register", payload);
      return response.data;

    } catch (error) {
      if (
        error.response?.data?.message?.includes('duplicate key') ||
        error.message?.includes('duplicate key') ||
        error.status === 409
      ) {
        throw { message: "User is already registered! Please log in." };
      }

      throw { message: getUserFriendlyError(error) };
    }
  },

  logout: async () => {
    try {
      await API.post('/api/auth/logout');
    } catch (error) {
      throw error.response?.data || { message: error.message || "Failed to logout" };
    }
  },

  getSession: async () => {
    try {
      const response = await API.get('/api/auth/session');
      return response.data.session;
    } catch (error) {
      return null;
    }
  },

  getUserDetailsByEmail: async (email) => {
    try {
      const response = await API.get(`/api/users/email/get-user?email=${email}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message || "Failed to fetch user details" };
    }
  },

  getUserDetails: async (rollno, option) => {
    try {
      const response = await API.get(`/api/users/${rollno}/${option}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message || "Failed to fetch user details" };
    }
  },

  updateUsername: async (rollno, username) => {
    try {
      const response = await API.put(`/api/users/updateusername`, { rollno, username });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message || "Failed to update username" };
    }
  },

  updateCampus: async (rollno, campusID) => {
    try {
      await API.post(`/api/users/update/campus`, { rollno, campusID });
    } catch (error) {
      throw error.response?.data || { message: error.message || "Failed to update campus" };
    }
  },

  updateProfileImage: async (rollno, imageFile) => {
    try {
      let imageUrl = imageFile;
      if (imageFile instanceof File) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${rollno}-${Math.random()}.${fileExt}`;
        const filePath = `profile/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('image-bucket')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('image-bucket')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const response = await API.post('/api/users/update-image', {
        rollno,
        image_url: imageUrl
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message || "Failed to update profile image" };
    }
  },

  updatePrivacy: async (rollno, account_type) => {
    try {
      const response = await API.put('/api/users/update/privacy', { rollno, account_type });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message || "Failed to update privacy" };
    }
  },

  resendOtp: async (email) => {
    try {
      const response = await API.post("/api/otp/send-otp", { email, isResend: true });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message || "Failed to resend OTP" };
    }
  },

  verifyOtp: async (email, otp) => {
    try {
      const response = await API.post("/api/otp/verify-otp", { email, otp });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message || "Failed to verify OTP" };
    }
  },

  changePassword: async (email, password) => {
    try {
      const response = await API.post("/api/users/changePassword", { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message || "Failed to reset password" };
    }
  },
};
