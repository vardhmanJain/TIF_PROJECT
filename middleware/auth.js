const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function auth(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) res.status(401).json({ errorMessage: "Unauthorised" });
    //validate the token or make sure our server has created the token
    const verified = jwt.verify(token, process.env.JWT_SECRET); //throws an err if not verified else returns an object
    const user = await User.findById(verified.user.id, { passwordHash: 0 }); //exclude password hash
    await user.populate("roleId").execPopulate();
    req.user = user;
    console.log(req.user);
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({
      errorMessage: "Unauthorized",
    });
  }
}
module.exports = auth;
