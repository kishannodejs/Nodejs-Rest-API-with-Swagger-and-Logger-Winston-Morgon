const express = require("express");
var multer  = require('multer');
const { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwt_decode = require('jwt-decode');
const router = express.Router();
const auth = require("../middleware/auth");
const Checklist = require("../model/checklist");
var commonfunc = require('../commonfunction.js');


const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "./public/images/uploads/checklist/");
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

router.post("/",commonfunc.isClientAuthenticated, upload.single('order_file'),  async (req, res) => {
console.log("AAAAAAAAAAAA");
console.log(req.file)
console.log("AAAAAAAAAAAA");
  console.log(req);

  

  const {cooler, category, licence, driver_number, vehicle_rc, order_number, order_file} = req.body;
  const newChecklist = new Checklist({
    cooler : cooler,
    category : category,
    licence : licence,
    driver_number: driver_number,
    vehicle_rc : vehicle_rc,
    order_number:order_number,
    image_path:req.file.filename
});

console.log(newChecklist);
  try{   
    await newChecklist.save()
    
    res.json({newChecklist:newChecklist});
} catch (e) {
    res.status(401).json({message: e.message});
}

});


router.get("/list", auth, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const checklist = await Checklist.find();
    console.log(checklist)
    res.json(checklist);
  } catch (e) {
    res.send({ message: "Error in Fetching checklist" });
  }
});


router.get("/:id", auth, async (req, res) => {
  try {
    // request.user is getting fetched from Middleware after token authentication
    const checklist = await Checklist.findById(req.params.id);
    console.log(checklist)
    res.json(checklist);
  } catch (e) {
    res.send({ message: "Error in Fetching checklist" });
  }
});

router.post("/:id", commonfunc.isProcurementAuthenticated, upload.single('order_file'), async (req, res) => {

  const {cooler, category, licence, driver_number, vehicle_rc, order_number, status, order_file} = req.body;

  try{   
    await Checklist.findOneAndUpdate({
        _id: req.params.id,
    },
    {   
        cooler : cooler,
        category : category,
        licence : licence,
        driver_number: driver_number,
        vehicle_rc : vehicle_rc,
        order_number:order_number,
        status:status,
        image_path:req.file.filename
    }
    )   
    res.json({message:"Checklist updated successfully .."});
} catch (e) {
    res.status(401).json({message: e.message});
}

});

module.exports = router;
