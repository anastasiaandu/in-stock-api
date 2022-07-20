const express = require('express');
const app = express();
const inventoriesRoutes = require('./routes/inventories');
const warehousesRoutes = require('./routes/warehouses');
const cors = require('cors');

require('dotenv').config();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

// app.use('/inventories', inventoriesRoutes);
app.use('/warehouses', warehousesRoutes);

app
    .listen(PORT, () => {
        console.log(`Server is listening on ${PORT}`);
    })