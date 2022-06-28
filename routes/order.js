const express = require("express");
var multer  = require('multer');
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwt_decode = require('jwt-decode');
const router = express.Router();
const auth = require("../middleware/auth");
const Order = require("../model/order");
var commonfunc = require('../commonfunction.js');


const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "./public/images/uploads/order/");
    },
    filename(req, file, cb) {
      cb(null, `${new Date().getTime()}_${file.originalname}`);
    },
  }),
  limits: {
    fileSize: 1000000, // max file size 1MB = 1000000 bytes
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls|jfif)$/)) {
      return cb(
        new Error(
          "only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format."
        )
      );
    }
    cb(undefined, true); // continue with upload
  },
});

router.post("/", commonfunc.isInspectionAuthenticated,
[
  check("cooler", "Please Enter a Cooler")
  .not()
  .isEmpty(),
  check("order_file", "Please Attach file").notEmpty()

], upload.single('order_file'),  async (req, res) => {

console.log("AAAAAAAAAAAA");
console.log(req.file)
console.log("AAAAAAAAAAAA");


  

  const {cooler, category, licence, driver_number, vehicle_rc, note, order_number, order_file} = req.body;
  const newOrder = new Order({
        cooler : cooler,
        category : category,
        licence : licence,
        driver_number: driver_number,
        vehicle_rc : vehicle_rc,
        note : note,
        order_number:order_number,
        image_path:req.file.filename
    });

    console.log(newOrder);

  try{   
    await newOrder.save()
    
    res.json({newOrder:newOrder});
} catch (e) {
    res.status(401).json({message: e.message});
}

});


router.get("/list", auth, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const order = await Order.find();
    console.log(order)
    res.json(order);
  } catch (e) {
    res.send({ message: "Error in Fetching Order" });
  }
});


router.get("/:id", auth, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const order = await Order.findById(req.params.id);
    console.log(order)
    res.json(order);
  } catch (e) {
    res.send({ message: "Error in Fetching order" });
  }
});

router.post("/:id", commonfunc.isInspectionAuthenticated, upload.single('order_file'), async (req, res) => {

  const {cooler, category, licence, driver_number, vehicle_rc, order_number, order_file} = req.body;

  try{   
    await Order.findOneAndUpdate({
        _id: req.params.id,
    },
    {   
        cooler : cooler,
        category : category,
        licence : licence,
        driver_number: driver_number,
        vehicle_rc : vehicle_rc,
        order_number:order_number,
        image_path:req.file.filename
    }
    )   
    res.json({message:"Order updated successfully .."});
} catch (e) {
    res.status(401).json({message: e.message});
}

});

module.exports = router;
