import User from "../models/User.js";

export const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    req.user.name = name;
    await req.user.save();

    res.status(200).json({
      success: true,
      data: { id: req.user._id, name: req.user.name, email: req.user.email },
    });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};
