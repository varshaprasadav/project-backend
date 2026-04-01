import mongoose from "mongoose";

const offlineSchema = new mongoose.Schema({

  userName: String,
  email: String,
  phone: String,
  plan: String,

  bookedAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("OfflineUser", offlineSchema);