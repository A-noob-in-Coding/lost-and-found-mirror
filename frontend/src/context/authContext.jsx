import { createContext, useContext, useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { authService } from "../services/authService";
import { supabase } from "../config/supabaseClient";

const AuthContext = createContext(null);

const SESSION_EXPIRATION_MINUTES = 30; //mins

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let authTimer;

    const syncProfile = async (session) => {
      try {
        if (session?.user?.last_sign_in_at) {
          const lastSignIn = new Date(session.user.last_sign_in_at).getTime();
          const expirationTime = lastSignIn + SESSION_EXPIRATION_MINUTES * 60 * 1000;
          const now = Date.now();
          const timeRemaining = expirationTime - now;

          if (timeRemaining <= 0) {
            await authService.logout();
            await supabase.auth.signOut();
            localStorage.removeItem('user');
            Object.keys(localStorage).forEach((key) => {
              if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
                localStorage.removeItem(key);
              }
            });
            setUser(null);
            return;
          }

          if (authTimer) clearTimeout(authTimer);
          authTimer = setTimeout(async () => {
            if (mounted) {
              await authService.logout();
              await supabase.auth.signOut();
              localStorage.removeItem('user');
              Object.keys(localStorage).forEach((key) => {
                if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
                  localStorage.removeItem(key);
                }
              });
              setUser(null);
              toast.error("Session expired.");
            }
          }, timeRemaining);
        }
        if (session?.user?.email) {
          const userDetails = await authService.getUserDetailsByEmail(session.user.email);
          if (userDetails) {
            setUser(userDetails);
          } else {
            await authService.logout();
            setUser(null);
          }
        } else {
          setUser(null);
          localStorage.removeItem('user');
        }
      } catch (err) {
        if (err.message && (err.message.includes("404") || err.message.includes("not found"))) {
          await authService.logout();
        }
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      syncProfile(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      syncProfile(session);
    });

    const channel = supabase
      .channel('public:User')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'User' },
        (payload) => {
          setUser((currentUser) => {
            if (currentUser && currentUser.rollno === payload.new.rollno) {
              const updatedUser = { ...currentUser, ...payload.new };
              return updatedUser;
            }
            return currentUser;
          });
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      if (authTimer) clearTimeout(authTimer);
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { user: authUser, session } = await authService.login(email, password);

      if (session) {
        const { error } = await supabase.auth.setSession(session);
        if (error) console.error("Error restoring session:", error);
      }

      if (authUser?.email) {
        const userDetails = await authService.getUserDetailsByEmail(authUser.email);
        if (userDetails) {
          setUser(userDetails);
        }
      }

      toast.success('Successfully logged in!');
      return true;
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    let backendLogoutSuccess = false;
    try {
      await authService.logout();
      backendLogoutSuccess = true;
    } catch (error) {
    }

    try {
      if (backendLogoutSuccess) {
      } else {
        await supabase.auth.signOut().catch(() => { });
      }
    } catch (error) {
    }

    const claimedItems = localStorage.getItem('claimed-items');
    localStorage.clear();
    if (claimedItems) {
      localStorage.setItem('claimed-items', claimedItems);
    }

    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfileImage = async (imageFile) => {
    try {
      const data = await authService.updateProfileImage(user.rollno, imageFile);
      const updatedUser = {
        ...user,
        image_url: data.image_url,
        profile_changes_count: (user.profile_changes_count || 0) + 1
      };
      setUser(updatedUser);
      toast.success('Profile picture updated successfully!');
      return data.image_url;
    } catch (error) {
      toast.error(error.message || 'Failed to update profile image');
      toast.error(error.message);
      throw error;
    }
  };

  const updateUsername = async (newUsername) => {
    try {
      await authService.updateUsername(user.rollno, newUsername);
      const updatedUser = {
        ...user,
        name: newUsername,
        profile_changes_count: (user.profile_changes_count || 0) + 1
      };
      setUser(updatedUser);
      toast.success('Username updated successfully!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateCampus = async (campusID, campusName) => {
    await authService.updateCampus(user.rollno, campusID);
    toast.success("Campus updated");
    setUser((prevUser) => {
      const newUser = {
        ...prevUser,
        campusName,
        campusID,
        profile_changes_count: (prevUser.profile_changes_count || 0) + 1
      };
      return newUser;
    });
  };

  const updatePrivacy = async (account_type) => {
    await authService.updatePrivacy(user.rollno, account_type);
    const updatedUser = { ...user, account_type };
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading,
      updateUsername,
      updateProfileImage,
      updateCampus,
      updatePrivacy,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
