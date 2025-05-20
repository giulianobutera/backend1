const express = require('express');
const router = express.Router();
const ProductManager = require('../productManager');
const productManager = new ProductManager('./data/products.json');

// Ruta GET /
// Renderiza la vista home con todos los productos actuales
router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { products });
});

// Ruta GET /realtimeproducts
// Renderiza la vista en tiempo real, con WebSocket
router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

module.exports = router;
