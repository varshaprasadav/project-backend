import mongoose from "mongoose";
import dotenv from "dotenv";
import Exercise from "./models/Exercise.js";

dotenv.config();

export const workoutPool = [


  { name: "Jumping Jacks", type: "Cardio", level: "Easy", video: "https://www.youtube.com/results?search_query=Jumping+Jacks+exercise" },
  { name: "Push Ups", type: "Strength", level: "Easy", video: "https://www.youtube.com/results?search_query=Push+Ups+exercise" },
  { name: "Squats", type: "Strength", level: "Easy", video: "https://www.youtube.com/results?search_query=Bodyweight+Squats+exercise"},
  { name: "Mountain Climbers", type: "Cardio", level: "Easy", video: "https://www.youtube.com/results?search_query=Mountain+Climbers+exercise" },
  { name: "Plank", type: "Core", level: "Easy", video: "https://www.youtube.com/results?search_query=Plank+exercise" },
  { name: "Wall Sit", type: "Strength", level: "Easy", video: "https://www.youtube.com/results?search_query=Wall+Sit+exercise" },
  { name: "Glute Bridges", type: "Strength", level: "Easy", video: "https://www.youtube.com/results?search_query=Glute+Bridge+exercise" },
  { name: "Arm Circles", type: "Cardio", level: "Easy", video: "https://www.youtube.com/results?search_query=Arm+Circles+exercise" },
  { name: "Standing Toe Touch", type: "Stretch", level: "Easy", video: "https://www.youtube.com/results?search_query=Standing+Toe+Touch+stretch" },
  { name: "Side Leg Raises", type: "Strength", level: "Easy", video: "https://www.youtube.com/results?search_query=Side+Leg+Raises+exercise" },
  { name: "High Knee March", type: "Cardio", level: "Easy", video: "https://www.youtube.com/results?search_query=High+Knee+March+exercise" },
  { name: "Heel Raises", type: "Legs", level: "Easy", video: "https://www.youtube.com/results?search_query=Heel+Raises+exercise" },
  { name: "Side Bends", type: "Core", level: "Easy", video: "https://www.youtube.com/results?search_query=Side+Bends+exercise" },
  { name: "Cat-Cow Stretch", type: "Stretch", level: "Easy", video: "https://www.youtube.com/results?search_query=Cat+Cow+Stretch" },
  { name: "Knee Push-ups", type: "Strength", level: "Easy", video: "https://www.youtube.com/results?search_query=Knee+Push-ups+exercise" },

  { name: "Lunges", type: "Legs", level: "Intermediate", video: "https://www.youtube.com/results?search_query=Lunges+exercise",  },
  { name: "Bicycle Crunches", type: "Core", level: "Intermediate", video: "https://www.youtube.com/results?search_query=Bicycle+Crunches+exercise", },
  { name: "Burpees", type: "Full Body", level: "Intermediate", video: "https://www.youtube.com/results?search_query=Burpees+exercise",  },
  { name: "Tricep Dips", type: "Arms", level: "Intermediate", video: "https://www.youtube.com/results?search_query=Tricep+Dips+exercise",  },
  { name: "High Knees", type: "Cardio", level: "Intermediate", video: "https://www.youtube.com/results?search_query=High+Knees+exercise", },
  { name: "Russian Twists", type: "Core", level: "Intermediate", video: "https://www.youtube.com/results?search_query=Russian+Twists+exercise",  },
  { name: "Step-Ups", type: "Legs", level: "Intermediate", video: "https://www.youtube.com/results?search_query=Step-Ups+exercise",},
  { name: "Jump Lunges", type: "Legs", level: "Intermediate", video: "https://www.youtube.com/results?search_query=Jump+Lunges+exercise", },
  { name: "Side Plank", type: "Core", level: "Intermediate", video: "https://www.youtube.com/results?search_query=Side+Plank+exercise",  },
  { name: "Superman", type: "Back", level: "Intermediate", video: "https://www.youtube.com/results?search_query=Superman+exercise", },
  { name: "Skater Jumps", type: "Cardio", level: "Intermediate", video: "https://www.youtube.com/results?search_query=Skater+Jumps+exercise",},
  { name: "Diamond Push-ups", type: "Arms", level: "Intermediate", video: "https://www.youtube.com/results?search_query=Diamond+Push-ups+exercise", },
  { name: "Inchworms", type: "Full Body", level: "Intermediate", video: "https://www.youtube.com/results?search_query=Inchworms+exercise",  },
  { name: "Reverse Lunges", type: "Legs", level: "Intermediate", video: "https://www.youtube.com/results?search_query=Reverse+Lunges+exercise", },
  { name: "Flutter Kicks", type: "Core", level: "Intermediate", video: "https://www.youtube.com/results?search_query=Flutter+Kicks+exercise", },

  { name: "Pull-ups", type: "Strength", level: "Hard", video: "https://www.youtube.com/results?search_query=Pull-ups+exercise" },
  { name: "Pistol Squats", type: "Legs", level: "Hard", video: "https://www.youtube.com/results?search_query=Pistol+Squats+exercise", },
  { name: "Handstand Hold", type: "Full Body", level: "Hard", video: "https://www.youtube.com/results?search_query=Handstand+Hold+exercise", },
  { name: "Decline Push-ups", type: "Arms", level: "Hard", video: "https://www.youtube.com/results?search_query=Decline+Push-ups+exercise", },
  { name: "Jump Squats", type: "Legs", level: "Hard", video: "https://www.youtube.com/results?search_query=Jump+Squats+exercise",},
  { name: "One-Arm Push-ups", type: "Arms", level: "Hard", video: "https://www.youtube.com/results?search_query=One-Arm+Push-ups+exercise", },
  { name: "Burpee Pull-ups", type: "Full Body", level: "Hard", video: "https://www.youtube.com/results?search_query=Burpee+Pull-ups+exercise",  },
  { name: "Tuck Jumps", type: "Legs", level: "Hard", video: "https://www.youtube.com/results?search_query=Tuck+Jumps+exercise",  },
  { name: "L-Sit Hold", type: "Core", level: "Hard", video: "https://www.youtube.com/results?search_query=L-Sit+Hold+exercise", },
  { name: "Dragon Flags", type: "Core", level: "Hard", video: "https://www.youtube.com/results?search_query=Dragon+Flags+exercise",},
  { name: "Clapping Push-ups", type: "Arms", level: "Hard", video: "https://www.youtube.com/results?search_query=Clapping+Push-ups+exercise", },
  { name: "Single-Leg Deadlift", type: "Legs", level: "Hard", video: "https://www.youtube.com/results?search_query=Single-Leg+Deadlift+exercise", },
  { name: "Plyometric Lunges", type: "Legs", level: "Hard", video: "https://www.youtube.com/results?search_query=Plyometric+Lunges+exercise", },
  { name: "Archer Push-ups", type: "Arms", level: "Hard", video: "https://www.youtube.com/results?search_query=Archer+Push-ups+exercise", },
  { name: "Box Jumps", type: "Legs", level: "Hard", video: "https://www.youtube.com/results?search_query=Box+Jumps+exercise",},

];


const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    seedExercises(); // 👉 move seeding AFTER connection
  })
  .catch(err => console.error(err));
  
const seedExercises = async () => {
  try {
    const count = await Exercise.countDocuments();
    if (count > 0) {
      console.log("Exercises already exist. Skipping seeding.");
      process.exit(0);
    }

    await Exercise.insertMany(workoutPool);
    console.log("All exercises saved successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding exercises:", err);
    process.exit(1);
  }
};

if (process.argv[1].includes("seed")) {
  seedExercises();
}

