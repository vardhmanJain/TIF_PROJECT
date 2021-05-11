const router = require("express").Router();
const auth = require("../middleware/auth");
const Role = require("../models/Role");
//-----------create a new role--------
router.post("/", async (req, res) => {
  try {
    const { name, scopes } = req.body;
    const newRole = new Role({ name, scopes });
    await newRole.save();
    res.json({ status: true });
  } catch (err) {
    console.log(err);
    res.send(500).json({
      status: false,
      errors: [{ message: "something went wrong" }],
    });
  }
});
//--------------get all roles-------role-get---
router.get("/", async (req, res) => {
  try {
    const roles = await Role.find();
    res.json({
      status: true,
      data: roles,
    });
  } catch (err) {
    console.log(err);
    res.send(500).json({
      status: false,
      errors: [{ message: "something went wrong" }],
    });
  }
});
//---------------edit a role--------role-edit-----
router.patch("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    await Role.findByIdAndUpdate(id, { ...req.body });
    res.json({ status: true });
  } catch (err) {
    console.log(err);
    res.send(500).json({
      status: false,
      errors: [{ message: "something went wrong" }],
    });
  }
});
//-----------------delete a role-------role-remove--------
router.delete("/:id", auth, async (req, res) => {
  try {
    await Role.findByIdAndDelete(req.params.id);
    res.json({
      status: true,
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
