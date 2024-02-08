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

    const filters = req.query; // Optional filters from query params

    const variants = await ProductVariantService.find(filters);

    Logger.info(`All variants of all products: ${variants}`);
    Response(res)
      .status(200)
      .message("All variants of all products")
      .body(variants)
      .send();
  };

  //@desc get variant of a product
  //@route GET /api/productVariant/:variantId
  //@access public
  getVariant = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { variantId } = req.params;

    const variant = await ProductVariantService.findById(variantId);

    if (!variant) {
      throw new HttpError(404, "Variant not found");
    }

    Logger.info(`Product Variant by variantId: ${variant}`);
    Response(res)
      .status(200)
      .message("Product Variant by variantId")
      .body(variant)
      .send();
  };

  //@desc get all variants of a product
  //@route GET /api/productVariant/product/:productId
  //@access public
  getProductVariants = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { productId } = req.params;

    const product = await ProductService.findById(productId);

    if (!product) {
      throw new HttpError(404, "Product not found");
    }

    const filters = { productId }; // Filter by product ID
    const variants = await ProductVariantService.find(filters);

    Logger.info(`Product Variants by productId: ${variants}`);
    Response(res)
      .status(200)
      .message("Product Variants by productId")
      .body(variants)
      .send();
  };

  //@desc search attributes of a variant
  //@route GET /api/productVariant/product/:productId/search
  //@access public
  searchAttributes = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { productId } = req.params;

    const productVariants = await ProductVariantService.find({ productId });

    const filteredVariants = productVariants.filter((productVariant) => {
      return productVariant.quantity > 0;
    });

    const attributes = filteredVariants.reduce((acc, productVariant) => {
      productVariant.variant.forEach((item) => {
        if (!acc[item.attribute]) {
          acc[item.attribute] = [];
        }
        if (!acc[item.attribute].includes(item.value)) {
          acc[item.attribute].push(item.value);
        }
      });
      return acc;
    }, {});

    Logger.info(`Attributes found for productId ${productId}: ${attributes}`);
    Response(res)
      .status(200)
      .message(`Attributes found for productId ${productId}`)
      .body(attributes)
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
      !price ||
      !storeId
    ) {
      throw new HttpError(400, "Invalid request body");
    }

    const product = await ProductService.findById(productId);

    if (!product) {
      throw new HttpError(404, "Product not found");
    }

    const store = await StoreService.findById(storeId);

    if (!store) {
      throw new HttpError(404, "Store not found");
    }

    if (
      store.sellerId.toString() !== req.user._id.toString() ||
      store._id.toString() !== product.storeId.toString()
    ) {
      throw new HttpError(404, "Unauthorized!");
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
      throw new HttpError(
        400,
        "Variant with the same attributes, values, and price already exists"
      );
    } else {
      const Variant = await ProductVariantService.create({
        productId,
        ...req.body,
      });
      Logger.info(`Product Variants added`);
      Response(res)
        .status(201)
        .message("Product Variants added")
        .body({ Variant })
        .send();
    }
  };

  //@desc update a variant by variantId
  //@route POST /api/productVariant/:variantId
  //@access private
  updateVariant = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { variantId } = req.params;
    const updateData = req.body;

    const variant = await ProductVariantService.findById(variantId);
    if (!variant) {
      throw new HttpError(404, "Variant not found!");
    }
    const store = await StoreService.findById(variant.storeId);

    if (
      store.sellerId.toString() !== req.user._id.toString() &&
      req.user.role.toString() !== "Admin"
    ) {
      throw new HttpError(404, "Unauthorized!");
    }

    Object.assign(variant, updateData);

    const updatedVariant = await variant.save();

    if (!updatedVariant) {
      throw new HttpError(404, "Variant not found");
    }

    Logger.info(`Product Variant updated by variantId: ${updatedVariant}`);
    Response(res)
      .status(200)
      .message("Product Variant updated by variantId")
      .body(updatedVariant)
      .send();
  };

  //@desc delete a variant by variantId
  //@route DELETE /api/productVariant/:variantId
  //@access private
  deleteVariant = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { variantId } = req.params;

    const variant = await ProductVariantService.findById(variantId);
    if (!variant) {
      throw new HttpError(404, "Variant not found!");
    }
    const store = await StoreService.findById(variant.storeId);

    if (
      store.sellerId.toString() !== req.user._id.toString() &&
      req.user.role.toString() !== "Admin"
    ) {
      throw new HttpError(404, "Unauthorized!");
    }

    const deletedVariant = await ProductVariantService.findByIdAndDelete(
      variantId
    );

    if (!deletedVariant) {
      throw new HttpError(404, "Variant not found");
    }

    Logger.info(`Product Variant deleted by variantId: ${deletedVariant}`);
    Response(res)
      .status(200)
      .message("Product Variant deleted by variantId")
      .send();
  };
}

module.exports.ProductVariantController = new ProductVariantController();
