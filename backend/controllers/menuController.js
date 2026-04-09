const Menu = require("../models/MenuItem");
const Restaurant = require("../models/Restaurant");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadToCloudinary = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

const getMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find()
      .populate("restaurant", "name cuisine address")
      .sort({ createdAt: -1 });

    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMenuItem = async (req, res) => {
  try {
    const { name, category, price, restaurant } = req.body;

    const restaurantExists = await Restaurant.findById(restaurant);
    if (!restaurantExists) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    let imageUrl = "";

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer, "foodapp/menu");
      imageUrl = uploadedImage.secure_url;
    }

    const menuItem = await Menu.create({
      name,
      category,
      price: Number(price),
      restaurant,
      imageUrl
    });

    res.status(201).json({
      message: "Menu item added successfully",
      menuItem
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { name, category, price, restaurant } = req.body;

    const menuItem = await Menu.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    if (restaurant) {
      const restaurantExists = await Restaurant.findById(restaurant);
      if (!restaurantExists) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      menuItem.restaurant = restaurant;
    }

    if (name !== undefined) menuItem.name = name;
    if (category !== undefined) menuItem.category = category;
    if (price !== undefined) menuItem.price = Number(price);

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer, "foodapp/menu");
      menuItem.imageUrl = uploadedImage.secure_url;
    }

    await menuItem.save();

    const updatedMenuItem = await Menu.findById(menuItem._id).populate(
      "restaurant",
      "name cuisine address"
    );

    res.status(200).json({
      message: "Menu item updated successfully",
      menuItem: updatedMenuItem
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await Menu.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    await Menu.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Menu item deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};