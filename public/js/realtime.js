const socket = io();

const form = document.getElementById('product-form');
const productList = document.getElementById('product-list');

// Evento para crear producto desde formulario
form.addEventListener('submit', e => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(form));
  socket.emit('new-product', formData);
  form.reset();
});

// Socket para escuchar la lista actualizada de productos
socket.on('products', products => {
  productList.innerHTML = '';
  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `${product.title} - $${product.price}
      <button onclick="deleteProduct('${product.id}')">Eliminar</button>`;
    productList.appendChild(li);
  });
});

// Evento para eliminar producto
function deleteProduct(id) {
  socket.emit('delete-product', id);
}
