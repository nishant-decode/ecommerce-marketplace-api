const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

const { OfferService } = require("../services/offer.service");
const { CartService } = require("../services/cart.service");
const { StoreService } = require("../services/store.service");

class OfferController {
  //@desc get all orders
  //@route GET /api/offer/
  //@access private
  getAllOffers = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const offers = await OfferService.findAll();
    Logger.info(`All offers:`);
    Response(res).status(200).message("All offers").body(offers).send();
  };

  //@desc get offer
  //@route GET /api/offer/:offerId
  //@access private
  getOffer = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { offerId } = req.params;
    const offer = await OfferService.findById(offerId);
    Logger.info(`Offer:`);
    Response(res).status(200).message("Offer").body(offer).send();
  };

  //@desc search offers by search query
  //@route GET /api/offer/cart/:cartId
  //@access private
  searchOffers = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { cartId } = req.params;

    // Retrieve the cart
    const cart = await CartService.findById(cartId);
    if (!cart) {
      throw new HttpError(404, "Cart not found");
    }

    if (
      cart.userId.toString() !== req.user._id.toString() &&
      req.user.role.toString() !== "Admin"
    ) {
      throw new HttpError(404, "Unauthorized!");
    }

    // Extract all listing IDs from the cart
    const listingIds = [
      ...cart.products.map((product) => product.productVariantId.toString()),
      ...cart.services.map((service) => service.serviceId.toString()),
      ...cart.events.map((event) => event.ticketId.toString()),
    ];

    // Find all offers that include any of the listings in the cart
    const offers = await OfferService.find({
      $or: [
        { "listings.products": { $in: listingIds } },
        { "listings.services": { $in: listingIds } },
        { "listings.events": { $in: listingIds } },
      ],
    });

    // Create a map to store unique offers based on offer ID
    const uniqueOffersMap = new Map();
    for (const offer of offers) {
      uniqueOffersMap.set(offer._id.toString(), offer);
    }

    // Extract unique offers from the map
    const uniqueOffers = [...uniqueOffersMap.values()];

    Logger.info(`Offers found by cartId: ${uniqueOffers.length}`);

    Response(res)
      .status(200)
      .message("Offers found by cartId")
      .body(uniqueOffers)
      .send();
  };

  //@desc create offer by storeId
  //@route POST /api/offer/store/:storeId/create
  //@access private
  createOffer = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { storeId } = req.params;
    const {
      offerType,
      offerName,
      discount,
      listings,
      minValueCondition,
      maxOfferValue,
    } = req.body;

    // Validate request body
    if (!offerType || !offerName || !discount || !listings) {
      throw new HttpError(400, "Missing required fields");
    }

    const store = await StoreService.findById(storeId);

    if (store.sellerId.toString() !== req.user._id.toString()) {
      throw new HttpError(404, "Unauthorized!");
    }

    // Determine the offer type
    let comboOffer = false;
    let allListingsIncluded = false;
    if (offerType === "ComboOffer") {
      comboOffer = true;
    } else if (offerType === "AllListingsIncluded") {
      allListingsIncluded = true;
    } else {
      throw new HttpError(400, "Invalid offer type");
    }

    // Perform additional validation based on offer type
    if (comboOffer && allListingsIncluded) {
      throw new HttpError(
        400,
        "Invalid offer type: cannot be both ComboOffer and AllListingsIncluded"
      );
    }

    // Create the offer
    const offer = await OfferService.create({
      storeId,
      offerType,
      offerName,
      discount,
      listings,
      minValueCondition,
      maxOfferValue,
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

    const offer = await OfferService.findById(offerId);
    if (!offer) {
      throw new HttpError(404, "Offer not found");
    }

    const cart = await CartService.findById(cartId);
    if (!cart) {
      throw new HttpError(404, "Cart not found");
    }

    if (cart.userId.toString() !== req.user._id.toString()) {
      throw new HttpError(404, "Unauthorized!");
    }

    let offerApplicable = false;

    if (offer.offerType === "ComboOffer") {
      let allListingsPresent = true;
      for (const listingType of Object.keys(offer.listings)) {
        for (const listingId of offer.listings[listingType]) {
          let listingFound = false;
          if (listingType === "products") {
            listingFound = cart.products.some(
              (product) =>
                product.productVariantId.toString() === listingId.toString()
            );
          } else if (listingType === "services") {
            listingFound = cart.services.some(
              (service) => service.serviceId.toString() === listingId.toString()
            );
          } else if (listingType === "events") {
            listingFound = cart.events.some(
              (event) => event.ticketId.toString() === listingId.toString()
            );
          }
          if (!listingFound) {
            allListingsPresent = false;
            break;
          }
        }
        if (!allListingsPresent) break; // Break outer loop if any listing is not present
      }
      offerApplicable = allListingsPresent;
    } else if (offer.offerType === "AllListingsIncluded") {
      // Check if the total price of listings in the cart exceeds the minValueCondition
      const totalPrice =
        cart.products.reduce(
          (total, product) => total + product.price * product.quantity,
          0
        ) +
        cart.services.reduce(
          (total, service) => total + service.price * service.quantity,
          0
        ) +
        cart.events.reduce(
          (total, event) => total + event.price * event.quantity,
          0
        );

      offerApplicable = totalPrice >= offer.minValueCondition;
    }

    if (offerApplicable) {
      // Apply offer to the cart
      cart.offerApplied = offerId;
      await cart.save();

      await CartService.calculateTotalAmount(cartId);

      Logger.info("Offer added to user's cart successfully");
      Response(res).status(200).message("Offer added to user's cart").send();
    } else {
      Logger.info("Offer is not applicable to the cart");
      Response(res)
        .status(400)
        .message("Offer is not applicable to the cart")
        .send();
    }
  };

  //@desc update offer
  //@route PUT /api/offer/:offerId
  //@access private
  updateOffer = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { offerId } = req.params;
    const {
      offerType,
      offerName,
      discount,
      listings,
      minValueCondition,
      maxOfferValue,
    } = req.body;

    // Retrieve the existing offer
    const existingOffer = await OfferService.findById(offerId);
    if (!existingOffer) {
      throw new HttpError(404, "Offer not found");
    }

    const store = await StoreService.findById(existingOffer.storeId);

    if (
      store.sellerId.toString() !== req.user._id.toString() &&
      req.user.role.toString() !== "Admin"
    ) {
      throw new HttpError(404, "Unauthorized!");
    }

    // Validate request body
    if (!offerType || !offerName || !discount || !listings) {
      throw new HttpError(400, "Missing required fields");
    }

    // Determine the offer type
    let comboOffer = false;
    let allListingsIncluded = false;
    if (offerType === "ComboOffer") {
      comboOffer = true;
    } else if (offerType === "AllListingsIncluded") {
      allListingsIncluded = true;
    } else {
      throw new HttpError(400, "Invalid offer type");
    }

    // Perform additional validation based on offer type
    if (comboOffer && allListingsIncluded) {
      throw new HttpError(
        400,
        "Invalid offer type: cannot be both ComboOffer and AllListingsIncluded"
      );
    }

    // Update the offer
    const updatedOffer = await OfferService.findByIdAndUpdate(offerId, {
      offerType,
      offerName,
      discount,
      listings,
      minValueCondition,
      maxOfferValue,
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

    const existingOffer = await OfferService.findById(offerId);
    if (!existingOffer) {
      throw new HttpError(404, "Offer not found");
    }

    const store = await StoreService.findById(existingOffer.storeId);

    if (
      store.sellerId.toString() !== req.user._id.toString() &&
      req.user.role.toString() !== "Admin"
    ) {
      throw new HttpError(404, "Unauthorized!");
    }

    await OfferService.deleteById(offerId);
    Logger.info("Offer deleted successfully");
    Response(res).status(200).message("Offer deleted").send();
  };
}

module.exports.OfferController = new OfferController();
