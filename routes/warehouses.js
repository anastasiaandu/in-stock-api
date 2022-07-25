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


//create endpoints to get all warehouses and post a warehouse
//GET /warehouses
//POST /warehouse
router
  .route('/')
  .get((req, res) => {
  const warehousesData = readWarehouses();

  res.status(200).json(warehousesData);
  })
  .post((req, res) => {

    if (!req.body.name || 
        !req.body.address ||
        !req.body.city ||
        !req.body.country ||
        !req.body.contact.name ||
        !req.body.contact.position ||
        !req.body.contact.phone ||
        !req.body.contact.email
       ) {
      res.status(400).send('All fields are required');
      return
    }

    const warehousesData = readWarehouses();

    const newWarehouse = {
      id: uniqid(),
      name: req.body.name,
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
      contact: {
        name: req.body.contact.name,
        position: req.body.contact.position,
        phone: req.body.contact.phone,
        email: req.body.contact.email
      }
    };

    warehousesData.push(newWarehouse);

    fs.writeFileSync('./data/warehouses.json', JSON.stringify(warehousesData));

    res.status(201).json(newWarehouse);
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


//create endpoint to edit a warehouse
//PATCH /warehouses/:id
router.patch("/:id", (req, res) => {
  const warehousesData = readWarehouses();
  const warehouseID = req.params.id;
  const warehouse = warehousesData.find(
    (warehouse) => warehouse.id === warehouseID
  );

  if (!warehouse)
    return res.status(404).json({ message: "Warehouse Not Found" });

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
