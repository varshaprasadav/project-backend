import express from "express";
import User from "../models/User.js";
import Profile from "../models/Profile.js";
import DayStatus from "../models/DayStatus.js";
import Exercise from "../models/Exercise.js";
import Plan from "../models/Plan.js";
import { authenticate } from "../Middleware/auth.js";
import { admincheck } from "../Middleware/admin.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const admin = express.Router();

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const assignDays = (pool, dayCount, perDay = 5) => {
  const days = [];
  for (let i = 0; i < dayCount; i++) {
    const shuffled = shuffle(pool);
    const dayExercises = [];
    for (let j = 0; j < perDay; j++) {
      dayExercises.push(shuffled[j % shuffled.length]._id);
    }
    days.push(dayExercises);
  }
  return days;
};

admin.get("/allUsers", authenticate, admincheck, async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password").populate("currentPlan", "title");
    const result = await Promise.all(users.map(async (u) => {
      const profile = await Profile.findOne({ userName: u.userName });
      const statuses = await DayStatus.find({ userName: u.userName });
      const completed = statuses.filter(s => s.completed).length;
      const total = statuses.length;
      let workoutStatus = "Not Started";
      if (completed > 0 && completed < total) workoutStatus = "In Progress";
      if (total > 0 && completed === total) workoutStatus = "Completed";

      const start = u.subscriptionStart ? new Date(u.subscriptionStart) : null;
      const end = start ? new Date(start) : null;
      if (end) end.setDate(end.getDate() + 30);
      const isAllowed = end ? end > new Date() : false;

      return {
        userName: u.userName, email: u.email, isPaid: u.isPaid,
        subscriptionStart: u.subscriptionStart, isAllowed,
        totalDaysCompleted: completed, workoutStatus,
        currentPlan: u.currentPlan ? { title: u.currentPlan.title } : null,
        profile: profile || null,
      };
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch users" });
  }
});



admin.get("/workoutStats", authenticate, admincheck, async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).populate("currentPlan", "title");
    const stats = await Promise.all(users.map(async (user) => {
      const statuses = await DayStatus.find({ userName: user.userName }).sort({ day: 1 });
      const completedDays = statuses.filter(s => s.completed);
      let currentDayStatus = { day: 1, status: "Not Started" };
      let nextDayStatus = { day: 2, status: "Not Started" };
      if (completedDays.length > 0) {
        const last = completedDays[completedDays.length - 1];
        currentDayStatus = { day: last.day, status: "Completed" };
        nextDayStatus = { day: last.day + 1, status: "Not Started" };
      }
      return {
        userName: user.userName,
        planTitle: user.currentPlan?.title || "No Plan",
        currentDayStatus, nextDayStatus,
      };
    }));
    res.json(stats);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch workout stats" });
  }
});



admin.delete("/deleteUser/:userName", authenticate, admincheck, async (req, res) => {
  try {
    const { userName } = req.params;
    await User.deleteOne({ userName });
    await Profile.deleteOne({ userName });
    await DayStatus.deleteMany({ userName });
    res.json({ msg: `User "${userName}" deleted` });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete user" });
  }
});



admin.get("/planAnalytics", authenticate, admincheck, async (req, res) => {
  try {
    const analytics = await User.aggregate([
      { $lookup: { from: "plans", localField: "currentPlan", foreignField: "_id", as: "plan" } },
      { $unwind: "$plan" },
      { $group: { _id: "$plan.title", totalUsers: { $sum: 1 } } },
    ]);
    res.json(analytics);
  } catch (err) {
    res.status(500).json({ msg: "Failed" });
  }
});




admin.get("/stats", authenticate, admincheck, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const paidUsers = await User.countDocuments({ role: "user", isPaid: true });
    const activeUsers = await DayStatus.distinct("userName", {
      completedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });
    res.json({ totalUsers, paidUsers, activeUsers: activeUsers.length });
  } catch (err) {
    res.status(500).json({ msg: "Failed" });
  }
});



admin.get("/user/:userName", authenticate, admincheck, async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.params.userName })
      .select("-password").populate("currentPlan", "title");
    if (!user) return res.status(404).json({ msg: "User not found" });
    const statuses = await DayStatus.find({ userName: user.userName }).sort({ day: 1 });
    res.json({ user, workoutStatus: statuses.map(s => ({ day: s.day, completed: s.completed })) });
  } catch (err) {
    res.status(500).json({ msg: "Failed" });
  }
});



admin.get("/userProfile/:userName", authenticate, admincheck, async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.params.userName })
      .select("-password").populate("currentPlan", "title");
    if (!user) return res.status(404).json({ msg: "User not found" });
    const profile = await Profile.findOne({ userName: req.params.userName });
    res.json({ user, profile });
  } catch (err) {
    res.status(500).json({ msg: "Failed" });
  }
});


admin.get("/plans/id/:id", async (req, res) => {
  try {

    const plan = await Plan.findById(req.params.id).populate("days.exercises");
    if (!plan) return res.status(404).json({ msg: "Plan not found" });
    res.json({ ...plan.toObject(), image: plan.image ? `https://project-backend-p1mt.onrender.com'${plan.image}` : null });
  } catch (err) {
    res.status(500).json({ msg: "Failed" });
  }
});


admin.get("/plans", authenticate, admincheck, async (req, res) => {
  try {
    const plans = await Plan.find().populate("days.exercises");
    res.json(plans.map(plan => ({
      ...plan.toObject(),
      image: plan.image ? `https://project-backend-p1mt.onrender.com${plan.image}` : null
    })));
  } catch (err) {
    res.status(500).json({ msg: "Failed" });
  }
});




admin.post(
  "/plans", 
  upload.single("image"),
  async (req, res) => {
    try {
      console.log("reached");

      const { title, price, buttonText } = req.body;
      console.log(title, price, buttonText);

      const image = req.file ? `/uploads/${req.file.filename}` : "";

      const easyExercises = await Exercise.find({ level: "Easy" });
      const interExercises = await Exercise.find({ level: "Intermediate" });
      const hardExercises = await Exercise.find({ level: "Hard" });

      const safeAssignDays = (exercises, days) => {
        if (!Array.isArray(exercises) || exercises.length === 0) {
          return Array.from({ length: days }, () => []);
        }
        return assignDays(exercises, days);
      };

      // Build progressive difficulty plan:
      // Days 1-10: Easy only
      // Days 11-20: Easy + Intermediate mixed
      // Days 21-30: Easy + Intermediate + Hard mixed
      const daysArray = [
        // Days 1-10: Easy exercises only
        ...safeAssignDays(easyExercises, 10).map((exercises, i) => ({ 
          day: i + 1, 
          exercises 
        })),
        
        // Days 11-20: Mix Easy + Intermediate
        ...safeAssignDays([...easyExercises, ...interExercises], 10).map((exercises, i) => ({ 
          day: i + 11, 
          exercises 
        })),
        
        // Days 21-30: Mix Easy + Intermediate + Hard
        ...safeAssignDays([...easyExercises, ...interExercises, ...hardExercises], 10).map((exercises, i) => ({ 
          day: i + 21, 
          exercises 
        })),
      ];
      console.log(image);
      
      const newPlan = new Plan({
        title,
        price: Number(price), // 🔥 important
        days: daysArray,
        image,
        buttonText,
        bg: "",              // optional safety
        buttonColor: ""
      });

      await newPlan.save();

      res.status(201).json(newPlan);
    } catch (err) {
      console.error("PLAN ERROR:", err); // 🔥 critical
      res.status(500).json({ msg: "Failed to create plan", error: err.message });
    }
  }
);


admin.delete("/plans/:id", authenticate, admincheck, async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    await plan.deleteOne();
    res.json({ message: "Plan deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



admin.patch("/updateUserDay", authenticate, admincheck, async (req, res) => {
  try {
    const { userName, day } = req.body;
    if (!userName || !day) return res.status(400).json({ msg: "userName and day required" });
    const dayStatus = await DayStatus.findOneAndUpdate(
      { userName, day }, { completed: true }, { upsert: true, new: true }
    );
    res.json({ msg: "Updated", dayStatus });
  } catch (err) {
    res.status(500).json({ msg: "Failed" });
  }
});

export default admin;