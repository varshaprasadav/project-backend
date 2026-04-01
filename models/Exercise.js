import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String },
  level: { type: String },
  video: { type: String },
  image: { type: String } 
});

export default mongoose.model("Exercise", ExerciseSchema);