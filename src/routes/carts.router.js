const express = require('express');
const router = express.Router();
const CartManager = require('../cartManager');
const cartManager = new CartManager();

// Ruta POST /api/carts
// Crea un nuevo carrito vacío
router.post('/', async (req, res) => {
  try {
    const cart = await cartManager.createCart();
    res.status(201).json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear carrito' });
  }
});

// Ruta GET /api/carts/:cid
// Busca un carrito por su ID
router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    cart
      ? res.json(cart)
      : res.status(404).json({ error: 'Carrito no encontrado' });
  } catch (err) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// Ruta POST /api/carts/:cid/product/:pid
// Agrega un producto (por su ID) a un carrito específico (por su ID)
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
    updatedCart
      ? res.json(updatedCart)
      : res.status(404).json({ error: 'Carrito o producto no encontrado' });
  } catch (err) {
    res.status(400).json({ error: 'Error al agregar producto al carrito' });
  }
});

// Ruta DELETE /api/carts/:cid/products/:pid
// Elimina un producto específico del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const result = await cartManager.removeProductFromCart(req.params.cid, req.params.pid);
    result
      ? res.json({ message: 'Producto eliminado del carrito' })
      : res.status(404).json({ error: 'Carrito o producto no encontrado' });
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
});

// Ruta PUT /api/carts/:cid 
// Reemplaza todos los productos del carrito
router.put('/:cid', async (req, res) => {
  try {
    const result = await cartManager.updateCart(req.params.cid, req.body.products);
    result
      ? res.json({ message: 'Carrito actualizado', cart: result })
      : res.status(404).json({ error: 'Carrito no encontrado' });
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
});

// Ruta PUT /api/carts/:cid/products/:pid 
// Actualiza cantidad de producto
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { quantity } = req.body;
    const result = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, quantity);
    result
      ? res.json({ message: 'Cantidad actualizada', cart: result })
      : res.status(404).json({ error: 'Carrito o producto no encontrado' });
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
});

// Ruta DELETE /api/carts/:cid 
// Elimina todos los productos del carrito
router.delete('/:cid', async (req, res) => {
  try {
    const result = await cartManager.clearCart(req.params.cid);
    result
      ? res.json({ message: 'Carrito vaciado' })
      : res.status(404).json({ error: 'Carrito no encontrado' });
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
});

module.exports = router;