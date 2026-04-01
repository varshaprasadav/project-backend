import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();



router.post("/", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ success: true, message: "Booking saved", booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});



router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.delete("/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});




export default router;