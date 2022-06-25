const mongoose = require('mongoose');
const UserSchema  = new mongoose.Schema({
  name :{
      type  : String,
      required : true
  } ,
  email :{
    type  : String,
    unique : true,
    required : true
} ,
mobile:{ type : Number, 
    unique : true,
     required : true
    } ,
password :{
    type  : String,
    required : true
} ,
role: {
    type: Number,
    default: 4, 
    enum: [1,2,3,4]
}
}, {timestamps: true});
const User= mongoose.model('User',UserSchema);

module.exports = User;