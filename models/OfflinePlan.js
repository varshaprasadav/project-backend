
import mongoose from "mongoose";

const offlinePlanSchema = new mongoose.Schema({
  price: Number,
  duration: String,        
  packageName: String,     
  note: String,            
  features: [String],      
});

export default mongoose.model("OfflinePlan", offlinePlanSchema);