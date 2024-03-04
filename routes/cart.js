const express = require("express");
const cartController = require("../controllers/cartController");
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

router.post("/add-to-cart", verify, cartController.addToCart);
router.get("/get-cart", verify, cartController.getCart);
router.post("/update-cart", verify, cartController.updateCart);
router.patch("/:productId/remove-from-cart", verify, cartController.removeProduct)
router.put("/clear-cart", verify, cartController.clearCart);



module.exports = router;
