function registrarUsuario() {
  // Obtener los valores ingresados por el usuario
  const usuario = document.getElementById("usuario").value;
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;
  const rol = document.getElementById("rol").value; // Obtener el valor seleccionado del campo de rol

  // Obtener los usuarios registrados desde el almacenamiento local
  const usuariosRegistrados =
    JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];

  // Verificar si el nombre de usuario ya está en uso
  const usuarioExistente = usuariosRegistrados.find(
    (usuarioRegistrado) => usuarioRegistrado.usuario === usuario
  );

  if (usuarioExistente) {
    alert("El nombre de usuario ya está en uso. Por favor, seleccione otro.");
    return;
  }

  // Crear un nuevo objeto de usuario con los valores ingresados
  const nuevoUsuario = {
    usuario: usuario,
    password: password,
    email: email,
    rol: rol, // Agregar el campo de "rol" al objeto de usuario
  };

  // Agregar el nuevo usuario al array de usuarios registrados
  usuariosRegistrados.push(nuevoUsuario);

  // Actualizar el almacenamiento local con el array de usuarios actualizado
  localStorage.setItem(
    "usuariosRegistrados",
    JSON.stringify(usuariosRegistrados)
  );

  // Limpiar los campos del formulario
  document.getElementById("usuario").value = "";
  document.getElementById("password").value = "";
  document.getElementById("email").value = "";
  document.getElementById("rol").value = "";

  // Redirigir al usuario a la página de inicio de sesión
  window.location.href = "login.html";

  // Mostrar un mensaje de éxito al usuario
  alert(
    "Usuario registrado exitosamente. Serás redirigido a la página de inicio de sesión."
  );
}
