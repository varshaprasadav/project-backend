import express from "express";
import OfflinePlan from "../models/OfflinePlan.js";

const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const { price, duration, packageName, note, features } = req.body;

    const newPlan = new OfflinePlan({
      price,
      duration,
      packageName, 
      note,        
      features,
    });

    await newPlan.save();
    res.json(newPlan);
  } catch (err) {
    res.status(500).json({ msg: "Error creating plan" });
  }
});




router.get("/", async (req, res) => {
  try {
    const plans = await OfflinePlan.find(); 
    res.json(plans);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching plans" });
  }
});




router.delete("/:id", async (req, res) => {
  try {
    await OfflinePlan.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed" });
  }
});

export default router;