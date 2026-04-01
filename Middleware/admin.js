export const admincheck = (req, res, next) => {
  if (req.role === "admin") {
    next();
  } else {
    res.status(403).json({ msg: "Admin only access" });
  }
};
