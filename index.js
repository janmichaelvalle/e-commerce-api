require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

const port = 4005;

mongoose.connect("mongodb+srv://janmichaelvalle:admin@cluster0.ei4pysk.mongodb.net/e-commerce-api?retryWrites=true&w=majority")

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'));

app.use("/b5/users", userRoutes);
app.use("/b5/products", productRoutes);
app.use("/b5/carts", cartRoutes);
app.use("/b5/orders", orderRoutes);

if(require.main === module){
	// "process.env.PORT || port" will use the environment variable if it is avaiable OR will used port 4000 if none is defined
	app.listen(process.env.PORT || port, () => {
		console.log(`API is now online on port ${process.env.PORT || port}`)
	});
}