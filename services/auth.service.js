import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import OTP from '../models/OTP.model.js';
import { OAuth2Client } from 'google-auth-library';
import {
  generateOTP,
  saveOTP,
  verifyOTP,
  sendOTPEmail
} from '../services/email.service.js';

// Google client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ================= JWT =================
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      // role: user.role,
      provider: user.provider
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// ================= GOOGLE LOGIN =================
export const googleLogin = async ({ credential }) => {
  if (!credential) throw new Error('Google credential is required');

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID
  });

  const { email, name, sub: googleId, picture } = ticket.getPayload();

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email,
      name,
      googleId,
      avatar: picture,
      isEmailVerified: true,
      provider: 'google'
    });
  }

  const token = generateToken(user);

  return {
    status: 'success',
    message: 'Google login successful',
    token,
    user
  };
};

// ================= REGISTRATION OTP =================
export const sendRegistrationOTP = async ({ email, name, password }) => {
  const exists = await User.findOne({ email });
  if (exists) throw new Error('User already exists');

  const otp = generateOTP();

  await saveOTP(email, otp, 'registration', {
    userData: { email, name, password }
  });

  await sendOTPEmail(email, otp, 'registration');

  return {
    status: 'success',
    message: 'OTP sent to email'
  };
};

export const verifyRegistrationOTP = async ({ email, otp, name, password }) => {
  const result = await verifyOTP(email, otp, 'registration');

  if (!result.valid) throw new Error(result.message);

  const data = result.data?.userData;

  const user = await User.create({
    name: data?.name || name,
    email,
    password: data?.password || password,
    isEmailVerified: true,
    provider: 'local'
  });

  const token = generateToken(user);

  return {
    status: 'success',
    message: 'Registration successful',
    token,
    user
  };
};


// JWT generator
// const generateToken = (user) => {
//   return jwt.sign(
//     {
//       id: user._id,
//       email: user.email,
//     },
//     process.env.JWT_SECRET,
//     { expiresIn: '7d' }
//   );
// };

// ================= SIMPLE LOGIN =================
export const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  // Get user with password field
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check password using schema method
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // Generate token
  const token = generateToken(user);

  return {
    status: 'success',
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    }
  };
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');

  if (user.provider === 'google') {
    throw new Error('Google account cannot reset password');
  }

  const otp = generateOTP();

  await saveOTP(email, otp, 'passwordReset', {
    userId: user._id
  });

  await sendOTPEmail(email, otp, 'passwordReset');

  return {
    status: 'success',
    message: 'OTP sent to email'
  };
};

// ================= RESET PASSWORD =================
export const resetPassword = async ({ email, otp, newPassword }) => {
  const result = await verifyOTP(email, otp, 'passwordReset');

  if (!result.valid) throw new Error(result.message);

  const user = await User.findById(result.data.userId);
  if (!user) throw new Error('User not found');

  user.password = newPassword;
  await user.save();

  await OTP.deleteOne({ _id: result._id });

  return {
    status: 'success',
    message: 'Password reset successful'
  };
};

export const logout = async () => {
  return {
    status: 'success',
    message: 'Logged out successfully'
  };
};

// ================= PROFILE =================
export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw new Error('User not found');

  return {
    status: 'success',
    user
  };
};

export const updateProfile = async (userId, data) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  if (data.email && data.email !== user.email && user.provider === 'google') {
    throw new Error('Email cannot be changed for Google accounts');
  }

  if (data.name) user.name = data.name;
  if (data.email && user.provider !== 'google') user.email = data.email;

  await user.save();

  return {
    status: 'success',
    message: 'Profile updated',
    user
  };
};

export const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new Error('User not found');

  if (user.provider === 'google') {
    throw new Error('Password change not allowed for Google accounts');
  }

  const isValid = await user.comparePassword(currentPassword);
  if (!isValid) throw new Error('Current password incorrect');

  user.password = newPassword;
  await user.save();

  return {
    status: 'success',
    message: 'Password changed successfully'
  };
};

export const deleteAccount = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  await user.deleteOne();

  return {
    status: 'success',
    message: 'Account deleted successfully'
  };
};