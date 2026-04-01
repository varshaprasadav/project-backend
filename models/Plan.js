import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  title: String,
  price: Number,
  days: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },  // ✅ Added _id
      day: Number,
      exercises: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Exercise"
        }
      ]
    }
  ],
  bg: String,
  image: String,
  buttonColor: String,
  buttonText: String,
});

export default mongoose.model("Plan", planSchema);