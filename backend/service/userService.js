import bcrypt from 'bcrypt';
import UserModel from '../model/UserModel.js';
import { supabaseAdmin } from '../config/supabase.js';

// Helper to delete image from Supabase storage
const deleteProfileImageFromSupabase = async (imageUrl) => {
  if (!imageUrl || !supabaseAdmin) return;
  try {
    const parts = imageUrl.split('/image-bucket/');
    if (parts.length > 1) {
      const path = parts[1];
      await supabaseAdmin.storage.from('image-bucket').remove([path]);
    }
  } catch (e) {
  }
};

export const hashPassword = async (password) => {
  const saltRound = 10;
  return await bcrypt.hash(password, saltRound);
}

export const registerUserService = async (rollNo, email, name, password, image_url, campusID) => {
  try {
    if (supabaseAdmin) {
      const { data: supabaseUser, error: supabaseError } = await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: {
          name: name,
          rollNo: rollNo,
          campusID: campusID
        }
      });

      if (supabaseError) {
        throw new Error("Issues in registration!");
      }
    }

    const hashedPassword = await hashPassword(password);
    const user = await UserModel.create({
      rollno: rollNo,
      email,
      name,
      password: hashedPassword,
      campusID,
      image_url: image_url || ""
    });
    return user.password;
  } catch (error) {
    throw error;
  }
};

export const getUserByRollNoService = async (rollNo) => {
  let user = await UserModel.findByRollNoWithCampus(rollNo);
  if (!user) throw new Error('User not found');
  const now = new Date();
  let { profile_changes_count, profile_changes_reset_date } = user;
  const resetDate = new Date(profile_changes_reset_date);
  if (now > resetDate) {
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();
    const nextReset = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0, 0));
    await UserModel.updateProfileChangeCount(rollNo, {
      count: 0,
      reset_date: nextReset.toISOString()
    });
    user = await UserModel.findByRollNoWithCampus(rollNo);
  }
  return user;
};

export const updateUserPrivacyService = async (rollno, accountType) => {
  const valid = ['public', 'private'];
  const normalized = typeof accountType === 'string' ? accountType.toLowerCase() : accountType ? 'public' : 'private';
  if (!valid.includes(normalized)) {
    throw new Error('Invalid account type');
  }
  await UserModel.updateProfile(rollno, { account_type: normalized });
};

export const doesUserExist = async (email) => {
  const user = await UserModel.findByEmail(email);
  return !!user;
}

export const getPasswordUserService = async (rollNo) => {
  const user = await UserModel.findByRollNo(rollNo);
  if (user) {
    return user.password;
  } else {
    throw new Error('User not found');
  }
}

export const authenticateAdminService = async (username, password) => {
  if (password !== process.env.ADMIN_PASS || username !== process.env.ADMIN_USER) {
    return false;
  }
  return true;
}

export const authenticateUserService = async (rollNo, password) => {
  const pass = await getPasswordUserService(rollNo);
  const result = await bcrypt.compare(password, pass);
  return result;
};

export const changePasswordService = async (email, password) => {
  const user = await UserModel.findByEmail(email);
  if (!user) {
    throw new Error("User does not exist");
  }

  const newPass = await hashPassword(password);
  await UserModel.updatePassword(user.rollno, newPass);

  if (supabaseAdmin) {
    try {
      const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();

      if (listError) {
        throw new Error("Error listing Supabase users");
      } else {
        const supabaseUser = users?.find(u => u.email?.toLowerCase() === email.toLowerCase());

        if (supabaseUser) {
          const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
            supabaseUser.id,
            { password: password }
          );

          if (updateError) {
            throw new Error("Failed to update authentication password");
          }
        }
      }
    } catch (supabaseError) {
      throw new Error("Failed to update authentication password");
    }
  }
}

export const getUserImageService = async (rollNo) => {
  const user = await UserModel.findByRollNo(rollNo);
  if (user) {
    return user.image_url;
  } else {
    throw new Error('User not found');
  }
}

export const updateUserNameService = async (rollno, username) => {
  await checkAndIncrementProfileChangeLimit(rollno);
  await UserModel.updateProfile(rollno, { name: username });
}

export const updateUserImageService = async (rollno, image_url) => {
  await checkAndIncrementProfileChangeLimit(rollno);
  
  // Get the old image URL and delete it from storage
  const existingUser = await UserModel.findByRollNo(rollno);
  if (existingUser?.image_url) {
    await deleteProfileImageFromSupabase(existingUser.image_url);
  }
  
  const user = await UserModel.updateProfile(rollno, { image_url });
  if (!user) throw new Error('User not found');
  return user.image_url;
};

export const getUserByEmailService = async (email) => {
  const user = await UserModel.findByEmail(email);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } else {
    throw new Error('User not found');
  }
};

export const updateUserCampusService = async (rollno, campusID) => {
  await checkAndIncrementProfileChangeLimit(rollno);
  await UserModel.updateCampus(rollno, campusID);
}

const checkAndIncrementProfileChangeLimit = async (rollno) => {
  const user = await UserModel.findByRollNoWithCampus(rollno);
  if (!user) throw new Error('User not found');

  const now = new Date();
  let { profile_changes_count, profile_changes_reset_date } = user;
  const resetDate = new Date(profile_changes_reset_date);

  if (now > resetDate) {
    profile_changes_count = 0;
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth();
    const nextReset = new Date(Date.UTC(year, month + 1, 1, 0, 0, 0, 0));

    await UserModel.updateProfileChangeCount(rollno, {
      count: 1,
      reset_date: nextReset.toISOString()
    });
    return;
  }

  if (profile_changes_count >= 3) {
    throw new Error('Profile update limit reached (3 times per month). Next reset: ' + resetDate.toLocaleDateString());
  }
  await UserModel.updateProfileChangeCount(rollno, {
    count: profile_changes_count + 1
  });
};

export const getUserCountService = async () => {
  const users = await UserModel.getAllUsers();
  return users.length;
};

