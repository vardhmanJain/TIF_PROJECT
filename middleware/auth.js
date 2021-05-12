const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function auth(req, res, next, scope) {
  try {
    const token = req.cookies.token;
    if (!token) res.status(401).json({ errorMessage: "Unauthorised" });
    //validate the token or make sure our server has created the token
    const verified = jwt.verify(token, process.env.JWT_SECRET); //throws an err if not verified else returns an object
    if (scope != null && !verified.user.role.scopes.includes(scope))
      throw "this user doesent have the required scope";
    req.user = verified.user;
    next();
  } catch (err) {
    res.status(401).json({
      status: false,
      errors: [{ message: "unauthorised" }],
    });
  }
}
module.exports = auth;
