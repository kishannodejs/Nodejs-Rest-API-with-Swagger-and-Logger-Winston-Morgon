
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwt_decode = require('jwt-decode');
const User = require("./model/user");
module.exports = {
	isAdminAuthenticated: async function (req, res, next) {

		const token = await req.header("token");

		if (!token) return res.status(401).json({ message: "Auth Error" }); 

  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Invalid Token 222222222222" });
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

		const token = await req.header("token");

		if (!token) return res.status(401).json({ message: "Auth Error" }); 

  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    req.user = decoded.user;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Invalid Token 33333333333" });
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



	// isAuthenticated: function (req, res, next) {
	// 	session = req.session;

	
	// 	var role = session.role;
	// 	if (role == 1 || role == 2 || role == 3 || role == 4)
	// 	return next();
	// 	res.redirect('/users/login');
	// },

	// isClientAuthenticated: function (req, res, next) {
	// 	session = req.session;

	
	// 	var role = session.role;
	// 	if (role == 4)
	// 	return next();
	// 	res.redirect('/users/login');
	// },

	// isAuthenticatedbutnotInspection: function (req, res, next) {
	// 	session = req.session;

	
	// 	var role = session.role;
	// 	if (role == 1 || role == 2 || role == 4)
	// 	return next();
	// 	res.redirect('/users/login');
	// },


	// isAdminClientAuthenticated: function (req, res, next) {
	// 	session = req.session;

	
	// 	var role = session.role;
	// 	if (role == 1 || role == 4)
	// 	return next();
	// 	res.redirect('/users/login');
	// },


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

