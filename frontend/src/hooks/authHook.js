import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

// QUERIES
// Get User Details
export const useUserDetails = (rollno, options = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!rollno) {
      setIsLoading(false);
      return;
    }
    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await authService.getUserDetails(rollno);
        if (mounted) {
          setData(res);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
          setIsLoading(false);
        }
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, [rollno]);

  return { data, isLoading, error };
};

// Get User By Roll Number
export const useUserByRollNumber = (rollNumber, options = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!rollNumber) {
      setIsLoading(false);
      return;
    }
    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await authService.getUserByRollNumber(rollNumber);
        if (mounted) {
          setData(res);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
          setIsLoading(false);
        }
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, [rollNumber]);

  return { data, isLoading, error };
};

// MUTATIONS 
export const useLogin = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async ({ rollno, password }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.login(rollno, password);
      // Removed manual cache update
      if (options.onSuccess) {
        options.onSuccess(result, { rollno, password });
      }
      return result;
    } catch (err) {
      setError(err);
      if (options.onError) {
        options.onError(err);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
};

// Register
export const useRegister = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.register(formData);
      if (options.onSuccess) {
        options.onSuccess(result, formData);
      }
      return result;
    } catch (err) {
      setError(err);
      if (options.onError) {
        options.onError(err);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
};

// Update Username
export const useUpdateUsername = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async ({ rollno, newUsername }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.updateUsername(rollno, newUsername);
      if (options.onSuccess) {
        options.onSuccess(result, { rollno, newUsername });
      }
      return result;
    } catch (err) {
      setError(err);
      if (options.onError) {
        options.onError(err);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
};

// Update Campus
export const useUpdateCampus = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async ({ rollno, campusID, campusName }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.updateCampus(rollno, campusID);
      if (options.onSuccess) {
        options.onSuccess(result, { rollno, campusID, campusName });
      }
      return result;
    } catch (err) {
      setError(err);
      if (options.onError) {
        options.onError(err);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
};

// Update Profile Image
export const useUpdateProfileImage = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async ({ rollno, imageFile }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.updateProfileImage(rollno, imageFile);
      if (options.onSuccess) {
        options.onSuccess(result, { rollno, imageFile });
      }
      return result;
    } catch (err) {
      setError(err);
      if (options.onError) {
        options.onError(err);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
};

export const useUpdatePrivacy = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async ({ rollno, account_type }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.updatePrivacy(rollno, account_type);
      if (options.onSuccess) {
        options.onSuccess(result, { rollno, account_type });
      }
      return result;
    } catch (err) {
      setError(err);
      if (options.onError) {
        options.onError(err);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
};

// Send OTP
export const useSendOtp = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (email) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.resendOtp(email);
      if (options.onSuccess) {
        options.onSuccess(result, email);
      }
      return result;
    } catch (err) {
      setError(err);
      if (options.onError) {
        options.onError(err);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
};

// Verify OTP
export const useVerifyOtp = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async ({ email, otp }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.verifyOtp(email, otp);
      if (options.onSuccess) {
        options.onSuccess(result, { email, otp });
      }
      return result;
    } catch (err) {
      setError(err);
      if (options.onError) {
        options.onError(err);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
};

// Change Password
export const useChangePassword = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async ({ email, password }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authService.changePassword(email, password);
      if (options.onSuccess) {
        options.onSuccess(result, { email, password });
      }
      return result;
    } catch (err) {
      setError(err);
      if (options.onError) {
        options.onError(err);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
};
