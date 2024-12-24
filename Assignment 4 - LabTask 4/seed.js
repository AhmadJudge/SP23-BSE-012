const mongoose = require("mongoose");
const User = require("./models/user.models");

const connectionString = "mongodb://localhost:27017/ideas";
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

mongoose
  .connect(connectionString)
  .then(async () => {
    const existingSuperadmin = await User.findOne({ role: "superadmin" });

    if (!existingSuperadmin) {
      const superadmin = new User({
        username: "Superadmin",
        email: "superadmin@example.com",
        password: "securepassword",
        role: "superadmin",
        isApproved: true,
      });
      await superadmin.save();
      console.log("Superadmin account created!");
    } else {
      console.log("Superadmin already exists.");
    }

    mongoose.disconnect();
  })
  .catch((err) => console.error("Database error:", err));
