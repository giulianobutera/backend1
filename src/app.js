const express = require('express');
const ProductManager = require('./productManager');
const CartManager = require('./cartManager');

const app = express();
const port = 8080;

const productManager = new ProductManager('./products.json');
const cartManager = new CartManager('./carts.json');

app.use(express.json());

// Rutas de productos
/**
 * Obtiene todos los productos
 */
app.get('/api/products', async (req, res) => {
  const products = await productManager.getProducts();
  res.json({ products });
});

/**
 * Obtiene un producto por su id
 */
app.get('/api/products/:pid', async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

/**
 * Crea un nuevo producto
 */
app.post('/api/products', async (req, res) => {
  const { title, description, price, status, stock, category, thumbnails, code } = req.body;
  if (!title || !description || !price || !status || !stock || !category || !thumbnails || !code) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  const newProduct = await productManager.addProduct({
    title,
    description,
    price,
    status,
    stock,
    category,
    thumbnails,
    code
  });
  res.status(201).json(newProduct);
});

/**
 * Actualiza un producto por su id
 */
app.put('/api/products/:pid', async (req, res) => {
  const { pid } = req.params;
  const updatedProduct = await productManager.updateProduct(pid, req.body);
  if (updatedProduct) {
    res.json(updatedProduct);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

/**
 * Elimina un producto por su id
 */
app.delete('/api/products/:pid', async (req, res) => {
  const { pid } = req.params;
  const deletedProduct = await productManager.deleteProduct(pid);
  if (deletedProduct) {
    res.json(deletedProduct);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Rutas de carritos
/**
 * Crea un carrito
 */
app.post('/api/carts', async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

/**
 * Obtiene un carrito por su id
 */
app.get('/api/carts/:cid', async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

/**
 * Agrega un producto por su id, a un carrito por su id
 */
app.post('/api/carts/:cid/product/:pid', async (req, res) => {
  const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: 'Carrito o producto no encontrado' });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});