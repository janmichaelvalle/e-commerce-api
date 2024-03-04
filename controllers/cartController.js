const Cart = require("../models/Cart");
const auth = require("../auth");

// * ADD TO CART
module.exports.addToCart = (req, res) => {
  const userId = req.user.id;
  const cartItems = req.body.cartItems;
  if (req.user.isAdmin == true) {
    return res.status(400).send("Admins cannot add to cart") 
  } else {
    Cart.findOne({ userId })
    .then((cart) => {
      if (!cart) {
        const totalPrice = calculateTotalPrice(cartItems);
        const newCart = new Cart({
          userId: req.user.id,
          cartItems: cartItems,
          totalPrice: totalPrice,
        });
        return newCart
          .save()
          .then((savedCart) => res.status(201).send(savedCart))
          .catch((error) => {
            console.error("Error saving new cart:", error);
            return res.status(500).send({ error: "Internal server error" });
          });
      } else {
        /* ChatGPT explantion
            1) cart.cartItems: This refers to the cartItems array property of the "cart" (refers to the specific instance of a cart retrieved from the database in the Cart.findOne method) document that we obtained from the database. It contains all the items currently present in the user's cart.

            2) .find(): This is a method available on arrays in JavaScript that iterates over each element in the array and executes a callback function. It returns the first element in the array that satisfies the condition specified in the callback function, or undefined if no such element is found.

            3) item => item.productId.toString() === newCartItem.productId.toString(): This is the callback function passed to the .find() method. It is executed for each element (item) in the cartItems array. Inside the callback function:
              - item.productId.toString(): This converts the productId of the current item to a string. This is necessary because MongoDB ObjectIDs are not directly comparable to each other as objects.
              - newCartItem.productId.toString(): This converts the productId of the newCartItem (the item being added to the cart) to a string.
              - ===: This is the equality operator, which checks if the productId of the current item is strictly equal to the productId of the newCartItem. If they are strictly equal (both in value and type), the condition evaluates to true.
            4) const existingCartItem = ...: This assigns the result of the .find() method to the variable existingCartItem. If a cart item with the same productId as the newCartItem is found in the cartItems array, existingCartItem will hold that item; otherwise, it will be undefined.

            In summary, this line of code is used to find if there is an existing cart item in the user's cart with the same productId as the newCartItem   being added. If such an item exists, existingCartItem will hold that item; otherwise, it will be undefined.
         */
        cartItems.forEach((newCartItem) => {
          // Check if the productId of newCartItem exists in the cart
          // ! REVIEW THIS
          const existingCartItem = cart.cartItems.find(
            (item) =>
              item.productId.toString() === newCartItem.productId.toString()
          );
          if (existingCartItem) {
            // If productId exists, update quantity and subtotal
            existingCartItem.quantity = newCartItem.quantity;
            existingCartItem.subtotal = newCartItem.subtotal;
          } else {
            cart.cartItems.push(newCartItem);
          }
        });

        // Recalculate total price
        cart.totalPrice = calculateTotalPrice(cart.cartItems);

        return cart
          .save()
          .then((savedCart) => res.status(200).send(savedCart))
          .catch((error) => {
            console.error("Error saving updated cart:", error);
            return res.status(500).send({ error: "Internal server error" });
          });
      }
    })
    .catch((error) => {
      console.error("Error finding cart:", error);
      return res.status(500).send({ error: "Internal server error" });
    });
};
  }
  

// ** UPDATE PRODUCT QUANTITY
module.exports.updateCart = (req, res) => {
  const userId = req.user.id;
  const cartItems = req.body.cartItems;
  if (req.user.isAdmin == true) {
    return res.status(400).send("Admins cannot update quantity in the cart") 
  } else {
    Cart.findOne({ userId })
    .then((cart) => {
      if (!cart) {
        res.status(404).send({ message: "Cart is empty" });
      } else {
        cartItems.forEach((updateCartItem) => {
          const existingCartItem = cart.cartItems.find(
            (item) =>
              item.productId.toString() === updateCartItem.productId.toString()
          );
          if (existingCartItem) {
            existingCartItem.quantity = updateCartItem.quantity;
            existingCartItem.subtotal = updateCartItem.subtotal;
          }
        });
        cart.totalPrice = calculateTotalPrice(cart.cartItems);

        return cart
          .save()
          .then((savedCart) => res.status(200).send(savedCart))
          .catch((error) => {
            console.error("Error saving updated cart:", error);
            return res.status(500).send({ error: "Internal server error" });
          });
      }
    })
    .catch((error) => {
      console.error("Error finding cart:", error);
      return res.status(500).send({ error: "Internal server error" });
    });
};
  }
 

// * GET CART
module.exports.getCart = (req, res) => {
  const userId = req.user.id;
  if (req.user.isAdmin == true) {
    return res.status(400).send("Admins cannot get cart") 
  } else { 
    Cart.findOne({ userId })
    .then((cart) => {
      if (!cart) {
        res.status(404).send({ message: "Cart is empty" });
      } else {
        res.status(200).send(cart);
      }
    })
    .catch((error) => {
      console.error("Error finding cart:", error);
      return res.status(500).send({ error: "Internal server error" });
    });
};
  }

  
// * REMOVE PRODUCT
module.exports.removeProduct = (req, res) => {
  const userId = req.user.id;
  const removeProductId = req.params.productId;
  if (req.user.isAdmin == true) {
    return res.status(400).send("Admins cannot remove product from cart") 
  } else {  
    Cart.findOne({ userId })
    .then((cart) => {
      if (!cart) {
        return res.status(404).send({ message: "Cart is empty" });
      } else {
        /* CHATGPT Explanation
        This code snippet is using the findIndex() method to search for the index of a specific cart item in the cartItems array based on the productId. Here's what each part does:

        1) cart.cartItems: This refers to the cartItems array property of the cart document. It contains all the items currently present in the user's cart.

        2) .findIndex(): This is a method available on arrays in JavaScript that iterates over each element in the array and executes a callback function. It returns the index of the first element in the array that satisfies the condition specified in the callback function, or -1 if no such element is found.

          - (item) => item.productId.toString() === removeProductId.toString(): This is the callback function passed to the .findIndex() method. It is executed for each element (item) in the cartItems array. Inside the callback function:

          - item.productId.toString(): This converts the productId of the current item to a string. This is necessary because MongoDB ObjectIDs are not directly comparable to each other as objects.
          - removeProductId.toString(): This converts the removeProductId (the product ID being removed from the cart) to a string.
          - ===: This is the equality operator, which checks if the productId of the current item is strictly equal to the removeProductId. If they are strictly equal (both in value and type), the condition evaluates to true.

        4) const indexToRemove = ...: This assigns the result of the .findIndex() method to the variable indexToRemove. If a cart item with the specified productId is found in the cartItems array, indexToRemove will hold its index; otherwise, it will be -1.

        After finding the index of the cart item to be removed, the code checks if indexToRemove is -1, indicating that the product is not found in the cart. If it's -1, it returns a 404 status with a message indicating that the product is not found in the cart. Otherwise, it proceeds with removing the product from the cart.
         */
        // Find the index of the cart item with the specified productId
        const indexToRemove = cart.cartItems.findIndex(
          (item) => item.productId.toString() === removeProductId.toString()
        );

        if (indexToRemove === -1) {
          return res.status(404).send({ message: "Product not found in cart" });
        }

        // Remove the cart item from the cartItems array
        cart.cartItems.splice(indexToRemove, 1);

        // Recalculate the total price of the cart
        cart.totalPrice = calculateTotalPrice(cart.cartItems);

        // Save the updated cart back to the database
        return cart
          .save()
          .then((savedCart) =>
            res
              .status(200)
              .send({ message: "Product removed from cart", savedCart: savedCart })
          )
          .catch((error) => {
            console.error("Error saving updated cart:", error);
            return res.status(500).send({ error: "Internal server error" });
          });
      }
    })
    .catch((error) => {
      console.error("Error finding cart:", error);
      return res.status(500).send({ error: "Internal server error" });
    });
};

    
  }
  

// * CLEAR CART
module.exports.clearCart = (req, res) => {
  const userId = req.user.id;
  if (req.user.isAdmin == true) {
    return res.status(400).send("Admins cannot clear items from cart") 
  } else {  
    Cart.findOne({ userId })
    .then((cart) => {
      if (!cart) {
        return res.status(404).send({ message: "Cart is empty" });
      } else {
          cart.cartItems = [];
          cart.totalPrice = 0;
          return cart.save()
          .then((updatedCart) => res.status(200).send({ message: "Cart cleared successfully", updatedCart: updatedCart}))
          .catch((error) => {
            console.error("Error saving updated cart:", error);
            return res.status(500).send({ error: "Internal server error" });
          });
      }
    })
    .catch((error) => {
      console.error("Error finding cart:", error);
      return res.status(500).send({ error: "Internal server error" });
    });
};
  }
  


// Function to calculate total price of cart items
function calculateTotalPrice(cartItems) {
  return cartItems.reduce((total, item) => total + item.subtotal, 0);
}
