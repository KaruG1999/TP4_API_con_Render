// Base de datos simulada
let usuarios = [
  { id: 1, nombre: 'Juan', edad: 25, email: 'juan@hotmail.com' },
  { id: 2, nombre: 'Ana', edad: 30, email: 'ana@gmail.com' },
];

// Referencias DOM
const formulario = document.getElementById('userForm');
const contenedorUsuarios = document.getElementById('usersContainer');
const mensajeBienvenida = document.getElementById('welcomeMessage');


// Instancia del validador de emails
const emailValidator = new EmailValidator();

// Inicialización
document.addEventListener('DOMContentLoaded', function () {
  cargarUsuariosDeStorage();
  cargarMensajeBienvenida();
  mostrarUsuarios();
});

// Evento del formulario
formulario.addEventListener('submit', function (event) {
  event.preventDefault();

  const datosFormulario = new FormData(formulario);

  if (!validarDatosFormulario(datosFormulario)) {
    return;
  }

  const objetoUsuario = convertirFormDataAObjetoUsuario(datosFormulario);
  agregarUsuarioAlArray(objetoUsuario);
  guardarUsuariosEnStorage();
  guardarPreferenciaUsuario(datosFormulario.get('favoriteColor'));
  mostrarUsuarios();
  formulario.reset();

  mostrarMensajeExito('Usuario agregado correctamente');
});

// Función para validar email individual (usa el módulo EmailValidator)
async function validarEmailIndividual(idUsuario) {
  await emailValidator.validarEmailIndividual(usuarios, idUsuario, {
    onSuccess: (usuario, resultado) => {
      guardarUsuariosEnStorage();
      mostrarUsuarios();

      if (resultado.esValido === true) {
        mostrarMensajeExito(
          `Email de ${usuario.nombre} validado correctamente`
        );
      } else if (resultado.esValido === false) {
        mostrarMensajeError(
          `Email de ${usuario.nombre} es inválido: ${resultado.razon}`
        );
      } else {
        mostrarMensajeError(
          `Error validando email de ${usuario.nombre}: ${resultado.razon}`
        );
      }
    },
    onError: (mensaje) => {
      mostrarMensajeError(mensaje);
    },
  });
}

// Funciones de Storage
function guardarUsuariosEnStorage() {
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

function cargarUsuariosDeStorage() {
  const datosGuardados = localStorage.getItem('usuarios');
  if (datosGuardados) {
    usuarios = JSON.parse(datosGuardados);
  }
}

// Validación del formulario
function validarDatosFormulario(datosFormulario) {
  const nombre = datosFormulario.get('userName').trim();
  const email = datosFormulario.get('userEmail').trim();
  const edad = parseInt(datosFormulario.get('userAge'));

  if (nombre === '') {
    mostrarMensajeError('El nombre no puede estar vacío');
    return false;
  }

  if (!email.includes('@')) {
    mostrarMensajeError('El email debe contener un "@"');
    return false;
  }

  if (isNaN(edad) || edad <= 0) {
    mostrarMensajeError('La edad debe ser un número mayor a 0');
    return false;
  }

  return true;
}

// Convertir FormData a objeto usuario
function convertirFormDataAObjetoUsuario(datosFormulario) {
  return {
    id: generarNuevoId(),
    nombre: datosFormulario.get('userName').trim(),
    edad: parseInt(datosFormulario.get('userAge')),
    email: datosFormulario.get('userEmail').trim(),
    emailValido: null,
  };
}

// Generar nuevo ID
function generarNuevoId() {
  return usuarios.length > 0 ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1;
}

// Agregar usuario al array
function agregarUsuarioAlArray(objetoUsuario) {
  usuarios.push(objetoUsuario);
}

// Reordenar IDs
function reordenarIds() {
  usuarios.forEach((usuario, indice) => {
    usuario.id = indice + 1;
  });
}

// Eliminar usuario
function eliminarUsuario(idUsuario) {
  const confirmacion = window.confirm(
    '¿Estás seguro de que querés eliminar este usuario?'
  );

  if (!confirmacion) return;

  const indiceUsuario = usuarios.findIndex(
    (usuario) => usuario.id === idUsuario
  );

  if (indiceUsuario !== -1) {
    usuarios.splice(indiceUsuario, 1);
    reordenarIds();
    guardarUsuariosEnStorage();
    mostrarUsuarios();
    mostrarMensajeExito('Usuario eliminado correctamente');
  } else {
    mostrarMensajeError('Usuario no encontrado');
  }
}

// Mostrar usuarios
function mostrarUsuarios() {
  contenedorUsuarios.innerHTML = '';

  if (usuarios.length === 0) {
    contenedorUsuarios.innerHTML =
      '<div class="empty-state">No hay usuarios registrados</div>';
    return;
  }

  usuarios.forEach(function (usuario) {
    const userCard = document.createElement('div');
    userCard.className = 'user-card';

    let cardContent = `
      <div class="user-id">ID: ${usuario.id}</div>
      <div class="user-name">${usuario.nombre}</div>
      <div class="user-details">
        <div>Edad: ${usuario.edad} años</div>
        <div>Email: ${usuario.email}</div>
      </div>
    `;

    // Agregar información de validación si existe
    if (usuario.emailValido !== null) {
      const estadoEmail = usuario.emailValido
        ? '<span style="color: #85da85ff;">✓ Email válido</span>'
        : '<span style="color: #e53042ff;">✗ Email inválido</span>';

      let razonTexto = '';
      if (usuario.razonValidacion) {
        razonTexto = `<small style="color: #1f1e1eff;"> (${usuario.razonValidacion})</small>`;
      }

      cardContent += `<div class="email-status">${estadoEmail}${razonTexto}</div>`;
    }

    // Botón de validar
    const botonValidarTexto =
      usuario.emailValido === null ? 'Validar Email' : 'Revalidar Email';
    const botonValidarId = `validate-${usuario.id}`;
    cardContent += `<button id="${botonValidarId}" class="btn-validate" onclick="validarEmailIndividual(${usuario.id})">${botonValidarTexto}</button>`;

    // Botón de eliminar
    cardContent += `<button class="btn-delete" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>`;

    userCard.innerHTML = cardContent;
    contenedorUsuarios.appendChild(userCard);
  });
}

// Funciones para color favorito
function guardarPreferenciaUsuario(colorFavorito) {
  if (colorFavorito && colorFavorito.trim() !== '') {
    localStorage.setItem('favoriteColor', colorFavorito);
    actualizarMensajeBienvenida();
  }
}

function convertirColorAValido(colorInput) {
  const coloresValidos = {
    rojo: '#FF0000',
    azul: '#0000FF',
    verde: '#008000',
    amarillo: '#FFFF00',
    naranja: '#FFA500',
    violeta: '#8A2BE2',
    rosa: '#FFC0CB',
    negro: '#000000',
    blanco: '#FFFFFF',
    gris: '#808080',
    morado: '#800080',
    cyan: '#00FFFF',
    magenta: '#FF00FF',
    lima: '#00FF00',
    marrón: '#A52A2A',
    celeste: '#87CEEB',
  };

  const colorLower = colorInput.toLowerCase().trim();

  if (coloresValidos[colorLower]) {
    return coloresValidos[colorLower];
  }

  if (/^#[0-9A-F]{6}$/i.test(colorInput)) {
    return colorInput;
  }

  if (colorInput.startsWith('rgb') || colorInput.startsWith('hsl')) {
    return colorInput;
  }

  return '#333333';
}

function cargarMensajeBienvenida() {
  const colorGuardado = localStorage.getItem('favoriteColor');
  if (colorGuardado) {
    const colorValido = convertirColorAValido(colorGuardado);
    mensajeBienvenida.textContent = `¡Hola! Tu color favorito es: ${colorGuardado}`;
    mensajeBienvenida.style.color = colorValido;
    mensajeBienvenida.style.fontWeight = 'bold';
  } else {
    mensajeBienvenida.textContent = '¡Bienvenido! Agrega tu primer usuario';
    mensajeBienvenida.style.color = '';
    mensajeBienvenida.style.fontWeight = '';
  }
}

function actualizarMensajeBienvenida() {
  const colorGuardado = localStorage.getItem('favoriteColor');
  if (colorGuardado) {
    const colorValido = convertirColorAValido(colorGuardado);
    mensajeBienvenida.textContent = `¡Hola! Tu color favorito es: ${colorGuardado}`;
    mensajeBienvenida.style.color = colorValido;
    mensajeBienvenida.style.fontWeight = 'bold';
    mensajeBienvenida.style.border = `2px solid ${colorValido}`;
    mensajeBienvenida.style.borderRadius = '5px';
    mensajeBienvenida.style.padding = '10px';
    mensajeBienvenida.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
  }
}

// Mensajes de error y éxito
function mostrarMensajeError(mensaje) {
  let divError = document.getElementById('errorMessage');
  if (!divError) {
    divError = document.createElement('div');
    divError.id = 'errorMessage';
    divError.classList.add('error-message');
    formulario.insertBefore(divError, formulario.firstChild);
  }

  divError.textContent = mensaje;
  divError.style.display = 'block';

  setTimeout(() => {
    divError.style.display = 'none';
  }, 3000);
}

function mostrarMensajeExito(mensaje) {
  let divExito = document.getElementById('successMessage');
  if (!divExito) {
    divExito = document.createElement('div');
    divExito.id = 'successMessage';
    divExito.classList.add('success-message');
    formulario.insertBefore(divExito, formulario.firstChild);
  }

  divExito.textContent = mensaje;
  divExito.style.display = 'block';

  setTimeout(() => {
    divExito.style.display = 'none';
  }, 3000);
}
