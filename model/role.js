const mongoose = require('mongoose');
const RoleSchema  = new mongoose.Schema({
  name :{
      type  : String,
      required : true
  } ,
roletype: {
    type: Number,
    default: 4, 
    enum: [1,2,3,4]
}
}, {timestamps: true});
const Role= mongoose.model('Role',RoleSchema);

module.exports = Role;