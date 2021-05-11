const Profile = require("../models/Profile");

const router = require("express").Router();
//------------create a new profile---------profile-create--------
router.post("/", async (req, res) => {
  try {
    const { first_name, last_name, userId, schoolId } = req.body;
    const newProfile = new Profile({
      first_name,
      last_name,
      userId,
      schoolId,
    });
    await newProfile.save();
    res.json({ status: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      errors: [{ message: "something went wrong" }],
    });
  }
});
//------------get all profiles---------profile-get------
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json({
      status: true,
      data: profiles,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      errors: [{ message: "something went wrong" }],
    });
  }
});
module.exports = router;
