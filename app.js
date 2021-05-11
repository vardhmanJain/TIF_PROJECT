const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routers/userRouter");
const schoolRouter = require("./routers/schoolRouter");
const roleRouter = require("./routers/roleRouter");
const profileRouter = require("./routers/profileRouter");
const cookieParser = require("cookie-parser");
dotenv.config();
//middlewares
const app = express(); //express itself is a function
const PORT = process.env.PORT || 5000; //if port is not defined by service provider the we will use port 5000
//process.env.PORT will return the port which our hosting provider wants us to use
//my computer already has nodemon as a global dependency and not as a devdependency
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
app.use(express.json()); //use express.json() middleware for all incoming requests
app.use(cookieParser()); //this middleware will parse the cookies to req.cookies

//routes
app.get("/test", (req, res) => {
  res.send("hello tehre");
});

//theinternetfolks
//mongodb+srv://tif:<password>@cluster0.4clmc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
//connect to mongodb
mongoose.connect(
  process.env.MDB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) return console.error(err);
    console.log("connected to mongoDB");
  }
);
//setup routes

app.use("/user", userRouter); //use this middleware for requests to /user
app.use("/school", schoolRouter); //use this middleware for requests to /user
app.use("/role", roleRouter); //use this middleware for requests to /user
app.use("/profile", profileRouter); //use this middleware for requests to /user
app.use("/customer", require("./routers/customerRouter"));
