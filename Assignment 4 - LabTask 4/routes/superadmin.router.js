const express = require("express");
const router = express.Router();
const User = require("../models/user.models");
const { isSuperadmin } = require("../middleware/auth");

// View all unapproved users
router.get("/admin/superadmin", isSuperadmin, async (req, res) => {
  try {
    const unapprovedUsers = await User.find({ isApproved: false }); // Fetch unapproved users
    res.render("admin/superadmin", { users: unapprovedUsers,  layout: "admin/admin-layout"  }); // Pass users to template
  } catch (error) {
    console.error("Error fetching unapproved users:", error);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
});

// Approve a user
router.post("/superadmin/approve/:id", isSuperadmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    user.isApproved = true;
    await user.save();
    res.redirect("/admin/superadmin");
  } catch (error) {
    console.error("Approval error:", error);
    res.status(500).send("An error occurred while approving the user.");
  }
});

// Disapprove a user
router.post("/superadmin/disapprove/:id", isSuperadmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    await User.findByIdAndDelete(userId); // Delete user
    res.redirect("/admin/superadmin");
  } catch (error) {
    console.error("Disapproval error:", error);
    res.status(500).send("An error occurred while disapproving the user.");
  }
});

module.exports = router;
