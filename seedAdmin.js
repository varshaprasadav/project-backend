import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

async function createAdmin() {
  try {
    const existing = await User.findOne({ role: "admin" });  
    if (existing) {
      console.log("Admin already exists, skipping...");
      await mongoose.disconnect();
      process.exit(0);                                      
    }

    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new User({
      userName: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      isPaid: true
    });

    await admin.save();
    console.log("Admin created successfully!");
    await mongoose.disconnect();
    process.exit(0);                                        

  } catch (err) {
    console.error("Error creating admin:", err);
    await mongoose.disconnect();
    process.exit(1);                                         
  }
}

createAdmin();