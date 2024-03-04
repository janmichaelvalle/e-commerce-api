const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"]
  },

  lastName : {
    type: String,
    required: [true, "Last name is required."]
  },
  email: {
    type: String,
    required: [true, "Email is required."]
  },
  password: {
    type: String,
    require: [true, "Password is required"]
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  mobileNo: {
    type: String,
    require: [true, "Mobile number is required"]
  }
});

module.exports = mongoose.model("User", userSchema)