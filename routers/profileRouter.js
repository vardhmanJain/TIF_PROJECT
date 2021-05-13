const Profile = require("../models/Profile");
const { body, validationResult } = require("express-validator");
const router = require("express").Router();
const auth = require("../middleware/auth");
//------------create a new profile---------profile-create--------
router.post(
  "/",
  (req, res, next) => auth(req, res, next, "profile-create"),
  body("first_name", "first name is required").exists(),
  body("last_name", "last name is required").exists(),
  body("userId", "user id is required").exists(),
  body("schoolId", "school id is required").exists(),
  body("classroom", "classroom is required").exists(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { first_name, last_name, userId, schoolId, classroom } = req.body;
      const newProfile = new Profile({
        first_name,
        last_name,
        userId,
        schoolId,
        classroom,
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
  }
);
//------------get all profiles---------profile-get------
router.get(
  "/",
  (req, res, next) => auth(req, res, next, "profile-get"),
  async (req, res) => {
    try {
      const profiles = await Profile.find();
      res.json({
        status: true,
        content: {
          data: profiles,
        },
      });
    } catch (err) {
      // console.log(err);
      res.status(500).json({
        status: false,
        errors: [{ message: "something went wrong" }],
      });
    }
  }
);
module.exports = router;
