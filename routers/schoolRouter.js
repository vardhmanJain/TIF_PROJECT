const express = require("express");
const router = express.Router();
const School = require("../models/School");
const Profile = require("../models/Profile");
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
//-----------------create a school----------school-create----
router.post(
  "/",
  auth,
  body("name", "name is required").exists(),
  body("city", "city is required").exists(),
  body("state", "state is required").exists(),
  body("country", "country is required").exists(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { name, city, state, country, public_id } = req.body;
      const newSchool = new School({
        name,
        city,
        state,
        country,
      });
      const savedSchool = await newSchool.save();
      res.json({ status: true });
    } catch (err) {
      console.log(err);
      res.send(500).json({
        status: false,
        errors: [{ message: "something went wrong" }],
      });
    }
  }
);
//--------------fetch all schools-------------school-get----
router.get("/", auth, async (req, res) => {
  try {
    const schools = await School.find();
    res.json({
      status: true,
      data: schools,
    });
  } catch (err) {
    console.log(err);
    res.send(500).json({
      status: false,
      errors: [{ message: "something went wrong" }],
    });
  }
});
//-----------edit school--------------school-edit---------
router.patch("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    await School.findByIdAndUpdate(id, { ...req.body });
    res.json({ status: true });
  } catch (err) {
    console.log(err);
    res.send(500).json({
      status: false,
      errors: [{ message: "something went wrong" }],
    });
  }
});
//-----------get all students----------------school-get-------------
router.get("/:id/students", auth, async (req, res) => {
  try {
    const id = req.params.id;

    const { public_id, name, city, state, country } = await School.findById(id);
    // const school = await School.findById(id);

    const students = await Profile.find({ schoolId: id }, [
      "-created",
      "-updated",
    ]);
    console.log(students);
    res.json({
      status: true,
      data: {
        _id: id,
        public_id,
        name,
        city,
        state,
        country,
        // ...school._doc,
        students,
      },
    });
  } catch (err) {
    console.log(err);
    res.send(500).json({
      status: false,
      errors: [{ message: "something went wrong" }],
    });
  }
});

module.exports = router;
