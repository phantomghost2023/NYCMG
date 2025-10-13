const { registerSchema, loginSchema, updateUserSchema, validate } = require('../middleware/validation.middleware');
const { registerUser, loginUser, refreshUserToken, getProfile: getProfileService, updateProfile: updateProfileService } = require('../services/auth.service');

const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    if (error.message === 'Email already registered' || error.message === 'Username already taken') {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (error) {
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const result = await refreshUserToken(req.user);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await getProfileService(req.user.userId);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const profile = await updateProfileService(req.user.userId, req.body);
    res.json(profile);
  } catch (error) {
    if (error.message === 'Username already taken') {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register: [validate(registerSchema), register],
  login: [validate(loginSchema), login],
  refreshToken,
  getProfile,
  updateProfile: [validate(updateUserSchema), updateProfile]
};