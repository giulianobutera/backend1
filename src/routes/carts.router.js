const express = require('express');
const router = express.Router();
const CartManager = require('../cartManager');
const cartManager = new CartManager('./data/carts.json');

// Ruta POST /api/carts
// Crea un nuevo carrito vacío
router.post('/', async (req, res) => {
  const cart = await cartManager.createCart();
  res.status(201).json(cart);
});

// Ruta GET /api/carts/:cid
// Busca un carrito por su ID
router.get('/:cid', async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  cart ? res.json(cart) : res.status(404).json({ error: 'Carrito no encontrado' });
});

// Ruta POST /api/carts/:cid/product/:pid
// Agrega un producto (por su ID) a un carrito específico (por su ID)
router.post('/:cid/product/:pid', async (req, res) => {
  const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
  updatedCart ? res.json(updatedCart) : res.status(404).json({ error: 'Error al agregar producto' });
});

module.exports = router;
