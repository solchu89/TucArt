fetch("./js/productos.json")
  .then((response) => response.json())
  .then((data) => {
    productos = data;
    localStorage.setItem("productos-catalogo", JSON.stringify(productos));
  });

let productosEnCatalogo = localStorage.getItem("productos-catalogo");
productosEnCatalogo = productosEnCatalogo
  ? JSON.parse(productosEnCatalogo)
  : [];

const contenedorProductos = document.querySelector("#contenedor-productos");

function cargarProductos() {
  const formHTML = `
  <form id="nuevo-producto-form">
  <div>
  <div class="producto-bg">
      <h2>Nuevo producto</h2>
      <div>
        <label for="titulo-input">Título:</label>
        <input type="text" id="titulo-input" name="titulo">
      </div>
      <div>
        <label for="precio-input">Precio:</label>
        <input type="number" id="precio-input" name="precio" step="1">
      </div>
      <div>
        <label for="precio-input">Categ.:</label>
        <select name="categoria" id="categoria-input">
          <option value="0" selected="selected" disabled="disabled">Selecciona Categoria</option>
          <option value="1">Arte Digital - Prints</option>
          <option value="2">Pinturas</option>
          <option value="3">Fotografias</option>
        </select>
      </div>
      <div>
        <label for="imagen-input">Imagen:</label>
        <input type="file" accept="image/jpeg, image/png, image/jpg" id="imagen-input" name="imagen">
        <img id="preview-imagen" class="producto-imagen" src="" alt="Preview">
      </div>
      </div>
      <div class="producto-form">
      <h3>Agregar</h3>
          <button class="producto-nuevo" type="submit">+</button>
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
      document.querySelector(".producto-bg").style.backgroundImage = `url(${reader.result})`;
      document.querySelector(".producto-bg").style.backgroundSize = "cover"; // Set the object-fit property to "cover"
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
  actualizarBotonesEditar();
}

function agregarProducto(e) {
  e.preventDefault();

  const nuevoProducto = {
    id: crypto.randomUUID(),
    titulo: e.target.titulo.value,
    precio: parseFloat(e.target.precio.value),
    imagen: document.querySelector("#preview-imagen").getAttribute("src"),
    categoria: {
      nombre: e.target.categoria.value,
      id: e.target.categoria.value,
    },
  };

  productosEnCatalogo.push(nuevoProducto);
  localStorage.setItem(
    "productos-catalogo",
    JSON.stringify(productosEnCatalogo)
  );
  cargarProductos();
}

function actualizarBotonesEliminar() {
  botonesEliminar = document.querySelectorAll(".producto-eliminar");

  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", eliminarDelCatalogo);
  });
}

function eliminarDelCatalogo(e) {
  Toastify({
    text: "Producto eliminado",
    duration: 3000,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #4b33a8, #785ce9)",
      borderRadius: "2rem",
      textTransform: "uppercase",
      fontSize: ".75rem",
    },
    offset: {
      x: "1.5rem", // horizontal axis - can be a number or a string indicating unity. eg: '2em'
      y: "1.5rem", // vertical axis - can be a number or a string indicating unity. eg: '2em'
    },
    onClick: function () {}, // Callback after click
  }).showToast();

  const idBoton = e.currentTarget.id;
  const index = productosEnCatalogo.findIndex(
    (producto) => producto.id === idBoton
  );

  productosEnCatalogo.splice(index, 1);
  localStorage.setItem(
    "productos-catalogo",
    JSON.stringify(productosEnCatalogo)
  );
  cargarProductos();
}

function editarProducto(id) {
  const productoEditado = productosEnCatalogo.find(
    (producto) => producto.id === id
  );

  const formHTML = `
    <form id="editar-producto-form">
      <div>
        <div class="producto-bg">
          <h2>Editar producto</h2>
          <div>
            <label for="titulo-input">Título:</label>
            <input type="text" id="titulo-input" name="titulo" value="${productoEditado.titulo}">
          </div>
          <div>
            <label for="precio-input">Precio:</label>
            <input type="number" id="precio-input" name="precio" step="0.01" value="${productoEditado.precio}">
          </div>
          <div>
            <label for="precio-input">Categ.:</label>
            <input type="text" id="catergoria-input" name="categoria" value="${productoEditado.categoria.nombre}">
          </div>
          <div>
            <label for="imagen-input">Imagen:</label>
            <input type="file" accept="image/jpeg, image/png, image/jpg" id="imagen-input" name="imagen">
            <img id="preview-imagen" class="producto-imagen" src="${productoEditado.imagen}" alt="Preview">
          </div>
        </div>
        <div class="producto-form">
          <h3>Guardar cambios</h3>
          <button class="producto-agregar" type="submit">Guardar</button>
        </div>
      </div>
    </form>
  `;

  contenedorProductos.innerHTML = formHTML;

  const editarProductoForm = document.querySelector("#editar-producto-form");
  editarProductoForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const productoEditado = {
      id: id,
      titulo: e.target.titulo.value,
      precio: parseFloat(e.target.precio.value),
      imagen: document.querySelector("#preview-imagen").getAttribute("src"),
      categoria: {
        nombre: e.target.categoria.value,
        id: e.target.categoria.value,
      },
    };

    const index = productosEnCatalogo.findIndex(
      (producto) => producto.id === id
    );
    productosEnCatalogo[index] = productoEditado;

    localStorage.setItem(
      "productos-catalogo",
      JSON.stringify(productosEnCatalogo)
    );
    cargarProductos();
  });

  const imagenInput = document.querySelector("#imagen-input");
  const previewImagen = document.querySelector("#preview-imagen");

  imagenInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", function () {
      previewImagen.setAttribute("src", reader.result);
      document.querySelector(
        ".producto-bg"
      ).style.backgroundImage = `url(${reader.result})`;
      document.querySelector(".producto-bg").style.backgroundSize = "cover"; // Set the object-fit property to "cover"
    });

    reader.readAsDataURL(file);
  });
}

function actualizarBotonesEditar() {
  const botonesEditar = document.querySelectorAll(".producto-editar");

  botonesEditar.forEach((boton) => {
    boton.addEventListener("click", function (e) {
      const idBoton = e.currentTarget.id;
      editarProducto(idBoton);
    });
  });
}

cargarProductos();
