import express from "express";
import Plan from "../models/Plan.js";

const router = express.Router();

router.get("/plans/id/:id", async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id)
      .populate({
        path: "days.exercises",
        model: "Exercise"
      });

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    console.log("✅ Fetched plan:", plan.title);
    console.log(`   Days: ${plan.days.length}, First day exercises: ${plan.days[0]?.exercises?.length || 0}`);

    res.json(plan);
  } catch (err) {
    console.error("Error fetching plan:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;