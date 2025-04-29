const fs = require('fs').promises;

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async _readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }

  async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async createCart() {
    const carts = await this._readFile();
    const newId = carts.length ? carts[carts.length - 1].id + 1 : 1;

    const newCart = { id: newId, products: [] };
    carts.push(newCart);
    await this._writeFile(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this._readFile();
    return carts.find(c => c.id === parseInt(id));
  }

  async addProductToCart(cid, pid) {
    const carts = await this._readFile();
    const cart = carts.find(c => c.id === parseInt(cid));

    if (!cart) return null;

    const existingProductIndex = cart.products.findIndex(p => p.product === pid);
    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await this._writeFile(carts);
    return cart;
  }
}

module.exports = CartManager;