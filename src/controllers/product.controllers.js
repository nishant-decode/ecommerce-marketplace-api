const { ProductService } = require("../services/product.service");
const { StoreService } = require("../services/store.service");
const { ReviewService } = require("../services/review.service");

const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");
const { ProductVariantService } = require("../services/productVariant.service");

class ProductController {
  //@desc get all products
  //@route GET /api/product/
  //@access public
  getAllProducts = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const filters = req.query; // Optional filters from query params

    const products = await ProductService.find(filters);

    Logger.info(`All products: ${products}`);
    Response(res).status(200).message("All products").body(products).send();
  };

  //@desc get all products
  //@route GET /api/product/:productId
  //@access public
  getProduct = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { productId } = req.params;

    const product = await ProductService.findById(productId);

    if (!product) {
      throw new HttpError(404, "Product not found");
    }

    Logger.info(`Product by productId: ${product}`);
    Response(res)
      .status(200)
      .message("Product by productId")
      .body(product)
      .send();
  };

  //@desc get all products by search query
  //@route GET /api/product/search?categories=Electronics,Clothing&departments=Appliances,Fashion&storeIds=123,456&minPrice=50&maxPrice=200&minRating=4
  //@access public
  searchProducts = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const {
      categories,
      departments,
      storeIds,
      variantAttributes,
      minPrice,
      maxPrice,
      minRating,
    } = req.query;

    const filters = {};

    if (categories) filters.category = { $in: categories };
    if (departments) filters.department = { $in: departments };
    if (storeIds) filters.storeId = { $in: storeIds };
    if (variantAttributes)
      filters.variantAttributes = { $in: variantAttributes };
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.original = { $gte: minPrice };
      if (maxPrice)
        filters.price.original = { ...filters.price.original, $lte: maxPrice };
    }

    const products = await ProductService.find(filters);

    if (minRating) {
      const productIds = products.map((product) => product._id);
      const reviews = await ReviewService.find({
        reviewedlistings: { $in: productIds },
      });

      products = products.filter((product) => {
        const productReviews = reviews.filter((review) =>
          review.reviewedlistings.includes(product._id)
        );
        const averageRating = calculateAverageRating(productReviews);
        return averageRating >= minRating;
      });
    }

    Logger.info(`Products found by search query: ${products}`);
    Response(res)
      .status(200)
      .message("Products found by search query")
      .body(products)
      .send();
  };

  //@desc seller lists product
  //@route POST /api/product/store/:storeId/listProduct
  //@access private
  listProduct = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    if (
      !req.body.name ||
      !req.body.category ||
      !req.body.department ||
      !req.body.price ||
      !req.body.url
    ) {
      throw new HttpError(400, "All fields Mandatory!");
    }

    const store = await StoreService.findById(req.params.storeId);
    if (!store) {
      throw new HttpError(400, "Store does not exist!");
    }

    if (store.sellerId.toString() !== req.user._id.toString()) {
      throw new HttpError(404, "Unauthorized!");
    }

    const product = await ProductService.create({
      storeId: store._id,
      ...req.body,
    });

    if (product) {
      Logger.info(`Product added successfully: ${product}`);
      Response(res)
        .status(201)
        .message("Product added successfully")
        .body({ product })
        .send();
    } else {
      throw new HttpError(400, "Product data is not valid");
    }
  };

  //@desc update products
  //@route PUT /api/product/:productId
  //@access private
  updateProduct = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { productId } = req.params;
    const updateData = req.body;

    const product = await ProductService.findById(productId);
    if (!product) {
      throw new HttpError(404, "Product not found!");
    }
    const store = await StoreService.findById(product.storeId);

    if (
      store.sellerId.toString() !== req.user._id.toString() &&
      req.user.role.toString() !== "Admin"
    ) {
      throw new HttpError(404, "Unauthorized!");
    }

    Object.assign(product, updateData);

    const updatedProduct = await product.save();

    if (!updatedProduct) {
      throw new HttpError(404, "Product not found");
    }

    Logger.info(`Product updated by productId: ${updatedProduct}`);
    Response(res)
      .status(200)
      .message("Product updated by productId")
      .body(updatedProduct)
      .send();
  };

  //@desc delete products
  //@route DELETE /api/product/:productId
  //@access private
  deleteProduct = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { productId } = req.params;

    const product = await ProductService.findById(productId);
    if (!product) {
      throw new HttpError(404, "Product not found!");
    }
    const store = await StoreService.findById(product.storeId);

    if (
      store.sellerId.toString() !== req.user._id.toString() &&
      req.user.role.toString() !== "Admin"
    ) {
      throw new HttpError(404, "Unauthorized!");
    }

    const deletedProduct = await ProductService.findByIdAndDelete(productId);

    if (!deletedProduct) {
      throw new HttpError(404, "Product not found");
    }

    await ProductVariantService.deleteMany({ productId });

    Logger.info(`Product deleted by productId: ${deletedProduct}`);
    Response(res).status(200).message("Product deleted by productId").send();
  };
}

module.exports.ProductController = new ProductController();
