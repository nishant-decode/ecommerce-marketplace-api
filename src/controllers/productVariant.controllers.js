const { StoreService } = require("../services/store.service");
const { ProductService } = require("../services/product.service");
const { ProductVariantService } = require("../services/productVariant.service");

const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

class ProductVariantController {
  //@desc get all variants of all products
  //@route GET /api/productVariant/
  //@access private
  getAllVariants = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    //logic

    Logger.info(`All variants of all products:`);
    Response(res)
      .status(200)
      .message("All variants of all products")
      .body()
      .send();
  };

  //@desc get variant of a product
  //@route GET /api/productVariant/:variantId
  //@access public
  getVariant = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    //logic

    Logger.info(`Product Variant:`);
    Response(res).status(200).message("Product Variant").body().send();
  };

  //@desc get all variants of a product
  //@route GET /api/productVariant/product/:productId
  //@access public
  getProductVariants = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    //logic

    Logger.info(`Product Variants:`);
    Response(res).status(200).message("Product Variants").body().send();
  };

  //@desc search attributes of a variant
  //@route GET /api/productVariant/search
  //@access public
  searchAttributes = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    //logic

    Logger.info(`Product Variant attributes:`);
    Response(res)
      .status(200)
      .message("Product Variant attributes")
      .body()
      .send();
  };

  //@desc add variant of a product by productId
  //@route POST /api/productVariant/product/:productId/addVariant
  //@access private
  addVariant = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const productId = req.params.productId;
    const { variant, price, quantity, storeId } = req.body;

    if (
      !productId ||
      !variant ||
      !Array.isArray(variant) ||
      !variant.length ||
      !quantity ||
      !price
    ) {
      throw new HttpError(
        400,
        "Invalid request body"
      );
    }

    const product = await ProductService.findById(productId);

    if (!product) {
      throw new HttpError(
        404,
        "Product not found"
      );
    }

    const store = await StoreService.findById(storeId);

    if (!store) {
      throw new HttpError(
        404,
        "Store not found"
      );
    }

    for (const variantItem of variant) {
      const { attribute, value } = variantItem;

      if (!attribute || !value) {
        throw new HttpError(
          400,
          "Attribute and value are required for each variant item"
        );
      }
    }

    const existingVariant = await ProductVariantService.findOne({
      productId,
      storeId,
      variant,
      price,
    });
    
    if (existingVariant) {
      throw new HttpError(400, "Variant with the same attributes, values, and price already exists");
    } else {
      const Variant = await ProductVariantService.create({
        productId,
        ...req.body
      });
      Logger.info(`Product Variants added`);
      Response(res).status(201).message("Product Variants added").body({Variant}).send();
    }
  };

  //@desc update a variant by variantId
  //@route POST /api/productVariant/:variantId
  //@access private
  updateVariant = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    //logic

    Logger.info(`Product Variant updated:`);
    Response(res).status(200).message("Product Variant updated").body().send();
  };

  //@desc delete a variant by variantId
  //@route DELETE /api/productVariant/:variantId
  //@access private
  deleteVariant = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    //logic

    Logger.info(`Product Variant deleted:`);
    Response(res).status(200).message("Product Variant deleted").body().send();
  };
}

module.exports.ProductVariantController = new ProductVariantController();
