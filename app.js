const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");

const app = express();

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());

app.use("/shop", authRoutes);
app.use("/shop", userRoutes);
app.use("/shop", categoryRoutes);
app.use("/shop", productRoutes);
app.use("/shop", orderRoutes);

const port = process.env.PORT || 8000;

mongoose
  .connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log("DB Connected!");
    app.listen(port, () => {
      console.log(`Server ${port}`);
    });
  })
  .catch(err => console.log(err));
