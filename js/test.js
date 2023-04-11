fetch("./js/productos.json")
  .then((response) => response.json())
  .then((data) => {
    productos = data;
    localStorage.setItem("productos-catalogo", JSON.stringify(productos));
  });

let productosEnCatalogo = localStorage.getItem("productos-catalogo");
productosEnCatalogo = JSON.parse(productosEnCatalogo);

const contenedorProductos = document.querySelector("#contenedor-productos");

function cargarProductos() {
  const formHTML = `
    <div class="producto">
      <div class="producto-imagen">
        <form id="nuevo-producto-form">
        <h3>Agregar nuevo producto</h3>
        <div>
          <label for="imagen-input">Imagen:</label>
          <input type="file" accept="image/jpeg, image/png, image/jpg" id="imagen-input" name="imagen">
        </div>
      </div>
      <div class="producto-form">
        <div>
          <label for="titulo-input">Título:</label>
          <input type="text" id="titulo-input" name="titulo">
        </div>
        <div>
          <label for="precio-input">Precio:</label>
          <input type="number" id="precio-input" name="precio" step="0.01">
        </div>
        <div class="botonera">
          <button class="producto-nuevo" type="submit">Agregar</button>
        </div>
      </div>
      </form>
    </div>
  `;

  contenedorProductos.innerHTML = formHTML;

  const nuevoProductoForm = document.querySelector("#nuevo-producto-form");
  nuevoProductoForm.addEventListener("submit", agregarProducto);

  const imagenInput = document.querySelector("#imagen-input");
  const previewImagen = document.querySelector("#preview-imagen");

  imagenInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", function () {
      previewImagen.setAttribute("src", reader.result);
    });

    reader.readAsDataURL(file);
  });

  productosEnCatalogo.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
      <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
      <div class="producto-detalles">
        <h3 class="producto-titulo">${producto.titulo}</h3>
        <p class="producto-precio">$${producto.precio}</p>
        <div class="botonera">
          <button class="producto-editar" id="${producto.id}">Editar</button>
          <button class="producto-eliminar" id="${producto.id}">Eliminar</button>
        </div>
      </div>
    `;

    contenedorProductos.append(div);
  });

  actualizarBotonesEliminar();
}

function agregarProducto(e) {
  e.preventDefault();

  const nuevoProducto = {
    id: productosEnCatalogo.length + 1,
    titulo: e.target.titulo.value,
    precio: parseFloat(e.target.precio.value),
    imagen: document.querySelector("#preview-imagen").getAttribute("src"),
  };

  productosEnCatalogo.push(nuevoProducto);
  localStorage.setItem("productos-catalogo", JSON.stringify(productosEnCatalogo));

  cargarProductos();
}

cargarProductos();
