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
//create function to read the inventories file
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

//Patch
router.patch("/:id", (req, res) => {
  const warehousesData = readWarehouses();
  const warehouseID = req.params.id;
  const warehouse = warehousesData.find(
    (warehouse) => warehouse.id === warehouseID
  );

  if (!warehouse)
    return res.status(404).json({ message: "Warehouse Not Found" });

  console.log("Requested body", req.body);
  warehouse.name = req.body.name;
  warehouse.address = req.body.address;
  warehouse.city = req.body.city;
  warehouse.country = req.body.country;
  warehouse.contact.name = req.body.contact.name;
  warehouse.contact.position = req.body.contact.position;
  warehouse.contact.phone = req.body.contact.phone;
  warehouse.contact.email = req.body.contact.email;

  fs.writeFileSync("./data/warehouses.json", JSON.stringify(warehousesData));

  res.status(202).json(warehouse);
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

  fs.writeFileSync(
    "./data/warehouses.json",
    JSON.stringify(filteredWarehouses)
  );
  fs.writeFileSync(
    "./data/inventories.json",
    JSON.stringify(filteredInventory)
  );
  res.status(200).json(filteredWarehouses);
});

module.exports = router;
