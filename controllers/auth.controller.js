import * as authService from '../services/auth.service.js';

// ================= GOOGLE LOGIN =================
export const googleLogin = async (req, res) => {
  try {
    const result = await authService.googleLogin(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ status: 'fail', message: err.message });
  }
};

// ================= REGISTRATION OTP =================
export const sendRegistrationOTP = async (req, res) => {
  try {
    const result = await authService.sendRegistrationOTP(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

export const verifyRegistrationOTP = async (req, res) => {
  try {
    const result = await authService.verifyRegistrationOTP(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};


export const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      message: err.message
    });
  }
};

// ================= PASSWORD RESET =================
export const forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPassword(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// ================= TOKEN =================
export const refreshToken = async (req, res) => {
  try {
    const result = await authService.refreshToken(req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ status: 'fail', message: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    const result = await authService.logout();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// ================= USER PROFILE =================
export const getCurrentUser = async (req, res) => {
  try {
    const result = await authService.getCurrentUser(req.user.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const result = await authService.updateProfile(req.user.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const result = await authService.changePassword(req.user.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const result = await authService.deleteAccount(req.user.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};