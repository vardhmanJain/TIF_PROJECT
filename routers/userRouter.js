const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const phone = require("phone");
//---------------signup route-----------------------
router.post(
  "/signup",
  body("email", "please enter a valid email").isEmail(),
  body("password").isLength(
    { min: 8 },
    "password must be atleast 8 characters"
  ),
  body("first_name", "first name is required").exists(),
  body("last_name", "last name is required").exists(),
  body("mobile", "mobile is required").exists(),
  async (req, res) => {
    try {
      //validate using express validator
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      //validate phone using phone validator
      const ph = phone(req.body.mobile, "IN");
      if (!ph[0]) {
        return res.status(400).json({
          status: false,
          errors: [
            { message: "enter a valid mobile number starting with +91" },
          ],
        });
      }
      const { email, password, first_name, last_name, mobile, roleId } =
        req.body;
      //check if user sent the emailid and password
      // if (!email || !password || !first_name || !last_name || !mobile)
      //   return res
      //     .status(400)
      //     .json({ errorMessage: "Please enter all required fields" });
      //check if password is atleast 6 characters long
      // if (password.length < 6)
      //   return res.status(400).json({
      //     errorMessage: "Please enter a password of atleast 6 characters",
      //   });
      //check if there is already an account with this email
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({
          errorMessage: "An account with this email already exists",
        });
      //hash the password
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      //save the new user account to the db
      const newUser = new User({
        email,
        passwordHash,
        last_name,
        first_name,
        mobile,
        roleId,
      });
      const savedUser = await newUser.save();
      await savedUser.populate("roleId").execPopulate();
      //jwt is used for representing secure claims between two parties
      //jwt token = header.payload.verify-signature
      const token = jwt.sign(
        {
          user: {
            first_name,
            last_name,
            id: savedUser._id,
            email,
            mobile,
            created: savedUser.created,
            updated: savedUser.updated,
            role: savedUser.roleId,
          },
        },
        process.env.JWT_SECRET
      );
      //send the token in a HTTP-only cookie so it is not read by js
      res
        .cookie("token", token, {
          httpOnly: true,
        })
        .json({ status: true });
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  }
);
//--------------------signin route-------------------------
router.post(
  "/signin",
  body("email", "enter valid email").isEmail(),
  body("password", "password must me atleast 8 characters long").isLength({
    min: 8,
  }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      if (!email || !password)
        return res
          .status(400)
          .json({ errorMessage: "Please enter all required fields" });

      const existingUser = await User.findOne({ email });
      if (!existingUser)
        return res
          .status(401)
          .json({ errorMessage: "wrong email or password" });
      //compare the entered password with the password associated with the email
      const passwordCorrect = await bcrypt.compare(
        password,
        existingUser.passwordHash
      );
      if (!passwordCorrect)
        return res
          .status(401)
          .json({ errorMessage: "wrong email or password" });
      //now that email and pwd are correct sign the tokent and sent it with the cookie
      await existingUser.populate("roleId").execPopulate();
      const token = jwt.sign(
        {
          user: {
            first_name: existingUser.first_name,
            last_name: existingUser.last_name,
            id: existingUser._id,
            email,
            mobile: existingUser.mobile,
            created: existingUser.created,
            updated: existingUser.updated,
            role: existingUser.roleId,
          },
        },
        process.env.JWT_SECRET
      );
      //send the token in a HTTP-only cookie so it is not read by js
      res
        .cookie("token", token, {
          httpOnly: true,
        })
        .send();
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  }
);
//------------get all users-------user-get--------------
router.get(
  "/",
  (req, res, next) => auth(req, res, next, "user-get"),
  async (req, res) => {
    try {
      const users = await User.find();
      res.json({
        status: true,
        data: users,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: false,
        errors: [{ message: "something went wrong" }],
      });
    }
  }
);
//logout user
router.get("/logout", auth, (req, res) => {
  try {
    res
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(0), //cookie expired in the past so the browser will remove the cookie
      })
      .send();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      errors: [{ message: "something went wrong" }],
    });
  }
});
//------------get a single user------user-get----
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json({
      status: true,
      data: user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: false,
      errors: [{ message: "something went wrong" }],
    });
  }
});
//-------------edit user-------user-edit---
router.patch("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    await User.findByIdAndUpdate(id, { ...req.body });
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
//------------remove user--------user-remove--------
router.delete("/:id", auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
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
