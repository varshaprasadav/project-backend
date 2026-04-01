import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  name:      String,
  email:     String,
  phone:     String,
  age:       String,
  gender:    String,
  address:   String,
  goal:      String,
  time:      String,
  startDate: String,
  plan:      String,
  price:     Number,
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);