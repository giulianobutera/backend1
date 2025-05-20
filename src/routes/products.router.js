const express = require('express');
const router = express.Router();
const ProductManager = require('../productManager');
const productManager = new ProductManager('./data/products.json');

// Ruta GET /api/products
// Devuelve todos los productos existentes
router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

// Ruta GET /api/products/:pid
// Devuelve un producto específico por su ID
router.get('/:pid', async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Ruta POST /api/products
// Agrega un nuevo producto
router.post('/', async (req, res) => {
  const newProduct = await productManager.addProduct(req.body);
  res.status(201).json(newProduct);
});

// Ruta PUT /api/products/:pid
// Actualiza un producto existente por su ID
router.put('/:pid', async (req, res) => {
  const updated = await productManager.updateProduct(req.params.pid, req.body);
  updated ? res.json(updated) : res.status(404).json({ error: 'Producto no encontrado' });
});

// Ruta DELETE /api/products/:pid
// Elimina un producto por su ID
router.delete('/:pid', async (req, res) => {
  const deleted = await productManager.deleteProduct(req.params.pid);
  deleted ? res.json(deleted) : res.status(404).json({ error: 'Producto no encontrado' });
});

module.exports = router;
