const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwt_decode = require('jwt-decode');


module.exports = function(req, res, next) {
 
  const token = req.header("token");

  var decoded = jwt_decode(token);
console.log("decoded===");
console.log(decoded);
console.log("===decoded");

console.log("url===");
console.log(req.url);
console.log("===url");
//kishan@gmail.com
//let myuser =  User.findOne({_id:decoded.user.id});

let myuser =  User.findOne({email:"kishan@gmail.com"});

console.log("myuser===");
console.log(myuser);
console.log("myuser===");

if(req.url=='/register'){
  console.log("Not Authorized");
}

// console.log("AAAAAAAAAAAAAAAAAAAAAAA--------------"); 
//     console.log(req);
//     console.log("----------------AAAAAAAAAAAAAAAAAAAAAAA"); 

  if (!token) return res.status(401).json({ message: "Auth Error" });

  try {
    const decoded = jwt.verify(token, "randomString");
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Invalid Token" });
  }
};
