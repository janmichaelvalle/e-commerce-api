const Product = require("../models/Product");
const auth = require("../auth");

// *CREATE PRODUCT (ADMIN ONLY);
module.exports.addProduct = (req, res) => {
  let newProduct = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
  });
  Product.findOne({ name: req.body.name }).then((existingProduct) => {
    if (existingProduct) {
      return res.status(409).send({ error: "Product already exists" });
    }
    return newProduct.save().then((savedProduct) => {
      res.status(201).send(savedProduct);
    });
  });
};

// * GET ALL PRODUCTS
module.exports.getAllProducts = (req, res) => {
  Product.find({})
    .then((allProducts) => {
      if (allProducts.length > 0) {
        return res.status(200).send({ allProducts: allProducts });
      } else {
        res.status(200).send({ message: "No products found" });
      }
    })
    .catch((err) => {
      console.llog("Error finding all products", err);
      return res.status(500).send({ error: "Error finding products" });
    });
};

// ** GET ALL ACTIVE PRODUCTS
module.exports.getActiveProducts = (req, res) => {
  Product.find({ isActive: true })
    .then((allProducts) => {
      if (allProducts.length > 0) {
        return res.status(200).send({ allProducts: allProducts });
      } else {
        res.status(200).send({ message: "No products found" });
      }
    })
    .catch((err) => {
      console.log("Error finding all products", err);
      return res.status(500).send({ error: "Error finding products" });
    });
};

// ** RETRIEVE SINGLE PRODUCT
module.exports.getProduct = (req, res) => {
  Product.find({ _id: req.params.productId })
    .then((product) => {
      if (product.length === 0) {
        console.log(product);
        return res.status(200).send({ message: "Product not found" });
      } else {
        return res.status(200).send({ product });
      }
    })
    .catch((err) => {
      console.log("Error in finding the product", err);
      return res.status(500).send({ error: "Error finding product" });
    });
};

// * UPDATE PRODUCT INFO
module.exports.updateProduct = (req, res) => {
  Product.findOneAndUpdate(
    { _id: req.params.productId },
    {
      $set: {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
      },
    },
    { new: true }
  )
    .then((updatedProduct) => {
      if (!updatedProduct) {
        return res.status(204).send({ errr: "Product not found" });
      } else {
        return res.status(200).send({
          message: "Product updated successfully",
          updatedProduct: updatedProduct,
        });
      }
    })
    .catch((err) => {
      console.log("Error in updating the product", err);
      return res.status(500).send({ error: "Error updating the product" });
    });
};

// * ARCHIVE PRODUCT
module.exports.archiveProduct = (req, res) => {
  Product.findOneAndUpdate(
    { _id: req.params.productId },
    { isActive: false },
    { new: true }
  )
    .then((archiveProduct) => {
      if (!archiveProduct) {
        return res.status(204).send({ errr: "Product not found" });
      } else {
        return res.status(200).send({
          message: "Product archived successfully",
          archiveProduct: archiveProduct,
        });
      }
    })
    .catch((err) => {
      console.log("Error in archiving the product", err);
      return res.status(500).send({ error: "Error archiving the product" });
    });
};

// * ACTIVATE PRODUCT
module.exports.activateProduct = (req, res) => {
  Product.findOneAndUpdate(
    { _id: req.params.productId },
    { isActive: true },
    { new: true }
  )
    .then((activateProduct) => {
      if (!activateProduct) {
        return res.status(204).send({ errr: "Product not found" });
      } else {
        return res.status(200).send({
          message: "Product activated successfully",
          activateProduct: activateProduct,
        });
      }
    })
    .catch((err) => {
      console.log("Error in activating the product", err);
      return res.status(500).send({ error: "Error activating the product" });
    });
};

// * SEARCH PRODUCT BY NAME
module.exports.searchByName = (req, res) => {
  Product.findOne({ name: req.body.name })
  .then(productFound => {
    if (!productFound) {
      return res.status(404).send({ error: "Product not found" });
    } else {
      return res.status(200).send(productFound)
    }
  })
  .catch((err) => {
    console.log("Error in finding product", err);
    return res.status(500).send({ error: "Error finding the product" });
  });
}

module.exports.searchByPrice = (req, res) => {
  const { minPrice, maxPrice } = req.body;
  Product.find({ price: { $gte: minPrice, $lte: maxPrice } })
    .then(productsFound => {
      if (productsFound.length === 0) {
        return res.status(404).send({ error: "No products found" });
      } else {
        return res.status(200).send(productsFound);
      }
    })
    .catch((err) => {
      console.log("Error in finding product", err);
      return res.status(500).send({ error: "Error finding the product" });
    });
}
