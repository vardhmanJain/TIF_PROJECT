const express = require("express");
const router = express.Router();
const School = require("../models/School");
const Profile = require("../models/Profile");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
//-----------------create a school----------school-create----
router.post(
  "/",
  (req, res, next) => auth(req, res, next, "school-create"),
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
      //public_id = mongoose.mongo.BSONPure.ObjectID.fromHexString(public_id);
      const newSchool = new School({
        name,
        city,
        state,
        country,
        public_id,
      });
      const savedSchool = await newSchool.save();
      res.json({ status: true });
    } catch (err) {
      // console.log(err);
      res.status(500).json({
        status: false,
        errors: [{ message: "something went wrong" }],
      });
    }
  }
);
//--------------fetch all schools-------------school-get----
router.get(
  "/",
  (req, res, next) => auth(req, res, next, "school-get"),
  async (req, res) => {
    try {
      const schools = await School.find();
      res.json({
        status: true,
        data: schools,
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
//-----------edit school--------------school-edit---------
router.patch(
  "/:id",
  (req, res, next) => auth(req, res, next, "school-edit"),
  async (req, res) => {
    try {
      const id = req.params.id;
      const updated = Date.now();
      await School.findByIdAndUpdate(
        id,
        { ...req.body, updated },
        { runValidators: true }
      );
      res.json({ status: true });
    } catch (err) {
      // console.log(err);
      res.status(500).json({
        status: false,
        errors: [{ message: "something went wrong" }],
      });
    }
  }
);
//-----------get all students----------------school-get-------------
router.get(
  "/:id/students",
  (req, res, next) => auth(req, res, next, "school-get"),
  async (req, res) => {
    try {
      const id = req.params.id;
      const { public_id, name, city, state, country } = await School.findById(
        id
      );
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
      // console.log(err);
      res.status(500).json({
        status: false,
        errors: [{ message: "something went wrong" }],
      });
    }
  }
);

module.exports = router;
