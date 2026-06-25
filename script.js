const formulario = document.getElementById('miFormulario');
const btnUltimoDato = document.getElementById('btnUltimoDato');
const contenedorDatos = document.getElementById('contenedorDatos');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// EVENTO SUBMIT
formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre');
    const correo = document.getElementById('email');
    const artista = document.getElementById('artista');
    const mensaje = document.getElementById('mensaje');

    //limpiar errores
    document.querySelectorAll('.error').forEach(el => el.textContent = '');
    document.querySelectorAll('input, textarea').forEach(el => el.classList.remove('input-invalido'));

    let formularioValido = true;

    //validacion nombre
    if (nombre.value.trim() === ''){
        mostrarError(nombre, 'errorNombre', 'el nombre no puesde estar vacio');
        formularioValido = false;
    }

    //validacion correo
    if (email.value.trim() === ''){
        mostrarError(email, 'errorCorreo', 'el correo no puede estar vacio');
        formularioValido = false;
    } else if (!emailRegex.test(email.value.trim())){
        mostrarError(email, 'errorCorreo', 'el correo no es valido');
        formularioValido = false;
    }

    //validacion artista
    if (artista.value.trim() === ''){
        mostrarError(artista, 'errorArtista', 'el artista no puede estar vacio');
        formularioValido = false;
    }else if (artista.value.trim().length < 3){
        mostrarError(artista, 'errorArtista', 'el artista debe tener al menos 3 caracteres');
        formularioValido = false;
    }

    //validacion mensaje
    if (mensaje.value.trim() === ''){
        mostrarError(mensaje, 'errorMensaje', 'el mensaje no puede estar vacio');
        formularioValido = false;
    } else if (mensaje.value.trim().length < 10){
        mostrarError(mensaje, 'errorMensaje', 'el mensaje debe tener al menos 10 caracteres');
        formularioValido = false;
    }

    //si tofo el valido se envia al fetch
    if (formularioValido){
        const datos = {
            nombre: nombre.value.trim(),
            correo: email.value.trim(),
            artista_favorito: artista.value.trim(),
            mensaje: mensaje.value.trim()
        };

        try {
            const response = await fetch('http://localhost:3000/api/guardar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            if (response.ok) {
                alert('Datos guardados con éxito en la base de datos');
                formulario.reset();
            } else {
                alert('Hubo un error al guardar en el servidor');
            }
        } catch (error) {
            console.error('Error de conexion:', error);
            alert('No se pudo conectar con el servidor');
        }
    }
});

function mostrarError(inputElement, spanId, textoError) {
    inputElement.classList.add('input-invalido');
    document.getElementById(spanId).textContent = textoError;
}

//EVENTO CLICK
btnUltimoDato.addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:3000/api/cargar');
        
        if (response.ok) {
            const data = await response.json();

            while (contenedorDatos.firstChild) {
                contenedorDatos.removeChild(contenedorDatos.firstChild);
            }

            const titulo = document.createElement('h4');
            titulo.textContent = 'datos recuperados:';

            const parrafoNombre = document.createElement('p');
            parrafoNombre.innerHTML = `<strong>Nombre:</strong> ${data.nombre}`;

            const parrafoEmail = document.createElement('p');
            parrafoEmail.innerHTML = `<strong>Correo:</strong> ${data.email}`;

            const parrafoArtista = document.createElement('p');
            parrafoArtista.innerHTML = `<strong>Artista Favorito:</strong> ${data.artista_favorito}`;

            const parrafoMensaje = document.createElement('p');
            parrafoMensaje.innerHTML = `<strong>Mensaje:</strong> ${data.mensaje}`;

            const contenedorTemporal = document.createElement('div');
            contenedorTemporal.append(titulo, parrafoNombre, parrafoEmail, parrafoArtista, parrafoMensaje);

            contenedorDatos.appendChild(contenedorTemporal);

        } else {
            alert('No hay datos registrados aun.');
        }
    } catch (error) {
        console.error('Error al cargar:', error);
    }
});

//EVENTO INPUT
document.querySelectorAll('input, textarea').forEach(campo => {
    campo.addEventListener('input', () => {
        campo.classList.remove('input-invalido');

        if(campo.nextElementSibling && campo.nextElementSibling.classList.contains('error')){
            campo.nextElementSibling.textContent = '';
        }
    });
});