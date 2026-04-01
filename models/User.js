import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName:          { type: String, required: true, unique: true },
  email:             { type: String, required: true, unique: true },
  password:          { type: String, required: true },
  role:              { type: String, default: "user" },
  isPaid:            { type: Boolean, default: false },
  subscriptionStart: { type: Date, default: null },
  currentPlan:       { type: mongoose.Schema.Types.ObjectId, ref: "Plan", default: null },
});

export default mongoose.model("User", userSchema);