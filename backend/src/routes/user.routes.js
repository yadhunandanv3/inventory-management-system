const express = require("express");

const protect =
  require("../middleware/auth.middleware");

const router = express.Router();

router.get(
  "/profile",
  protect,
  async (req, res) => {
    res.json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  }
);

module.exports = router;