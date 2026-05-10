import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_API;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Regular client for normal operations
const supabase = createClient(supabaseUrl, supabaseKey);

// Admin client for admin operations (password reset)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

export const getSupabaseClient = (authToken) => {
    if (authToken) {
        return createClient(supabaseUrl, supabaseKey, {
            global: {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        });
    }
    return supabase;
};

export default supabase;
