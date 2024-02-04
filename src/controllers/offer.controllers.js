const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

const { OfferService } = require("../services/offer.service");

class OfferController {
  //@desc get all orders
  //@route GET /api/offer/
  //@access public
  getAllOffers = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);
  
    const offers = await OfferService.findAll();
    Logger.info(`All offers:`);
    Response(res)
      .status(200)
      .message("All offers")
      .body(offers)
      .send();
  };

  //@desc get offer
  //@route GET /api/offer/:offerId
  //@access public
  getOffer = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { offerId } = req.params;
    const offer = await OfferService.findById(offerId);
    Logger.info(`Offer:`);
    Response(res)
      .status(200)
      .message("Offer")
      .body(offer)
      .send();
  };

  //@desc search offers by search query
  //@route GET /api/offer/search
  //@access public
  searchOffers = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { name } = req.query;
    const offers = await OfferService.searchByName(name);
    Logger.info(`Offers found by search query:`);
    Response(res)
      .status(200)
      .message("Offers found by search query")
      .body(offers)
      .send();
  };

  //@desc create offer by storeId
  //@route POST /api/offer/store/:storeId/create
  //@access private
  createOffer = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { name, allListingsIncluded, comboOffer, listings, minAmountCondition, discount } = req.body;
    const offer = await OfferService.create({
      name,
      storeId : req.params.storeId,
      allListingsIncluded,
      comboOffer,
      listings,
      minAmountCondition,
      discount,
    });
    Logger.info("Offer created successfully");
    Response(res).status(201).body({ offer }).send();
  };

  //@desc add offer to cart by cartId
  //@route POST /api/offer/:offerId/cart/:cartId
  //@access private
  addOffer = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { offerId, cartId } = req.params;

    const cart = await CartService.findById(cartId);

    if (!cart) {
      throw new HttpError(404, "Cart not found");
    }

    //logic to find which listing to apply offer

    Logger.info("Offer added to user's cart successfully");
    Response(res).status(200).message("Offer added to user's cart").send();
  };

  //@desc update offer
  //@route PUT /api/offer/:offerId
  //@access private
  updateOffer = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { offerId } = req.params;
    const { name, allListingsIncluded, comboOffer, listings, minAmountCondition, discount } = req.body;
    const updatedOffer = await OfferService.updateById(offerId, {
      name,
      allListingsIncluded,
      comboOffer,
      listings,
      minAmountCondition,
      discount,
    });
    Logger.info("Offer updated successfully");
    Response(res).status(200).body({ offer: updatedOffer }).send();
  };

  //@desc delete offer
  //@route DELETE /api/offer/:offerId
  //@access private
  deleteOffer = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { offerId } = req.params;
    await OfferService.deleteById(offerId);
    Logger.info("Offer deleted successfully");
    Response(res).status(200).message("Offer deleted").send();
  };

}

module.exports.OfferController = new OfferController();