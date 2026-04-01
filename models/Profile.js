import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true }, 
  firstName: String,
  lastName: String,
  dob: String,
  age: Number,
  height: String,
  weight: String,
  gender: String,
  fitnessLevel: String,
  fitnessGoal: String,
  activityLevel: String,
}, { timestamps: true });

export default mongoose.model("Profile", profileSchema);