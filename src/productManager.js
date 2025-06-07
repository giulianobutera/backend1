const Product = require('./models/product');

class ProductManager {
  // Devuelve todos los productos paginados y con query
  async getProducts() {
    return await Product.find();
  }

  async getPaginatedProducts({ limit = 10, page = 1, sort, query }) {
    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);

    const filter = {};
    if (query) {
      if (['available', 'not available'].includes(query)) {
        filter.status = query;
      } else {
        filter.category = query;
      }
    }

    const sortOption = {};
    if (sort === 'asc') sortOption.price = 1;
    if (sort === 'desc') sortOption.price = -1;

    const skip = (parsedPage - 1) * parsedLimit;

    const [products, totalDocs] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(parsedLimit),
      Product.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalDocs / parsedLimit);
    const hasPrevPage = parsedPage > 1;
    const hasNextPage = parsedPage < totalPages;

    return {
      status: 'success',
      payload: products,
      totalPages,
      prevPage: hasPrevPage ? parsedPage - 1 : null,
      nextPage: hasNextPage ? parsedPage + 1 : null,
      page: parsedPage,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage ? `/api/products?page=${parsedPage - 1}&limit=${parsedLimit}` : null,
      nextLink: hasNextPage ? `/api/products?page=${parsedPage + 1}&limit=${parsedLimit}` : null
    };
  }

  // Devuelve un producto por ID
  async getProductById(id) {
    return await Product.findById(id);
  }

  // Agrega un nuevo producto con ID único
  async addProduct(productData) {
    const newProduct = new Product(productData);
    return await newProduct.save();
  }

  // Actualiza un producto existente
  async updateProduct(id, updatedFields) {
    return await Product.findByIdAndUpdate(id, updatedFields, { new: true });
  }

  // Elimina un producto por ID
  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }
}

module.exports = ProductManager;