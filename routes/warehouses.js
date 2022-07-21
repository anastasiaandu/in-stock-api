const express = require("express");
const router = express.Router();
const fs = require("fs");
const uniqid = require("uniqid");

//create function to read warehouses file
const readWarehouses = () => {
  const warehousesDataFile = fs.readFileSync("./data/warehouses.json");
  const warehousesData = JSON.parse(warehousesDataFile);
  return warehousesData;
};
const readInventory = () => {
  const inventoryDataFile = fs.readFileSync("./data/inventories.json");
  const inventoryData = JSON.parse(inventoryDataFile);
  return inventoryData;
};

//create endpoint to get all warehouses
//GET /warehouses
router.get("/", (req, res) => {
  const warehousesData = readWarehouses();

  res.status(200).json(warehousesData);
});

//create endpoint to get a single warehouse information and inventory
//GET /warehouses/:id
router.get("/:id", (req, res) => {
  const warehousesData = readWarehouses();
  const inventoryData = readInventory();
  const selectedWarehouse = warehousesData.find(
    (warehouse) => warehouse.id === req.params.id
  );
  if (!selectedWarehouse) {
    res.status(404).send("Warehouse not found");
    return;
  }

  selectedInventory = inventoryData.filter(
    (inventory) => inventory.warehouseID === req.params.id
  );
  selectedWarehouse.inventory = selectedInventory;

  res.status(200).json(selectedWarehouse);
});

// Deletes warehouse from the list and its inventory
//DELETE /warehouses/:id
router.delete("/:id", (req, res) => {
  const warehousesData = readWarehouses();
  const inventoryData = readInventory();
  const selectedWarehouse = warehousesData.find(
    (warehouse) => warehouse.id === req.params.id
  );
  if (!selectedWarehouse) {
    res.status(404).send("Warehouse not found");
    return;
  }
  const filteredWarehouses = warehousesData.filter((warehouse) => {
    return warehouse.id !== req.params.id;
  });
  const filteredInventory = inventoryData.filter((item) => {
    return item.warehouseID !== req.params.id;
  });

  fs.writeFileSync("./data/warehouses.json", JSON.stringify(warehousesData));
  fs.writeFileSync("./data/warehouses.json", JSON.stringify(filteredInventory));
  res.status(200).json(filteredWarehouses);
});

module.exports = router;
