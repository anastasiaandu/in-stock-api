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

//create endpoint to get all inventories and post an inventory
//GET /inventories
//POST /inventory
router
  .route("/")
  .get((req, res) => {
    const inventoryData = readData("./data/inventories.json");

  res.status(200).json(inventoryData);
  })
  .post((req, res) => {

    if (!req.body.warehouseName || 
        !req.body.itemName ||
        !req.body.description ||
        !req.body.category ||
        !req.body.status ||
        !req.body.quantity
       ) {
      res.status(400).send('All fields are required');
      return
    }

    const inventoryData = readData('./data/inventories.json');
    const warehousesData = readData('./data/warehouses.json');
    const selectedWarehouse = warehousesData.find(warehouse => warehouse.name === req.body.warehouseName);

    if (!selectedWarehouse) {
      res.status(404).send('Warehouse not found');
      return;
    }

    const newInventory = {
      id: uniqid(),
      warehouseID: selectedWarehouse.id,
      warehouseName: req.body.warehouseName,
      itemName: req.body.itemName,
      description: req.body.description,
      category: req.body.category,
      status: req.body.status,
      quantity: req.body.quantity
    };

    inventoryData.push(newInventory);

    fs.writeFileSync('./data/inventories.json', JSON.stringify(inventoryData));

    res.status(201).json(newInventory);
  });
  

// Changes inventory item based on id
//PATCH /inventories/:id
router
  .patch("/:id", (req, res) => {
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
      "./data/inventories.json",
      JSON.stringify(inventoryData)
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
