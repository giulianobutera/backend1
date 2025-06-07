const express = require('express');
const router = express.Router();
const ProductManager = require('../productManager');
const productManager = new ProductManager();

// Ruta GET /api/products
// Devuelve todos los productos existentes paginados y con querys
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort, query } = req.query;
    const result = await productManager.getPaginatedProducts({ page, limit, sort, query });
    res.json(result);
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
});

// Ruta GET /api/products/:pid
// Devuelve un producto específico por su ID
router.get('/:pid', async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    product
      ? res.json(product)
      : res.status(404).json({ error: 'Producto no encontrado' });
  } catch (err) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// Ruta POST /api/products
// Crea un nuevo producto
router.post('/', async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear producto', details: err.message });
  }
});

// Ruta PUT /api/products/:pid
// Actualiza un producto existente por su ID
router.put('/:pid', async (req, res) => {
  try {
    const updated = await productManager.updateProduct(req.params.pid, req.body);
    updated
      ? res.json(updated)
      : res.status(404).json({ error: 'Producto no encontrado' });
  } catch (err) {
    res.status(400).json({ error: 'ID inválido o datos incorrectos' });
  }
});

// Ruta DELETE /api/products/:pid
// Elimina un producto por su ID
router.delete('/:pid', async (req, res) => {
  try {
    const deleted = await productManager.deleteProduct(req.params.pid);
    deleted
      ? res.json({ message: 'Producto eliminado', id: deleted._id })
      : res.status(404).json({ error: 'Producto no encontrado' });
  } catch (err) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

module.exports = router;