const express = require("express");
const orderController = require("../controllers/orderController");
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

router.post("/checkout", verify, orderController.checkout)

router.get("/my-orders", verify, orderController.myOrders);

router.get("/all-orders", verify, verifyAdmin, orderController.allOrders)



module.exports = router;