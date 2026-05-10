import supabase from '../config/supabase.js';

export const loginWithSupabase = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({
            session: data.session,
            user: data.user
        });

    } catch (error) {
        res.status(500).json({ message: 'Authentication failed' });
    }
};

export const logoutFromSupabase = async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            return res.status(500).json({ message: 'Logout failed' });
        }

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Logout failed' });
    }
};

export const getSupabaseSession = async (req, res) => {
    try {
        // Use the token from the request (already validated by requireAuth middleware)
        const token = req.authToken;

        if (!token) {
            return res.status(401).json({ message: 'No access token provided' });
        }

        // Verify the token and get user
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ message: 'Invalid session' });
        }

        // Return session info
        res.status(200).json({
            session: {
                access_token: token,
                user: user
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get session' });
    }
};
