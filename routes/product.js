const express = require("express");
const router = express.Router();

const productControllers = require("../controllers/product");

const isAuth = require("../middlewares/isAuth");

router.get("/product/:productId", productControllers.getProduct);

router.put("/product/:productId", isAuth, productControllers.editProduct);

router.post("/product/create", isAuth, productControllers.createProduct);

router.delete("/product/:productId", isAuth, productControllers.deleteProduct);

router.get("/products", productControllers.getProducts);

router.get("/products/items", isAuth, productControllers.getAllProducts);

router.post("/products/filtered", productControllers.filteredProducts);

router.get("/product/other/:productId", productControllers.getOtherProducts);

router.get("/products/categories", productControllers.getProductsCategories);

router.post("/products/search", productControllers.searchProduct);

router.get("/product/photo/:productId", productControllers.getProductPhoto);

module.exports = router;
