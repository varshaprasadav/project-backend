import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import DayStatus from "../models/DayStatus.js";
import Plan from "../models/Plan.js";
import Booking from "../models/Booking.js";
import { authenticate } from "../Middleware/auth.js";

const router = express.Router();



router.post("/register", async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password)
      return res.status(400).json({ msg: "All fields required" });

    const existingBooking = await Booking.findOne({ email });
    if (existingBooking)
      return res.status(400).json({ msg: "This email is used for offline booking. Contact admin." });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      userName, email, password: hashed,
      isPaid: false, currentPlan: null
    });

    res.status(201).json({
      msg: "Signup successful",
      user: { userName: user.userName, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ msg: "Registration failed" });
  }
});

// Alias for /register (frontend expects /signup)
router.post("/signup", async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password)
      return res.status(400).json({ msg: "All fields required" });

    const existingBooking = await Booking.findOne({ email });
    if (existingBooking)
      return res.status(400).json({ msg: "This email is used for offline booking. Contact admin." });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      userName, email, password: hashed,
      isPaid: false, currentPlan: null
    });

    res.status(201).json({
      msg: "Signup successful",
      user: { userName: user.userName, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ msg: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("currentPlan", "title");
    if (!user) return res.status(404).json({ msg: "User not found" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ msg: "Invalid password" });
    const token = jwt.sign(
      { email: user.email, role: user.role, userName: user.userName },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );
    res.cookie("authToken", token, {
      httpOnly: true, sameSite: "none", secure: true, maxAge: 1000 * 60 * 60 * 24 * 7
    });
    res.json({ msg: "Login successful", user: { userName: user.userName, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: "Login failed" });
  }
});



router.post("/logout", (req, res) => {
  res.clearCookie("authToken");
  res.json({ msg: "Logged out" });
});



router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.userName })
      .select("-password")
      .populate("currentPlan", "title");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Failed" });
  }
});

router.get("/unlockedDays/:planId", authenticate, async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.userName });

    if (!user || !user.isPaid || !user.subscriptionStart)
      return res.json({ unlockedDays: [] });

    const start = new Date(user.subscriptionStart);
    const today = new Date();

    const startDate = new Date(start.toLocaleDateString());
    const todayDate = new Date(today.toLocaleDateString());

    const daysPassed = Math.floor(
      (todayDate - startDate) / (1000 * 60 * 60 * 24)
    );

    const unlockedCount = Math.min(Math.max(daysPassed + 1, 1), 30);

    const unlockedDays = Array.from(
      { length: unlockedCount },
      (_, i) => i + 1
    );

    res.json({ unlockedDays });

  } catch (err) {
    res.status(500).json({ msg: "Failed to get unlocked days" });
  }
});



router.get("/allDayStatus", authenticate, async (req, res) => {
  try {
    const { planId } = req.query;
    const statuses = await DayStatus.find({ userName: req.userName, planId, completed: true });
    res.json({ completedDays: statuses.map(s => s.day) });
  } catch (err) {
    res.status(500).json({ msg: "Failed" });
  }
});



router.get("/dayStatus", authenticate, async (req, res) => {
  try {
    const { day, plan } = req.query;
    const status = await DayStatus.findOne({
      userName: req.userName, day: Number(day), planId: plan
    });
    res.json({ completed: status?.completed || false });
  } catch (err) {
    res.status(500).json({ msg: "Failed" });
  }
});



router.post("/completeDay", authenticate, async (req, res) => {
  try {
    const { day, planId } = req.body;
    let status = await DayStatus.findOne({ userName: req.userName, day: Number(day), planId });
    if (status) {
      status.completed = true;
      status.completedAt = new Date();
      await status.save();
    } else {
      await DayStatus.create({
        userName: req.userName, day: Number(day), planId,
        completed: true, completedAt: new Date()
      });
    }
    res.json({ msg: "Workout completed" });
  } catch (err) {
    res.status(500).json({ msg: "Failed", error: err.message });
  }
});



router.post("/subscribe/:planId", authenticate, async (req, res) => {
  try {
    const { planId } = req.params;
    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ msg: "Plan not found" });

    const updatedUser = await User.findOneAndUpdate(
      { userName: req.userName },
      { $set: { isPaid: true, subscriptionStart: new Date(), currentPlan: plan._id } },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ msg: "User not found" });

    res.json({ msg: "Subscription successful! Day 1 is now unlocked.", planId: plan._id });
  } catch (err) {
    res.status(500).json({ msg: "Subscription failed", error: err.message });
  }
});


const API_BASE_URL = 'https://project-backend-p1mt.onrender.com'


router.get("/plans/public", async (req, res) => {
  try {
    const plans = await Plan.find();
    console.log(plans);

    res.json(plans.map(p => ({
      _id: p._id,
      title: p.title,
      price: p.price,
      days: p.days || [],
      bg: p.bg || "bg-gray-800",
      image: p.image ? `${API_BASE_URL}${p.image}` : "/placeholder.jpg",
      buttonColor: p.buttonColor || "text-black",
      buttonText: p.buttonText || "Start Plan",
    })));
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch plans" });
  }
});

router.get("/plans/:id", authenticate, async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id).populate("days.exercises");
    if (!plan) return res.status(404).json({ msg: "Plan not found" });
    const user = await User.findOne({ userName: req.userName });
    if (!user.isPaid || user.currentPlan.toString() !== req.params.id)
      return res.status(403).json({ msg: "Access denied for this plan" });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch plan" });
  }
});

export default router;