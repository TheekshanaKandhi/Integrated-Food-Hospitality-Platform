const Restaurant = require("../models/Restaurant");
const Menu = require("../models/MenuItem");
const Review = require("../models/Review");
const Order = require("../models/Order");
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

const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRestaurant = async (req, res) => {
  try {
    const { name, cuisine, rating, address, mapUrl } = req.body;

    let imageUrl = "";

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer, "foodapp/restaurants");
      imageUrl = uploadedImage.secure_url;
    }

    const restaurant = await Restaurant.create({
      name,
      cuisine,
      rating: Number(rating),
      address,
      mapUrl,
      imageUrl
    });

    res.status(201).json({
      message: "Restaurant added successfully",
      restaurant
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    await Menu.deleteMany({ restaurant: restaurant._id });
    await Review.deleteMany({ restaurant: restaurant._id });
    await Order.deleteMany({ restaurant: restaurant._id });
    await Restaurant.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  deleteRestaurant
};