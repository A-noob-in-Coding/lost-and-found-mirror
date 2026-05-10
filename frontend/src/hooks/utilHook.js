
import { useState, useEffect } from 'react';
import { utilityService } from '../services/utilService.js';

// Fetch categories
export const useCategories = (options = {}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { enabled = true } = options;

  const fetchData = async () => {
    if (!enabled) return;
    setIsLoading(true);
    try {
      const res = await utilityService.fetchCategories();
      setData(res);
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled]);

  return { data, isLoading, error, refetch: fetchData };
};

// Fetch campuses
export const useCampuses = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await utilityService.fetchCampuses();
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
  }, []);

  return { data, isLoading, error };
};

// Fetch verified users
export const useVerifiedUsers = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const res = await utilityService.fetchVerifiedUsers();
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
  }, []);

  return { data, isLoading, error };
};

// MUTATIONS

// Send Contact Message
export const useSendContactMessage = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await utilityService.sendContactMessage(formData);
      if (options.onSuccess) {
        options.onSuccess(result);
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
