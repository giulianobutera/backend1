const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

class CartManager {
  constructor(path) {
    this.path = path;
  }

  // Lee el archivo de carritos
  async _readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }

  // Escribe la lista de carritos en el archivo
  async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  // Crea un nuevo carrito vacío
  async createCart() {
    const carts = await this._readFile();
    const newId = uuidv4();
    const newCart = {id: newId, products: []};
    carts.push(newCart);
    await this._writeFile(carts);
    return newCart;
  }

  // Obtiene un carrito por su ID
  async getCartById(id) {
    const carts = await this._readFile();
    return carts.find(c => c.id === id);
  }

  // Agrega un producto a un carrito, si ya existe, aumenta la cantidad
  async addProductToCart(cid, pid) {
    const carts = await this._readFile();
    const cart = carts.find(c => c.id === cid);
    if (!cart) return null;
    const existingProductIndex = cart.products.findIndex(p => p.product === pid);
    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += 1;
    } else {
      cart.products.push({product: pid, quantity: 1});
    }
    await this._writeFile(carts);
    return cart;
  }
}

module.exports = CartManager;