const fs = require('fs').promises;

class ProductManager {
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

  async addProduct(product) {
    const products = await this._readFile();
    const newId = products.length ? products[products.length - 1].id + 1 : 1;

    const newProduct = {
      id: newId,
      ...product
    };

    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
  }

  async getProducts() {
    return await this._readFile();
  }

  async getProductById(id) {
    const products = await this._readFile();
    return products.find(p => p.id === parseInt(id));
  }

  async updateProduct(id, updatedProduct) {
    const products = await this._readFile();
    const index = products.findIndex(p => p.id === parseInt(id));

    if (index !== -1) {
      products[index] = { ...products[index], ...updatedProduct };
      await this._writeFile(products);
      return products[index];
    }

    return null;
  }

  async deleteProduct(id) {
    const products = await this._readFile();
    const newProducts = products.filter(p => p.id !== parseInt(id));

    if (newProducts.length === products.length) {
      return null;
    }

    await this._writeFile(newProducts);
    return { id };
  }
}

module.exports = ProductManager;