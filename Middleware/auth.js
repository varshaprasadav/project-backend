import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  try {
    const token = req.cookies.authToken; 
    if (!token) return res.status(401).json({ msg: "No token provided" });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.userName = decoded.userName;
    req.role = decoded.role;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ msg: "Invalid token" });
  }
};