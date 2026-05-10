import { authenticateUserService, changePasswordService, doesUserExist, getPasswordUserService, getUserByRollNoService, hashPassword, registerUserService, getUserImageService, updateUserNameService, updateUserImageService, getUserByEmailService, authenticateAdminService, updateUserCampusService, updateUserPrivacyService, getUserCountService } from "../service/userService.js";
import { verifyOTPService } from "../service/otpService.js";
import { generateAdminToken } from "../middleware/auth.js";

const verifyHCaptcha = async (token) => {
  const secret = process.env.HCAPTCHA_SECRET_KEY;
  
  // Skip verification if no secret key is configured (development mode)
  if (!secret || secret === 'your_hcaptcha_secret_key_here') {
    console.log('Warning: hCaptcha verification skipped - no secret key configured');
    return true;
  }
  
  try {
    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `response=${token}&secret=${secret}`,
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('hCaptcha verification error:', error);
    return false;
  }
};

export const authenticateAdmin = async (req, res) => {
  const { username, password, captchaToken } = req.body;
  if (!password || !username) {
    return res.status(400).json({ message: "All fields are required" });
  }
  
  // Verify hCaptcha token
  if (!captchaToken) {
    return res.status(400).json({ message: "Captcha verification is required" });
  }
  
  const isCaptchaValid = await verifyHCaptcha(captchaToken);
  if (!isCaptchaValid) {
    return res.status(400).json({ message: "Captcha verification failed" });
  }
  
  const result = await authenticateAdminService(username, password);
  if (result) {
    const token = generateAdminToken(username);
    return res.status(200).json({ 
      message: "Admin logged in successfully",
      token: token
    });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
}

export const registerUser = async (req, res) => {
  const body = req.body || {};
  const { rollNo, email, name, password, campusID, image_url, otp } = body;

  if (!rollNo || !email || !name || !password || !otp) {
    return res.status(400).json({ message: 'All fields are required, including OTP' });
  }

  const normalizedEmail = email.toLowerCase();

  try {
    const otpResult = await verifyOTPService(normalizedEmail, otp);
    if (!otpResult.success) {
      return res.status(400).json({ message: otpResult.message || 'Invalid OTP' });
    }

    await registerUserService(rollNo, normalizedEmail, name, password, image_url, campusID);
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    return res.status(400).json({ message: error.message || "Error in registering user" });
  }
};

export const getUserByRollNo = async (req, res) => {
  const { rollNo, option } = req.params;

  try {
    const user = await getUserByRollNoService(rollNo);
    const accountType = (user.account_type || 'public').toLowerCase();
    const isOwner = req.user?.email && user.email && req.user.email.toLowerCase() === user.email.toLowerCase();

    if (option == 0 || accountType === 'public' || isOwner) {
      return res.status(200).json(user);
    }
    if (accountType === 'private') {
      return res.status(200).json({
        name: user.name,
        account_type: 'private',
        image_url: user.image_url,
        rollno: user.rollno
      });
    }

  } catch (error) {
    return res.status(404).json({ message: "Error in getting user" });
  }
};

export const updateUserPrivacy = async (req, res) => {
  const { rollno, account_type } = req.body;
  if (!rollno || !account_type) {
    return res.status(400).json({ message: 'Roll number and account type are required' });
  }

  try {
    const currentUser = await getUserByEmailService(req.user.email);
    if (currentUser.rollno !== rollno) {
      return res.status(403).json({ message: "Unauthorized to update this profile" });
    }
    await updateUserPrivacyService(rollno, account_type);
    return res.status(200).json({ message: 'Account privacy updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: "Error in updating privacy" });
  }
}

export const authenticateUser = async (req, res) => {
  const { rollno, password } = req.body;
  try {
    const result = await authenticateUserService(rollno, password);
    if (result) {
      return res.status(200).json({ message: "User logged in successfully" });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
};

export const changePassword = async (req, res) => {
  const { email, password } = req.body;

  if (req.user?.email && req.user.email.toLowerCase() !== email.toLowerCase()) {
    return res.status(403).json({ message: "Unauthorized to change this password" });
  }

  try {
    await changePasswordService(email, password);
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error while changing password" });
  }
}

export const getUserImage = async (req, res) => {
  const { rollNo } = req.params;

  try {
    const imageUrl = await getUserImageService(rollNo);
    return res.status(200).json(imageUrl);
  } catch (error) {
    return res.status(404).json({ message: "Error in getting image" });
  }
};

export const checkUserByEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email is required', exists: false });
  }

  try {
    const exists = await doesUserExist(email);
    return res.status(200).json({ exists: exists });
  } catch (error) {
    return res.status(200).json({ exists: false });
  }
};

export const updateUserName = async (req, res) => {
  const { rollno, username } = req.body;
  if (!rollno || !username) {
    return res.status(400).json({ message: "Please provide all fields" });
  }
  try {
    const currentUser = await getUserByEmailService(req.user.email);
    if (currentUser.rollno !== rollno) {
      return res.status(403).json({ message: "Unauthorized to update this profile" });
    }
    await updateUserNameService(rollno, username);
    return res.status(200).json({ message: "Username successfully changed" });
  } catch (error) {
    return res.status(400).json({ message: "Error in updating username" });
  }
}

export const updateUserImage = async (req, res) => {
  const { rollno, image_url } = req.body;

  if (!rollno || !image_url) {
    return res.status(400).json({ message: "Roll number and image URL are required" });
  }

  try {
    const currentUser = await getUserByEmailService(req.user.email);
    if (currentUser.rollno !== rollno) {
      return res.status(403).json({ message: "Unauthorized to update this profile" });
    }
    const newImageUrl = await updateUserImageService(rollno, image_url);
    return res.status(200).json({
      message: "Profile image updated successfully"
    });
  } catch (error) {
    return res.status(400).json({ message: "Error in updating image" });
  }
};

export const getUserByEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const normalizedEmail = email.toLowerCase();

  try {
    const user = await getUserByEmailService(normalizedEmail);
    const accountType = (user.account_type || 'public').toLowerCase();

    // Check if the requester is the owner
    const isOwner = req.user?.email && req.user.email.toLowerCase() === normalizedEmail;

    if (accountType === 'public' || isOwner) {
      return res.status(200).json(user);
    }

    // If private and not owner, return limited info
    return res.status(200).json({
      name: user.name,
      account_type: 'private',
      image_url: user.image_url
    });
  } catch (error) {
    return res.status(404).json({ message: "Error in getting user" });
  }
};

export const updatUserCampus = async (req, res) => {
  const { rollno, campusID } = req.body;
  if (!rollno || !campusID) {
    return res.status(400).json({ message: "Roll number and campus is required" });
  }
  try {
    const currentUser = await getUserByEmailService(req.user.email);
    if (currentUser.rollno !== rollno) {
      return res.status(403).json({ message: "Unauthorized to update this profile" });
    }
    await updateUserCampusService(rollno, campusID);
    return res.status(200).json({ message: "Updated user campus" });
  } catch (error) {
    return res.status(500).json({ message: "Error in updating campus" });
  }
}

export const getUserCount = async (req, res) => {
  try {
    const count = await getUserCountService();
    return res.status(200).json({ count });
  } catch (error) {
    return res.status(500).json({ message: "Error in getting user count" });
  }
}
