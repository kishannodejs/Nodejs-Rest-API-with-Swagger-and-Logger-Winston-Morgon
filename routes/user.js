const express = require("express");
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwt_decode = require('jwt-decode');
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../model/user");
const Role = require("../model/role");
var commonfunc = require('../commonfunction.js');
const winston = require('../config/winston');

/**
 * @method - POST
 * @param - /register
 * @description - User register
 */

router.post(
  "/register", auth,
  [
    check("name", "Please Enter a Valid Name")
      .not()
      .isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("mobile", "Please Enter a Valid Mobile").isMobilePhone(),
    check("password", "Please enter a valid password").isLength({min: 6})
  ],
  async (req, res) => {

     const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { name, email, mobile, password } = req.body;
    try {

      const token = req.header("token");
      const decoded = jwt_decode(token);
      const chkuser =  await User.findById(decoded.user.id);
      
      if(req.url=='/register' && chkuser.role!=1){
        console.log("Not Authorized");
        return res.status(400).json({
          msg: " Only Admin can Create User"
        });
      }



      let user = await User.findOne({$or: [{email: email},{mobile: mobile}, ],});
      if (user) {

        if(user.email==email && user.mobile == mobile) {
          var myuser = "Email and Mobile";
        } else  if (user.email==email) {
          var myuser = "Email";
        } else if(user.mobile == mobile) {
          var myuser = "Mobile";
        }


        return res.status(400).json({
          msg: myuser+" Already Exists",user
        });
      }

      user = new User({
        name,
        email,
        mobile,
        password
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };


      res.status(200).json({
              user
            });

      // jwt.sign(
      //   payload,
      //   process.env.JWTSECRET,
      //   {
      //     expiresIn: 100000
      //   },
      //   (err, token) => {
      //     if (err) throw err;
      //     res.status(200).json({
      //       token,user
      //     });
      //   }
      // );


    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);

router.post(
  "/login",
  [
  //  check("mobile", "Please enter a valid mobile").isMobilePhone(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { email, mobile, password } = req.body;
    try {
      let role = await Role.find();
      let user = await User.findOne({
        email
      });
      if (!user)
        return res.status(400).json({
          message: "User Not Exist"
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Password !"
        });

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.JWTSECRET,
        {
          expiresIn: 3600*24
        },
        (err, token) => {
          if (err) throw err;
          winston.info('Testing for Winston');
          winston.debug(req.body);
          res.status(200).json({
            token,user,role
          });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error"
      });
    }
  }
);

/**
 * @method - POST
 * @description - Get LoggedIn User
 * @param - /user/profile
 */

router.get("/profile", auth, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const user = await User.findById(req.user.id);
    console.log(user)
    res.json(user);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});


router.put("/edit/:id",
[
  check("role", "Please Enter a Role")
    .not()
    .isEmpty()
], auth, async (req, res) => {

  
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
     return res.status(400).json({
       errors: errors.array()
     });
   }

   const { role } = req.body;

console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT",role)
  try {
    // request.user is getting fetched from Middleware after token authentication
    const user =  await User.findOneAndUpdate({
      _id: req.params.id,
  },
  {   
      role:role
  }
  )
    console.log(user)
    res.json(user);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});

router.get("/list", [ commonfunc.isAdminAuthenticated], async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const user = await User.find();
    console.log(user)
    res.json(user);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});

module.exports = router;
