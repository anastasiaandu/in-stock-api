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

// Changes inventory item based on id
router
  .patch("/:id", (req, res) => {
    //PATCH /inventories/:id
    const inventoryData = readData("./data/inventories.json");
    const selectedInventoryItem = inventoryData.find(
      (item) => item.id === req.params.id
    );
    if (!selectedInventoryItem) {
      res.status(404).json({ message: "Item not Found" });
      return;
    }

    console.log("Requested body", req.body);
    selectedInventoryItem.warehouseName = req.body.warehouseName;
    selectedInventoryItem.itemName = req.body.itemName;
    selectedInventoryItem.description = req.body.description;
    selectedInventoryItem.category = req.body.category;
    selectedInventoryItem.status = req.body.status;
    selectedInventoryItem.quantity = req.body.quantity;

    fs.writeFileSync(
      "./data/warehouses.json",
      JSON.stringify(selectedInventoryItem)
    );
    res.status(202).json(selectedInventoryItem);
  }) // Deletes inventory item from the list
  .delete("/:id", (req, res) => {
    //DELETE /inventories/:id
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
