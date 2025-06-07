const Cart = require('./models/cart');

class CartManager {
  // Crea un nuevo carrito vacío
  async createCart() {
    const newCart = new Cart({ products: [] });
    return await newCart.save();
  }

  // Obtiene un carrito por su ID
  async getCartById(id) {
    return await Cart.findById(id).populate('products.product');
  }

  // Agrega un producto a un carrito, si ya existe, aumenta la cantidad
  async addProductToCart(cid, pid) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    return await cart.save();
  }

  async removeProductFromCart(cid, pid) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;
    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    return await cart.save();
  }

  async updateCart(cid, productsArray) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;
    cart.products = productsArray;
    return await cart.save();
  }

  async updateProductQuantity(cid, pid, quantity) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;
    const product = cart.products.find(p => p.product.toString() === pid);
    if (!product) return null;
    product.quantity = quantity;
    return await cart.save();
  }

  async clearCart(cid) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;
    cart.products = [];
    return await cart.save();
  }
}

module.exports = CartManager;