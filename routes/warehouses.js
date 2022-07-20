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

//create endpoint to get all warehouses
//GET
router.get("/", (req, res) => {
  const warehousesData = readWarehouses();

  res.status(200).json(warehousesData);
});

//Patch
app.patch("/warehouse/:id", (req, res) => {
  const warehouseID = req.params.id;
  //   res.json(students);
});
module.exports = router;
