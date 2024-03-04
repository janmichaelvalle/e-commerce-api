const express = require("express");
const productController = require("../controllers/productController");
const { verify, verifyAdmin } = require("../auth");

const router = express.Router();

router.get("/searchByName", productController.searchByName);

router.get("/searchByPrice", productController.searchByPrice);


router.post("/", verify, verifyAdmin, productController.addProduct);

router.get("/all", verify, verifyAdmin, productController.getAllProducts);

router.get("/", productController.getActiveProducts);

router.get("/:productId", productController.getProduct);

router.patch("/:productId/update", verify, verifyAdmin, productController.updateProduct);

router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);




module.exports = router;