const HttpError = require("../helpers/httpError.helpers");
const Response = require("../helpers/response.helpers");
const Logger = require("../helpers/logger.helpers");

const { AddressService } = require("../services/address.service");
const { UserService } = require("../services/user.service");

class AddressController {
  //@desc get all addresss
  //@route GET /api/address/
  //@access public
  getAllAddresses = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const addresses = await AddressService.find();

    if (!addresses) {
      throw new HttpError(404, "Addresses not found");
    }

    Logger.info(`All addresses: ${addresses}`);
    Response(res)
      .status(200)
      .message("All addresses")
      .body({ addresses })
      .send();
  };

  //@desc get address
  //@route GET /api/address/:addressId
  //@access public
  getAddress = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { addressId } = req.params;
    const address = await AddressService.findById(addressId);

    if (!address) {
      throw new HttpError(404, "Address not found");
    }

    Logger.info(`Address: ${address}`);
    Response(res).status(200).message("Address").body({ address }).send();
  };

  //@desc create address by userId
  //@route POST /api/offer/user/:userId/create
  //@access private
  createAddress = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { userId } = req.params;
    const addressData = req.body;

    const user = await UserService.findById(userId);
    if (!user) {
      Logger.error(`User not found`);
      throw new HttpError(404, "User not found");
    }

    if (userId.toString() !== req.user._id.toString()) {
      throw new HttpError(404, "Unauthorized!");
    }

    const address = await AddressService.create({ userId, ...addressData });

    if (address) {
      Logger.info(`Address created: ${address}`);
      Response(res)
        .status(201)
        .message("Address created")
        .body({ address })
        .send();
    } else {
      Logger.error(`Error creating address.`);
      throw new HttpError(500, "Error creating address");
    }
  };

  //@desc set default address by addressId
  //@route GET /api/address/:addressId/default
  //@access public
  setDefaultAddress = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { addressId } = req.params;

    const address = await AddressService.findById(addressId);

    if (address.userId.toString() !== req.user._id.toString()) {
      throw new HttpError(404, "Unauthorized!");
    }

    await AddressService.findByIdAndUpdate(addressId, { isDefault: true });

    Logger.info(`Default address set`);
    Response(res).status(200).message("Default address set").body().send();
  };

  //@desc update address
  //@route PUT /api/address/:addressId
  //@access private
  updateAddress = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { addressId } = req.params;
    const addressData = req.body;

    const address = await AddressService.findById(addressId);

    if (
      address.userId.toString() !== req.user._id.toString() &&
      req.user.role.toString() !== "Admin"
    ) {
      throw new HttpError(404, "Unauthorized!");
    }

    Object.assign(address, addressData);

    const updatedAddress = await address.save();

    Logger.info(`Address updated: ${updatedAddress}`);
    Response(res)
      .status(200)
      .message("Address updated")
      .body({ address: updatedAddress })
      .send();
  };

  //@desc delete address
  //@route DELETE /api/address/:addressId
  //@access private
  deleteAddress = async (req, res) => {
    Logger.info(`Request received: ${req.method} ${req.url}`);

    const { addressId } = req.params;

    const address = await AddressService.findById(addressId);

    if (
      address.userId.toString() !== req.user._id.toString() &&
      req.user.role.toString() !== "Admin"
    ) {
      throw new HttpError(404, "Unauthorized!");
    }

    await AddressService.findByIdAndDelete(addressId);

    Logger.info(`Address deleted`);
    Response(res).status(200).message("Address deleted").body().send();
  };
}

module.exports.AddressController = new AddressController();
