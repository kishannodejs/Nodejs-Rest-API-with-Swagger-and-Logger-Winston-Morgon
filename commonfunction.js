
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwt_decode = require('jwt-decode');
const User = require("./model/user");
module.exports = {
	isAdminAuthenticated: async function (req, res, next) {
		console.log("PPPPPPPPPPPPPPPP");
		console.log( req.header);
		console.log("PPPPPPPPPPPPPPPP");
		const token = await req.header("token");

		if (!token) return res.status(401).json({ message: "Auth Error" }); 

  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Invalid Token" });
  }
		const decoded = jwt_decode(token);

const myuser =  await User.findById(decoded.user.id);

if(myuser.role!=1){
	console.log("Not Authorized");
	return res.status(400).json({
	  msg: " Only Admin can List User"
	});
  }  
	},

	isClientAuthenticated: async function (req, res, next) {

		console.log("qqqqqqq");
		console.log( req.header);
		console.log("qqqqqqqqqqqqqq");

		const token = await req.header("token");

		if (!token) return res.status(401).json({ message: "Auth Error" }); 

  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Invalid Token" });
  }
		const decoded = jwt_decode(token);

const myuser =  await User.findById(decoded.user.id);

if(myuser.role!=1 && myuser.role!=4){
	console.log("Not Authorized");
	return res.status(400).json({
	  msg: " Only Admin can List User"
	});
  }  
	},


	isInspectionAuthenticated: async function (req, res, next) {


		console.log("rrrrrrrrrr");
		console.log( req.header);
		console.log("rrrrrrrrrrrr");

		const token = await req.header("token");

		if (!token) return res.status(401).json({ message: "Auth Error" }); 

  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Invalid Token" });
  }
		const decoded = jwt_decode(token);

const myuser =  await User.findById(decoded.user.id);

if(myuser.role!=1 && myuser.role!=3){
	console.log("Not Authorized");
	return res.status(400).json({
	  msg: "Admin or Inspection Manager Can create Order"
	});
  }  
	},


	isProcurementAuthenticated: async function (req, res, next) {

		console.log("sssssssssss");
		console.log( req.header);
		console.log("sssssssssssss");

		const token = await req.header("token");

		if (!token) return res.status(401).json({ message: "Auth Error" }); 

  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Invalid Token" });
  }
		const decoded = jwt_decode(token);

const myuser =  await User.findById(decoded.user.id);

if(myuser.role!=1 && myuser.role!=2){
	console.log("Not Authorized");
	return res.status(400).json({
	  msg: "Admin or Procurement have Permission"
	});
  }  
	},

	encrypt: function (text) {
		var cipher = crypto.createCipher('aes-256-cbc','d6F3Efeq')
		var crypted = cipher.update(text,'utf8','hex')
		crypted += cipher.final('hex');
		return crypted;
	},
	decrypt : function (text) {
		var decipher = crypto.createDecipher('aes-256-cbc','d6F3Efeq')
		var dec = decipher.update(text,'hex','utf8')
		dec += decipher.final('utf8');
		return dec;
	},
	jsUcfirst : function (string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
};

