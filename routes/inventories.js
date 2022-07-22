const express = require("express");
const router = express.Router();
const fs = require("fs");
const uniqid = require("uniqid");

//create function to read files
const readData = (path) => {
  const dataFile = fs.readFileSync(path);
  const parsedData = JSON.parse(dataFile);
  return parsedData;
};

//create endpoint to get all inventories
//GET /inventories
router.get("/", (req, res) => {
  const inventoryData = readData("./data/inventories.json");

  res.status(200).json(inventoryData);
});

// Deletes inventory item from the list
//DELETE /inventories/:id
router.delete("/:id", (req, res) => {
  const inventoryData = readData("./data/inventories.json");
  const selectedInventoryItem = inventoryData.find(
    (item) => item.id === req.params.id
  );
  if (!selectedInventoryItem) {
    res.status(404).send("Inventory item not found");
    return;
  }
  const filteredInventory = inventoryData.filter((item) => {
    return item.id !== req.params.id;
  });

  fs.writeFileSync(
    "./data/inventories.json",
    JSON.stringify(filteredInventory)
  );
  res.status(200).json(filteredInventory);
});

module.exports = router;
