const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  // Lee el archivo y devuelve la lista de productos
  async _readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }

  // Escribe la lista de productos en el archivo
  async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  // Agrega un nuevo producto con ID único
  async addProduct(product) {
    const products = await this._readFile();
    const newId = uuidv4();
    const newProduct = {
      id: newId,
      ...product
    };

    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
  }

  // Devuelve todos los productos
  async getProducts() {
    return await this._readFile();
  }

  // Devuelve un producto por ID
  async getProductById(id) {
    const products = await this._readFile();
    return products.find(p => p.id === id);
  }

  // Actualiza un producto existente
  async updateProduct(id, updatedProduct) {
    const products = await this._readFile();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = {...products[index], ...updatedProduct};
      await this._writeFile(products);
      return products[index];
    }
    return null;
  }

  // Elimina un producto por ID
  async deleteProduct(id) {
    const products = await this._readFile();
    const newProducts = products.filter(p => p.id !== id);
    if (newProducts.length === products.length) {
      return null;
    }
    await this._writeFile(newProducts);
    return { id };
  }
}

module.exports = ProductManager;