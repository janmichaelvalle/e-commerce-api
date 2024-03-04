const Order = require("../models/Order");
const auth = require("../auth");
const Cart = require("../models/Cart");

// *CHECKOUT
module.exports.checkout = (req, res) => {
  const userId = req.user.id;
  if (req.user.isAdmin == true) {
    return res.status(400).send("Admins cannot checkout")
  } else {
    Cart.findOne( { userId  } )
    .then((cart) => {
      if (!cart || cart.cartItems.length === 0) {
        return res.status(400).send({message: "You cannot checkout because cart is empty"})
      } else {
        const newOrder = new Order ({
          userId: req.user.id,
          productsOrdered: cart.cartItems,
          totalPrice: cart.totalPrice,
        });
        return newOrder.save()
        .then((newOrder) => {
          return Cart.findOneAndDelete({ userId })
          .then(() => {
            res.status(201).send({ message: "Checkout successful", orderDetails: newOrder });
          });
        })
        .catch((error) => {
          console.error("Error saving new order:", error);
          return res.status(500).send({ error: "Internal server error" });
        });
        
      }
    })
    .catch((error) => {
      console.error("Error finding cart:", error);
      return res.status(500).send({ error: "Internal server error" });
    });
  }
}

// * RETRIEVE USER'S ORDERS
module.exports.myOrders = (req, res) => {
  const userId = req.user.id;
  if (req.user.isAdmin == true) {
    return res.status(400).send("Admins cannot checkout")
  } else { 
    Order.find({ userId })
    .then((order) => {
      if (!order) {
        res.status(404).send({ message: "No orders" });
      } else {
        res.status(200).send(order);
      }
    })
    .catch((error) => {
      console.error("Error finding cart:", error);
      return res.status(500).send({ error: "Internal server error" });
    });

  }
}

// * GET ALL ORDERS
module.exports.allOrders = (req, res) => {
    Order.find({})
    .then((allOrders) => {
      if (allOrders.length > 0) {
        return res.status(200).send({ allOrders: allOrders });
      } else {
        res.status(200).send({ message: "No orders found" });
      }
    })
    .catch((err) => {
      console.llog("Error finding all products", err);
      return res.status(500).send({ error: "Error finding products" });
    });
};
