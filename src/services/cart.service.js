const { Cart } = require("../models/cart.model");
const BasicServices = require("./basic.service");
const { ProductVariantService } = require("./productVariant.service");
const { ServiceService } = require("./service.service");
const { TicketService } = require("./ticket.service");
const { OfferService } = require("./offer.service");

class CartService extends BasicServices {
  constructor() {
    super(Cart);
  }

  applyDiscounts = async (cart) => {
    if (!cart.offerApplied) {
      return 0;
    }

    const offer = await OfferService.findById(cart.offerApplied);
    if (!offer) {
      throw new Error("Offer not found");
    }

    let couponDiscountedAmount = 0;

    if (offer.offerType === "ComboOffer") {
      // Calculate discounted amount for combo offer
      for (const product of cart.products) {
        if (offer.listings.products.includes(product.productVariantId)) {
          const productVariant = await ProductVariantService.findById(
            product.productVariantId
          );
          couponDiscountedAmount +=
            (offer.discount / 100) * (productVariant.price * product.quantity);
        }
      }
      for (const service of cart.services) {
        if (offer.listings.services.includes(service.serviceId)) {
          const servicePrice = await this.calculateTotalService([service]);
          couponDiscountedAmount += (offer.discount / 100) * servicePrice;
        }
      }
      for (const event of cart.events) {
        if (offer.listings.events.includes(event.ticketId)) {
          const eventTicket = await TicketService.findById(event.ticketId);
          couponDiscountedAmount +=
            (offer.discount / 100) * (eventTicket.price * event.quantity);
        }
      }
    } else if (offer.offerType === "AllListingsIncluded") {
      // Calculate discounted amount for all listings included offer
      let totalListingsPrice = 0;
      for (const product of cart.products) {
        totalListingsPrice += await this.calculateProductPrice(product);
      }
      for (const service of cart.services) {
        totalListingsPrice += await this.calculateTotalService([service]);
      }
      for (const event of cart.events) {
        totalListingsPrice += await this.calculateEventPrice(event);
      }
      couponDiscountedAmount = Math.min(
        (offer.discount / 100) * totalListingsPrice,
        offer.maxOfferValue
      );
    }

    cart.couponDiscountedAmount = couponDiscountedAmount;

    return couponDiscountedAmount;
  };

  calculateProductPrice = async (product) => {
    const productVariant = await ProductVariantService.findById(
      product.productVariantId
    );
    return productVariant.price * product.quantity;
  };

  calculateTotalService = async (services) => {
    let totalPrice = 0;

    for (const service of services) {
      const mainService = await ServiceService.findById(service.serviceId);
      totalPrice += mainService.price.original;
      for (const additionalServiceId of service.additionalServices) {
        const additionalService = await ServiceService.findById(
          additionalServiceId
        );
        totalPrice += additionalService.price.original;
      }
    }

    return totalPrice;
  };

  calculateEventPrice = async (event) => {
    const eventTicket = await TicketService.findById(event.ticketId);
    return eventTicket.price * event.quantity;
  };

  calculateTotalProduct = async (cartItems) => {
    let totalPrice = 0;

    for (const cartItem of cartItems) {
      const productVariant = await ProductVariantService.findById(
        cartItem.productVariantId
      );
      totalPrice += productVariant.price * cartItem.quantity;
    }

    return totalPrice;
  };

  calculateTotalService = async (cartItems) => {
    let totalPrice = 0;

    for (const cartItem of cartItems) {
      const service = await ServiceService.findById(cartItem.serviceId);
      totalPrice += service.price.original;
      for (const additionalService of cartItems.additionalServices) {
        const addedService = await ServiceService.findById(additionalService);
        totalPrice += addedService.price.original;
      }
    }

    return totalPrice;
  };

  calculateTotalEvent = async (cartItems) => {
    let totalPrice = 0;

    for (const cartItem of cartItems) {
      const ticket = await TicketService.findById(cartItem.ticketId);
      totalPrice += ticket.price * cartItem.quantity;
    }

    return totalPrice;
  };

  calculateTotalAmount = async (cartId) => {
    const cart = await Cart.findById(cartId);

    const totalProductPrice = await this.calculateTotalProduct(cart.products);
    const totalServicePrice = await this.calculateTotalService(cart.services);
    const totalEventPrice = await this.calculateTotalEvent(cart.events);

    // Calculate original total price for the cart
    const totalPrice = {
      product: totalProductPrice,
      services: totalServicePrice,
      event: totalEventPrice,
    };

    // Assuming coupon discounts are applied similarly to overall discounts
    const couponDiscountedAmount = await this.applyDiscounts(cart);

    // Calculate the total amount considering platform fee and shipping fee
    const totalAmount =
      totalProductPrice +
      totalServicePrice +
      totalEventPrice -
      couponDiscountedAmount +
      cart.platformFee +
      cart.shippingFee;

    // Update the cart object with the calculated values
    cart.originalTotalPrice = totalPrice;
    if (totalPrice) {
      cart.couponDiscountedAmount = couponDiscountedAmount;
      cart.totalAmount = totalAmount;
    } else {
      cart.couponDiscountedAmount = 0;
      cart.totalAmount = 0;
    }

    await cart.save();

    return;
  };
}

module.exports.CartService = new CartService();
