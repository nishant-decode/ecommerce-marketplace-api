const { ProductService } = require("../services/product.service");
const { SellerService } = require("../services/seller.service");

const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

class ProductController {
  //@desc Register a seller
  //@route PATCH /api/seller/createStore
  //@access public
  listProduct = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { name, category, price, info, details, url, variants } = req.body;

    if (!name || !category || !price || !url) {
      throw new HttpError(400, "All fields Mandatory!");
    }

    const seller = await SellerService.findById(req.params.id);
    if (!seller) {
      throw new HttpError(400, "Seller does not exist!");
    }

    const product = await ProductService.create({ 
      name,
      seller: seller._id,
      category,
      price,
      info,
      details,
      url,
      variants
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
}

module.exports.ProductController = new ProductController();