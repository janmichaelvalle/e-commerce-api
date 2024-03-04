const User = require("../models/User");
const bcrypt = require("bcrypt");
const auth = require("../auth");

// *REGISTER USER
module.exports.registerUser = (req, res) => {
  if (!req.body.email.includes("@")) {
    return res.status(400).send({ error: "Email invalid" });
  } else if (req.body.mobileNo.length !== 11) {
    return res.status(400).send({ error: "Mobile number invalid" });
  } else if (req.body.password.length < 8) {
    return res
      .status(400)
      .send({ error: "Password must be at least 8 characters" });
  } else {
    let newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobileNo: req.body.mobileNo,
      password: bcrypt.hashSync(req.body.password, 10),
    });

    return newUser
      .save()
      .then((result) =>
        res
          .status(201)
          .send({ message: "Registered Successfully", newUser: newUser })
      )
      .catch((err) => {
        console.error("Error in saving: ", err);
        return res.status(500).send({ error: "Error in save" });
      });
  }
};

// * GET ALL USERS
module.exports.getAllUsers = (req, res) => {
  return User.find({})
  .then((users) => {
    return res.status(200).send({users})
  })
}

// *USER LOGIN
module.exports.loginUser = (req, res) => {
  if (req.body.email.includes("@")) {
    return User.findOne({ email: req.body.email })
      .then((result) => {
        if (result == null) {
          return res.status(404).send({ error: "No Email Found" });
        } else {
          const isPasswordCorrect = bcrypt.compareSync(
            req.body.password,
            result.password
          );

          if (isPasswordCorrect) {
            return res
              .status(200)
              .send({ access: auth.createAccessToken(result) });
          } else {
            return res
              .status(401)
              .send({ message: "Email and password do not match" });
          }
        }
      })
      .catch((err) => {
        console.log("Error in find: ", err);
        res.status(500).send({ error: "Error in find" });
      });
  } else {
    return res.status(400).send({ error: "Invalid Email" });
  }
};

// * RETREIVE USER DETAILS
module.exports.getProfile = (req, res) => {
  const userId = req.user.id;
  User.findById(userId)
  .then(user => {
      if (!user) {
          return res.status(404).send({ error: 'User not found' });
      }        
      user.password = undefined;
      return res.status(200).send({ user });
  })
  .catch(err => {
    console.error("Error in fetching user profile", err)
    return res.status(500).send({ error: 'Failed to fetch user profile' })
  });
};

// * UPDATE USER TO ADMIN

module.exports.updateUserToAdmin = (req, res) => {
  return User.findOneAndUpdate(
    { _id: req.params.userId },
    { isAdmin: true },
    { new: true }
  ).then((result) => {
    if (result == null) {
      return res.status(404).send({ error: "No user found" });
    } else {
      return res.status(200).send({message: "User changed to admin"});
    }
  }).catch((error) => {
    console.error("Error updating user:", error);
    return res.status(500).send({ error: "Internal server error" });
  });
};

module.exports.updatePassword = (req, res) => {
  const newPassword = req.body.newPassword;
  User.findOneAndUpdate(
    { _id: req.user.id },
    { password: bcrypt.hashSync(newPassword, 10) },
    { new: true }
  ).then((result) => {
    if (result == null) {
      return res.status(404).send({ error: "No user found" });
    } else {
      return res.status(200).send({ message: "Password successfully changed" });
    }
  }).catch((error) => {
    console.error("Error updating user:", error);
    return res.status(500).send({ error: "Internal server error" });
  });
};