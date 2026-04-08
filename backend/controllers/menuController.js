const Menu = require("../models/MenuItem");
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
      .populate("restaurant", "name cuisine address imageUrl")
      .sort({ createdAt: -1 });

    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMenuItem = async (req, res) => {
  try {
    const { name, category, price, restaurant } = req.body;

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

module.exports = {
  getMenuItems,
  createMenuItem
};