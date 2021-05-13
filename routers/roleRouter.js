const router = require("express").Router();
const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const Role = require("../models/Role");
//-----------create a new role--------
router.post(
  "/",
  auth,
  body("name", "name is required").exists(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { name, scopes } = req.body;
      const newRole = new Role({ name, scopes });
      await newRole.save();
      res.json({ status: true });
    } catch (err) {
      res.status(500).json({
        status: false,
        errors: [{ message: "something went wrong" }],
      });
    }
  }
);
//--------------get all roles-------role-get---
router.get(
  "/",
  (req, res, next) => auth(req, res, next, "role-get"),
  async (req, res) => {
    try {
      const roles = await Role.find();
      res.json({
        status: true,
        content: {
          data: roles,
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
//---------------edit a role--------role-edit-----
router.patch(
  "/:id",
  (req, res, next) => auth(req, res, next, "role-edit"),
  async (req, res) => {
    try {
      const id = req.params.id;
      const updated = Date.now();
      const role = await Role.findByIdAndUpdate(
        id,
        { ...req.body, updated },
        { runValidators: true }
      );
      if (!role) {
        return res.status(404).json({
          status: false,
          errors: [{ message: "the role does not exist" }],
        });
      }
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
//-----------------delete a role-------role-remove--------
router.delete(
  "/:id",
  (req, res, next) => auth(req, res, next, "role-remove"),
  async (req, res) => {
    try {
      await Role.findByIdAndDelete(req.params.id);
      res.json({
        status: true,
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
