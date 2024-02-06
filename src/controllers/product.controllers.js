const { ProductService } = require("../services/product.service");
const { StoreService } = require("../services/store.service");

const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

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
  //@route GET /api/product/search?categories[]=Electronics&categories[]=Clothing&departments[]=Appliances&departments[]=Fashion&departments[]=Home&sellerIds[]=123&sellerIds[]=456&variantIds[]=789&variantIds[]=012&variantAttributes[]=Color:Red&variantAttributes[]=Size:Medium&minPrice=50&maxPrice=200&minRating=4
  //@access public
  searchProducts = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const filters = req.query;

    const products = await ProductService.search(filters); //implement search in service

    Logger.info(`Products by search query: ${products}`);
    Response(res)
      .status(200)
      .message("Products by search query")
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

    const updatedProduct = await ProductService.findByIdAndUpdate(
      productId,
      updateData,
      { new: true } // Return the updated document
    );

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

    const deletedProduct = await ProductService.findByIdAndDelete(productId);

    if (!deletedProduct) {
      throw new HttpError(404, "Product not found");
    }

    Logger.info(`Product deleted by productId: ${deletedProduct}`);
    Response(res).status(200).message("Product deleted by productId").send();
  };
}

module.exports.ProductController = new ProductController();
