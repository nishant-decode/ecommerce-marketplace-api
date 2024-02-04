calculateTotalProduct = (productItem) => {
  // Calculate the total price for the product item
  const itemTotal = ((productDetails.price.original * productDetails.price.discount) / 100) * productItem.quantity;
  return itemTotal;
};

calculateTotalService = (serviceItem) => {
  // Calculate the total price for the product item
  const itemTotal = (serviceDetails.price.original * serviceDetails.price.discount) / 100;
  return itemTotal;
};

calculateTotalEvent = (eventItem) => {
  // Calculate the total price for the product item
  const itemTotal = ((eventDetails.price.original * eventDetails.price.discount) / 100) * eventItem.quantity;
  return itemTotal;
};

applyDiscounts = (totalAmount) => {
  // For simplicity, let's assume there is a single offer with a 10% discount
  const discountPercentage = 10;
  const discountAmount = (totalAmount * discountPercentage) / 100;

  // Subtract the discount amount from the total amount
  return totalAmount - discountAmount;
};

calculateTotal = (cartItems, calculateTotalFunction) => {
  let total = 0;

  for (const cartItem of cartItems) {
    total += calculateTotalFunction(cartItem);
  }

  // Apply discounts
  const discountedAmount = this.applyDiscounts(total);

  return discountedAmount;
};

module.exports = {
  calculateTotalProduct,
  calculateTotalService,
  calculateTotalEvent,
  applyDiscounts,
  calculateTotal,
};
