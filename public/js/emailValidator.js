// Módulo para validación de emails
class EmailValidator {
  constructor() {
    this.isValidating = false;
  }

  // Validación local como respaldo comentada para no usarla hasta que funcione la API externa
  /*  validarEmailLocal(email) {
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const dominiosValidos = [
      'gmail.com',
      'hotmail.com',
      'outlook.com',
      'yahoo.com',
      'yahoo.es',
      'icloud.com',
      'live.com',
      'msn.com',
      'protonmail.com',
      'tutanota.com',
    ];

    const formatoValido = regexEmail.test(email);

    if (!formatoValido) {
      return {
        esValido: false,
        razon: 'Formato de email inválido',
      };
    }

    const dominio = email.split('@')[1]?.toLowerCase();
    const dominioConocido = dominiosValidos.includes(dominio);

    return {
      esValido: true,
      razon: dominioConocido
        ? 'Email válido (dominio conocido)'
        : 'Email válido (formato correcto)',
    };
  } */

  // Validación con API a través del servidor
  async validarEmailConAPI(email) {
    try {
      console.log('Validando email con API:', email);

      const response = await fetch('/api/validate-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const resultado = await response.json();
      console.log('Resultado de validación:', resultado);

      return resultado;
    } catch (error) {
      console.error('Error en validación con API:', error);

      // Usar validación local como respaldo
      console.log('Usando validación local como respaldo');
      const validacionLocal = this.validarEmailLocal(email);

      return {
        esValido: validacionLocal.esValido,
        informacion: null,
        razon: `${validacionLocal.razon} (API no disponible)`,
      };
    }
  }

  // Validar email individual con manejo de UI
  async validarEmailIndividual(usuarios, idUsuario, callbacks) {
    if (this.isValidating) return;

    const usuario = usuarios.find((u) => u.id === idUsuario);
    if (!usuario) {
      callbacks.onError('Usuario no encontrado');
      return;
    }

    const boton = document.getElementById(`validate-${idUsuario}`);
    if (!boton) {
      callbacks.onError('Botón no encontrado');
      return;
    }

    this.isValidating = true;

    // Actualizar UI del botón
    boton.disabled = true;
    boton.textContent = 'Validando...';
    boton.style.backgroundColor = '#cbd0d5ff';

    try {
      const resultado = await this.validarEmailConAPI(usuario.email);

      // Actualizar el usuario con el resultado
      usuario.emailValido = resultado.esValido;
      usuario.razonValidacion = resultado.razon;

      // Guardar cambios
      callbacks.onSuccess(usuario, resultado);
    } catch (error) {
      console.error('Error en validación:', error);
      callbacks.onError(`Error validando email de ${usuario.nombre}`);

      // Rehabilitar botón en caso de error
      boton.disabled = false;
      boton.textContent =
        usuario.emailValido === null ? 'Validar Email' : 'Revalidar Email';
      boton.style.backgroundColor = '';
    } finally {
      this.isValidating = false;
    }
  }
}

// Exportar para uso en otros módulos
window.EmailValidator = EmailValidator;
/*  hace que la clase EmailValidator quede disponible 
globalmente en el navegador, sin necesidad de usar import en otros archivos como script.js.

Importante!! Al hacerlo con window. no es necesario exportar la clase EmailValidator en script.js, ni especificar
en html <script type="module" src="./js/EmailValidator.js"></script>*/
