const Product = require("../model/productModel");
const RecentlyViewed = require("../model/recentlyviewesModel");
const generateMetaHtml = require('../utils/generateMetaHtml');
const mongoose = require("mongoose");
const streamifier = require('streamifier');


const cloudinary = require("../lib/cloudinary");

const createProduct = async (req, res, next) => {
  try {
    // console.log("📦 req.body:", req.body);
    console.log("📸 req.files:", req.files);
    const {
      name,
      description,
      price,
      odd,
      brand,
      quantity,
      category,
      computerProperty,
      // images
    } = req.body;

    // ✅ FIXED: removed `!images`
    if (!name || !brand || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Please fill Name, Brand, Price, and Category fields.",
      });
    }

    // ✅ Check uploaded files separately
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Please add product images." });
    }

    // ✅ Upload to Cloudinary
    // const imagesBuffer = [];
    // for (const file of req.files) {
    //   const result = await cloudinary.uploader.upload(file.path, {
    //     folder: "products",
    //   });
    //   imagesBuffer.push({
    //     public_id: result.public_id,
    //     url: result.secure_url,
    //   });
    // }

    const uploadToCloudinary = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const imagesBuffer = [];
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer);
      imagesBuffer.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    // ✅ Parse computerProperty only if present
    let parsedComputerProperty = {};
    try {
      parsedComputerProperty = computerProperty ? JSON.parse(computerProperty) : {};
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format in computerProperty",
      });
    }

    const data = {
      name,
      description,
      price,
      odd,
      brand,
      quantity,
      id: parseInt(Date.now() * Math.random()),
      category,
      // computerProperty, 
      // images,
      computerProperty: [parsedComputerProperty],
      images: imagesBuffer,
    };

    const product = await Product.create(data);
    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error("Error creating product:", error);
    next(error);
  }
};

const getAllProducts = async (req, res, next) => {
  const getAllProducts = await Product.find();
  if (!getAllProducts) {
    return res.status(400).send("Bad request");
  }
  return res.status(200).json({ getAllProducts });
};


const getComputers = async (req, res) => {
  try {
    const products = await Product.find({ category: "Computer" });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};


const getProductsByFilter = async (req, res) => {
  try {
    let filterCriteria = { category: req.query.category || "Computer" };

    const cleanUpValue = (value) => {
      if (!value) return;
      return value.replace(/\s+/g, "").replace(/,/g, "").toLowerCase();
    };

    const createNumberRegex = (value) => {
      if (!value) return;
      const cleanedValue = value.replace(/\D/g, "");
      return new RegExp(`\\b${cleanedValue}\\b`, "i");
    };

    if (req.query.ram) {
      filterCriteria["computerProperty.ram"] = {
        $regex: createNumberRegex(req.query.ram)
      };
    }

    if (req.query.drive) {
      filterCriteria["computerProperty.drive"] = {
        $regex: createNumberRegex(req.query.drive)
      };
    }

    if (req.query.brand) {
      const brandArray = req.query.brand
        .split(",")
        .map((brand) => cleanUpValue(brand));
      filterCriteria["brand"] = {
        $in: brandArray.map((brand) => new RegExp(brand, "i"))
      };
    }

    const products = await Product.find(filterCriteria);

    const prices = products
      .map((product) => parseFloat(product.price) || 0)
      .filter((price) => price > 0);

    const dynamicMinPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const dynamicMaxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    let minPrice = parseFloat(req.query.minPrice) || dynamicMinPrice;
    let maxPrice = parseFloat(req.query.maxPrice) || dynamicMaxPrice;

    const filteredProducts = products.filter((product) => {
      const price = parseFloat(product.price);
      return price >= minPrice && price <= maxPrice;
    });

    const filteredPrices = filteredProducts
      .map((product) => parseFloat(product.price) || 0)
      .filter((price) => price > 0);

    const updatedMinPrice =
      filteredPrices.length > 0 ? Math.min(...filteredPrices) : 0;
    const updatedMaxPrice =
      filteredPrices.length > 0 ? Math.max(...filteredPrices) : 0;

    res.status(200).json({
      success: true,
      data: filteredProducts,
      minPrice: updatedMinPrice,
      maxPrice: updatedMaxPrice
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getAllProductsByFilterForAllCategories = async (req, res) => {
  try {
    let filterCriteria = {};

    const cleanUpValue = (value) => {
      if (!value) return;
      return value.replace(/\s+/g, "").replace(/,/g, "").toLowerCase();
    };

    if (req.query.brand) {
      const brandArray = req.query.brand
        .split(",")
        .map((brand) => cleanUpValue(brand));
      filterCriteria["brand"] = {
        $in: brandArray.map((brand) => new RegExp(brand, "i"))
      };
    }

    const products = await Product.find(filterCriteria);

    const prices = products
      .map((product) => parseFloat(product.price) || 0)
      .filter((price) => price > 0);

    const dynamicMinPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const dynamicMaxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    let minPrice = parseFloat(req.query.minPrice) || dynamicMinPrice;
    let maxPrice = parseFloat(req.query.maxPrice) || dynamicMaxPrice;

    const filteredProducts = products.filter((product) => {
      const price = parseFloat(product.price);
      return price >= minPrice && price <= maxPrice;
    });

    const filteredPrices = filteredProducts
      .map((product) => parseFloat(product.price) || 0)
      .filter((price) => price > 0);

    const updatedMinPrice =
      filteredPrices.length > 0 ? Math.min(...filteredPrices) : 0;
    const updatedMaxPrice =
      filteredPrices.length > 0 ? Math.max(...filteredPrices) : 0;

    res.status(200).json({
      success: true,
      data: filteredProducts,
      minPrice: updatedMinPrice,
      maxPrice: updatedMaxPrice
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


const getUniqueBrandsAndPriceRange = async (req, res) => {
  try {
    const products = await Product.find({});

    const uniqueBrands = [
      ...new Set(products.map((product) => product.brand.trim().toLowerCase())),
    ];

    const displayBrands = uniqueBrands.map((uniqueBrand) =>
      products.find(
        (product) => product.brand.trim().toLowerCase() === uniqueBrand
      ).brand
    );
    const prices = products.map((product) => parseFloat(product.price) || 0).filter(price => price > 0);
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 1000000;

    res.status(200).json({
      success: true,
      brands: displayBrands,
      minPrice,
      maxPrice,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    const myRandomId = parseInt(Date.now() * Math.random());

    const {
      name,
      description,
      price,
      odd,
      brand,
      quantity,
      category,
      series,
      model,
      weight,
      dimension,
      item,
      color,
      hardware,
      os,
      processor,
      number,
      memory,
      ram,
      drive,
      display,
      resolution,
      graphics,
      voltage,
      battery,
      wireless
    } = req.body;

    const data = {
      name,
      description,
      price,
      odd,
      brand,
      quantity,
      id: myRandomId,
      category,
      computerProperty: {
        series,
        model,
        weight,
        dimension,
        item,
        color,
        hardware,
        os,
        processor,
        number,
        memory,
        ram,
        drive,
        display,
        resolution,
        graphics,
        voltage,
        battery,
        wireless
      }
    };
    const newUpdateProduct = await Product.findByIdAndUpdate(product, data, {
      new: true
    });
    return res.status(200).json({ newUpdateProduct });
  } catch (error) {
    console.log(error);
  }
};

const updateProductImage = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    let images = [...req.body.images];
    if (images.length === 0) {
      return res.status(400).send("Added New Product Images");
    }

    let imagesBuffer = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i], {
        folder: "products"
      });
      imagesBuffer.push({
        public_id: result.public_id,
        url: result.secure_url
      });
    }

    const data = {
      images: imagesBuffer
    };
    const newUpdateProduct = await Product.findByIdAndUpdate(product, data, {
      new: true
    });
    return res.status(200).json({ newUpdateProduct });
  } catch (error) {
    console.log(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Id not found");
    }
    await Product.findByIdAndDelete(product);
    return res.status(200).json({ message: "Blog Successfully Deleted" });
  } catch (error) {
    console.log(error);
  }
};

// const getProductById = async (req, res) => {
//   try {
//     const productId = req.params.id;
//     const product = await Product.findById(productId);

//     if (!product) {
//       return res.status(404).json({ message: "Product Not Found" });
//     }

//     if (req.isCrawler) {
//       const html = generateMetaHtml(product);
//       return res.send(html);
//     }

//     await updateRecentlyViewed(productId);

//     const recentlyViewed = await RecentlyViewed.findOne();
//     const recentlyViewedCount = recentlyViewed ? recentlyViewed.products.length : 0;

//     return res.status(200).json({ product });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };


// const getProductById = async (req, res) => {
//   try {
//     const identifier = req.params.id;
//     let product;

//     if (mongoose.Types.ObjectId.isValid(identifier)) {
//       product = await Product.findById(identifier);
//     } else {
//       product = await Product.findOne({ slug: identifier });
//     }

//     if (!product) {
//       return res.status(404).json({ message: "Product Not Found" });
//     }

//     if (req.isCrawler) {
//       const html = generateMetaHtml(product);
//       return res.send(html);
//     }

//     await updateRecentlyViewed(product._id);

//     const recentlyViewed = await RecentlyViewed.findOne();
//     const recentlyViewedCount = recentlyViewed ? recentlyViewed.products.length : 0;

//     return res.status(200).json({ product });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };


const getProductById = async (req, res) => {
  try {
    const identifier = req.params.id;
    let product;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      product = await Product.findById(identifier);
    } else {
      product = await Product.findOne({ slug: identifier });
    }

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    if (req.isCrawler) {
      const html = generateMetaHtml(product);
      return res.send(html);
    }

    await updateRecentlyViewed(product._id);

    const recentlyViewed = await RecentlyViewed.findOne();
    const recentlyViewedCount = recentlyViewed ? recentlyViewed.products.length : 0;

    return res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category
    }).limit(5);

    res.status(200).json({ success: true, relatedProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const getRecentlyViewedProducts = async (req, res) => {
  try {
    const recentlyViewed = await RecentlyViewed.findOne().populate("products");

    if (!recentlyViewed) {
      return res.status(200).json({ recentlyViewedProducts: [] });
    }

    res.status(200).json({
      success: true,
      recentlyViewedProducts: recentlyViewed.products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};




const updateRecentlyViewed = async (productId) => {
  try {
    const maxRecentlyViewed = 7;

    let recentlyViewed = await RecentlyViewed.findOne();
    if (!recentlyViewed) {
      recentlyViewed = new RecentlyViewed({ products: [] });
    }
    recentlyViewed.products = recentlyViewed.products.filter(
      (id) => id.toString() !== productId.toString()
    );
    recentlyViewed.products.unshift(productId);

    if (recentlyViewed.products.length > maxRecentlyViewed) {
      recentlyViewed.products = recentlyViewed.products.slice(
        0,
        maxRecentlyViewed
      );
    }
    await recentlyViewed.save();

    console.log(
      `Current number of recently viewed products: ${recentlyViewed.products.length}`
    );
  } catch (error) {
    console.error("Error updating recently viewed products:", error);
  }
};



const getNextProduct = async (req, res) => {
  try {
    const currentProduct = await Product.findById(req.params.id);
    if (!currentProduct) {
      return res.status(404).json({ message: "Current product not found" });
    }

    const productCategory = currentProduct.category;

    const allProducts = await Product.find();

    const reversedProducts = allProducts.reverse();

    const categoryProducts = reversedProducts.filter(
      (product) => product.category === productCategory
    );

    const currentIndex = categoryProducts.findIndex(
      (product) => product._id.toString() === currentProduct._id.toString()
    );
    let nextProduct;
    if (currentIndex !== -1 && currentIndex < categoryProducts.length - 1) {
      nextProduct = categoryProducts[currentIndex + 1];
    } else {
      nextProduct = categoryProducts[0];
    }

    res.status(200).json({ nextProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  createProduct,
  getAllProducts,
  getProductsByFilter,
  getAllProductsByFilterForAllCategories,
  getUniqueBrandsAndPriceRange,
  getProductById,
  getComputers,
  updateRecentlyViewed,
  deleteProduct,
  updateProduct,
  updateProductImage,
  getRelatedProducts,
  getRecentlyViewedProducts,
  getNextProduct
};
