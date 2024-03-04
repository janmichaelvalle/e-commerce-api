const express = require("express");
const userController = require("../controllers/userController")
const {verify, verifyAdmin} = require("../auth");

const router = express.Router();

router.post("/", userController.registerUser);

router.get("/all", verify, verifyAdmin, userController.getAllUsers)

router.post("/login", userController.loginUser);

router.get("/details", verify, userController.getProfile);

router.patch("/:userId/set-as-admin", verify, verifyAdmin, userController.updateUserToAdmin);

router.patch("/update-password", verify, userController.updatePassword);



module.exports = router;