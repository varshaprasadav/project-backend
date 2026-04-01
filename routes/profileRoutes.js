import express from "express";
import Profile from "../models/Profile.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      userName,
      firstName,
      lastName,
      dob,
      age,
      height,
      weight,
      gender,
      fitnessLevel,
      fitnessGoal,
      level, 
    } = req.body;

    if (!userName || !firstName || !lastName) {
      return res.status(400).json({ msg: "Required fields missing" });
    }

    const existing = await Profile.findOne({ userName });
    if (existing) {
      return res.status(400).json({ msg: "Profile already exists" });
    }

    const profile = new Profile({
      userName,
      firstName,
      lastName,
      dob,
      age: Number(age),
      height,
      weight,
      gender,
      fitnessLevel,
      fitnessGoal,
      activityLevel: level, 
    });

    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Profile save failed" });
  }
});

router.patch("/update", async (req, res) => {
  try {
    const { userName, level, age, ...rest } = req.body;

    if (!userName) {
      return res.status(400).json({ msg: "Username is required for update" });
    }

    const updates = {
      ...rest,
      activityLevel: level,
    };
    if (age) updates.age = Number(age);

    const profile = await Profile.findOneAndUpdate(
      { userName },
      updates,
      { new: true }
    );

    if (!profile) return res.status(404).json({ msg: "Profile not found" });

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Update failed" });
  }
});

router.get("/:userName", async (req, res) => {
  try {
    const { userName } = req.params;
    const profile = await Profile.findOne({ userName });
    if (!profile) return res.status(404).json({ msg: "Profile not found" });

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Fetch failed" });
  }
});

export default router;