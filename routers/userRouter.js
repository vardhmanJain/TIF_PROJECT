const router = require("express").Router();
const User = require("../models/User");
const Profile = require("../models/Profile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const phone = require("phone");
//---------------signup route-----------------------
router.post(
  "/signup",
  body("email", "please enter a valid email").isEmail(),
  body("password", "password must be atleast 8 characters long").isLength({
    min: 8,
  }),
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
      //check if user sent the emailid and password without using express-validator
      // if (!email || !password || !first_name || !last_name || !mobile) return res.status(400).json({ errorMessage: "Please enter all required fields" });
      //check if password is atleast 6 characters long
      // if (password.length < 6)return res.status(400).json({errorMessage: "Please enter a password of atleast 6 characters",});
      //check if there is already an account with this email
      const existingUser = await User.findOne({
        $or: [{ email }, { mobile }],
      });
      if (existingUser)
        return res.status(400).json({
          errorMessage: "An account with this email or mobile already exists",
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
      await savedUser.populate("roleId").execPopulate(); //populate the roleId fileld in user documetnt so that scope verification becomes easier
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
      console.log(err);
      res.status(500).json({
        status: false,
        errors: [{ message: "something went wrong" }],
      });
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
      //define payload sent in token and with the res object too
      const user = {
        first_name: existingUser.first_name,
        last_name: existingUser.last_name,
        id: existingUser._id,
        email,
        mobile: existingUser.mobile,
        created: existingUser.created,
        updated: existingUser.updated,
        role: existingUser.roleId,
      };
      const token = jwt.sign({ user }, process.env.JWT_SECRET);
      //send the token in a HTTP-only cookie so it is not read by js
      res
        .cookie("token", token, {
          httpOnly: true,
        })
        .json({ status: true, data: user, token });
    } catch (err) {
      // console.log(err);
      res.status(500).json({
        status: false,
        errors: [{ message: "something went wrong" }],
      });
    }
  }
);
//------------get all users-------user-get--------------
router.get(
  "/",
  (req, res, next) => auth(req, res, next, "user-get"),
  async (req, res) => {
    try {
      const users = await User.find({}, "-passwordHash");
      res.json({
        status: true,
        content: {
          data: users,
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
//logout user
router.get("/logout", auth, (req, res) => {
  try {
    res
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(0), //cookie expired in the past so the browser will remove the cookie
      })
      .json({ status: true });
  } catch (err) {
    // console.log(err);
    res.status(500).json({
      status: false,
      errors: [{ message: "something went wrong" }],
    });
  }
});
//------------get a single user------user-get----
router.get(
  "/:id",
  (req, res, next) => auth(req, res, next, "user-get"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id, "-passwordHash");
      res.json({
        status: true,
        content: {
          data: user,
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
//-------------edit user-------user-edit---
router.patch(
  "/:id",
  (req, res, next) => auth(req, res, next, "user-edit"),
  async (req, res) => {
    try {
      //validate phone
      if (req.body.mobile) {
        const ph = phone(req.mobile, "IN");
        if (!ph[0]) {
          return res.status(400).json({
            status: false,
            errors: [
              { message: "enter a valid mobile number starting with +91" },
            ],
          });
        }
      }
      //hash password before updating
      if (req.body.password) {
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(req.body.password, salt);
        req.body.passwordHash = passwordHash;
      }
      const id = req.params.id;
      const updated = Date.now();
      //update user
      await User.findByIdAndUpdate(
        id,
        { ...req.body, updated },
        { runValidators: true }
      );
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
  }
);
//------------remove user--------user-remove--------
router.delete(
  "/:id",
  (req, res, next) => auth(req, res, next, "user-remove"),
  async (req, res) => {
    try {
      const id = req.params.id;
      await User.findByIdAndDelete(id);
      await Profile.deleteOne({ userId: id }); //delete profile related with the user
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
