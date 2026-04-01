import mongoose from "mongoose";

const dayStatusSchema = new mongoose.Schema({
  userName:    { type: String, required: true },
  planId:      { type: String, required: true },  
  day:         { type: Number, required: true },  
  completed:   { type: Boolean, default: false },
  inProgress:  { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
});

dayStatusSchema.index({ userName: 1, planId: 1, day: 1 }, { unique: true });

export default mongoose.model("DayStatus", dayStatusSchema);