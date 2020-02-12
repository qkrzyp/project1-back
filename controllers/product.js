const Product = require("../models/product");
const User = require("../models/user");
const formidable = require("formidable");
const fs = require("fs");

exports.getProduct = async (req, res, next) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId).populate("category");
    if (!product) {
      return res.status(400).json({
        error: "product not found"
      });
    }
    product.photo = undefined;
    res.json(product);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: err.message
      });
    }
  }
};

exports.createProduct = async (req, res, next) => {
  if (!req.userId) {
    return res.status(400).json({
      error: "Not authenticated"
    });
  }

  try {
    const user = await User.findById(req.userId);
    if (user.admin === false) {
      return res.status(400).json({
        error: "Admin only"
      });
    }

    let form = new formidable();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "create product error"
        });
      }
      let error = [];
      if (!fields.name) {
        error.push({ msg: "상품명을 입력해주세요.", param: "name" });
      }
      if (!fields.description) {
        error.push({
          error: "상품 설명을 입력해주세요.",
          param: "description"
        });
      }
      if (!fields.price) {
        error.push({ error: "가격을 입력해주세요.", param: "price" });
      }
      if (!fields.delivery) {
        error.push({ error: "배송비를 선택해주세요.", param: "delivery" });
      }
      if (!fields.category) {
        error.push({ error: "카테고리를 선택해주세요.", param: "category" });
      }
      if (!fields.quantity) {
        error.push({ error: "상품개수를 입력해주세요.", param: "quantity" });
      }
      if (!files.photo) {
        error.push({ error: "이미지 파일을 선택해주세요.", param: "photo" });
      }

      if (error.length > 0) {
        return res.status(400).json({ error });
      }

      let product = new Product(fields);
      if (files.photo) {
        if (files.photo.size > 1000000) {
          return res.status(400).json({
            error: "이미지 사이즈가 작아야합니다."
          });
        }
        product.photo.data = fs.readFileSync(files.photo.path);
        product.photo.contentType = files.photo.type;
      }

      product
        .save()
        .then(result => {
          res.json({ result, message: "상품이 생성되었습니다." });
        })
        .catch(err => {
          if (err) {
            return res.status(400).json({
              error: err.message
            });
          }
        });
    });
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: err.message,
        message: "create product error"
      });
    }
  }
};

exports.deleteProduct = async (req, res, next) => {
  const productId = req.params.productId;

  try {
    if (!req.userId) {
      return res.status(400).json({
        error: "Not authenticated"
      });
    }

    const user = await User.findById(req.userId);
    if (user.admin === false) {
      return res.status(400).json({
        error: "Admin only"
      });
    }
    await Product.findByIdAndRemove(productId);
    res.json({ message: "Delete product success", _id: productId });
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: err.message
      });
    }
  }
};

exports.editProduct = async (req, res, next) => {
  const productId = req.params.productId;

  try {
    if (!req.userId) {
      return res.status(400).json({
        error: "Not authenticated"
      });
    }
    const user = await User.findById(req.userId);
    if (user.admin === false) {
      return res.status(400).json({
        error: "Admin only"
      });
    }

    let form = new formidable();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "edit product error"
        });
      }

      let error = [];
      if (!fields.name) {
        error.push({ msg: "상품명을 입력해주세요.", param: "name" });
      }
      if (!fields.description) {
        error.push({
          error: "상품 설명을 입력해주세요.",
          param: "description"
        });
      }
      if (!fields.price) {
        error.push({ error: "가격을 입력해주세요.", param: "price" });
      }
      if (!fields.delivery) {
        error.push({ error: "배송비를 선택해주세요.", param: "delivery" });
      }
      if (!fields.category) {
        error.push({ error: "카테고리를 선택해주세요.", param: "category" });
      }
      if (!fields.quantity) {
        error.push({ error: "상품개수를 입력해주세요.", param: "quantity" });
      }

      if (error.length > 0) {
        return res.status(400).json({ error });
      }

      let product = await Product.findById(productId);
      if (!product) {
        return res.status(400).json({
          error: "상품이 존재하지 않습니다."
        });
      }
      product.name = fields.name;
      product.description = fields.description;
      product.price = fields.price;
      product.category = fields.category;
      product.quantity = fields.quantity;
      product.delivery = fields.delivery;

      if (files.photo) {
        product.photo = files.photo;
        if (files.photo.size > 1000000) {
          return res.status(400).json({
            error: "이미지 사이즈가 작아야합니다. "
          });
        }
        product.photo.data = fs.readFileSync(files.photo.path);
        product.photo.contentType = files.photo.type;
      }

      const savedProduct = await product.save();
      res.json({ savedProduct, message: "상품 수정이 완료되었습니다." });
    });
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: err.message,
        message: "edit product error"
      });
    }
  }
};

exports.getProducts = async (req, res, next) => {
  const sort = req.query.sort || "price";

  try {
    const products = await Product.find()
      .select("-photo")
      .populate("category")
      .limit(3)
      .sort(sort);
    res.json(products);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: err.message,
        message: "get all products error"
      });
    }
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(400).json({
        error: "Not authenticated"
      });
    }
    const user = await User.findById(req.userId);
    if (user.admin === false) {
      return res.status(400).json({
        error: "Admin only"
      });
    }
    const products = await Product.find()
      .select("-photo")
      .populate("category");
    res.json(products);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: err.message,
        message: "get all products error"
      });
    }
  }
};

exports.filteredProducts = async (req, res, next) => {
  const sort = req.query.sort || "price";
  const category = req.body.category;

  try {
    let products;
    if (category.length >= 1) {
      products = await Product.find({ category })
        .select("-photo")
        .populate("category")
        .sort(sort);
    } else {
      products = await Product.find()
        .select("-photo")
        .populate("category")
        .sort(sort);
    }

    res.json(products);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: err.message,
        message: "filtered products error"
      });
    }
  }
};

exports.getOtherProducts = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const categoryId = await Product.findById(productId).select(
      "category -_id"
    );
    const products = await Product.find({ category: categoryId.category })
      .ne("_id", productId)
      .select("-photo")
      .limit(3);
    res.json(products);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: err.message,
        message: "get other products error"
      });
    }
  }
};

exports.getProductsCategories = async (req, res, next) => {
  try {
    const categories = await Product.find().distinct("category");
    res.json(categories);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: err.message,
        message: "get products categories error"
      });
    }
  }
};

exports.searchProduct = async (req, res, next) => {
  const term = req.body.term;
  try {
    const results = await Product.find()
      .regex("name", new RegExp(term))
      .select("-photo");

    res.json(results);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: err.message,
        message: "search product error"
      });
    }
  }
};

exports.getProductPhoto = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    const photo = await Product.findById(productId).select("photo -_id");
    if (photo.photo.data) {
      res.set("Content-Type", photo.photo.contentType);
      res.send(photo.photo.data);
    }
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: err.message,
        message: "get photo error"
      });
    }
  }
};
