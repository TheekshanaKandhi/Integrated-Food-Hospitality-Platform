const MenuItem = require("../models/MenuItem");

const addMenuItem = async (req, res) => {
  try {
    const { restaurant, name, price, category, isAvailable } = req.body;

    const menuItem = await MenuItem.create({
      restaurant,
      name,
      price,
      category,
      isAvailable
    });

    res.status(201).json({
      message: "Menu item added successfully",
      menuItem
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find().populate("restaurant", "name cuisine address");
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addMenuItem, getMenuItems };