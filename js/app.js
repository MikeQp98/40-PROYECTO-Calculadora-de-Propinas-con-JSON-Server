let cliente = {
    mesa: '',
    hora:'',
    pedido: []
};


const categorias = {
    1 : 'Comida', 
    2 : 'Bebidas',
    3 : 'Postres'
}

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente() {
    const mesa = document.querySelector('#mesa').value
    const hora = document.querySelector('#hora').value
    const camposVacios = [mesa, hora].some(campo => campo === '');

   //Esta seccion valida el Formulario
    if(camposVacios) {
        
        const existeAlerta = document.querySelector('.invalid-feedback');
        
        if(!existeAlerta) {
            const alerta = document.createElement('DIV');
            alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
            alerta.textContent = 'Todos los campos son obligatorios';
            document.querySelector('.modal-body form').appendChild(alerta);
      
            setTimeout(() => {
                alerta.remove();
            }, 3000);
            
        }
        return;
    }

     //Esta seccion almacena los datos obtenidos en el objeto
    cliente = {...cliente, mesa, hora}

     //Esta seccion oculta la ventana Modal
    const modalFormulario = document.querySelector('#formulario')
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBootstrap.hide();

    //Mostrar los productos
    mostrarSecciones();

    //Obtener los datos de la api
    obtenerPlatillos();

}

function mostrarSecciones(){
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'));
}

function obtenerPlatillos() {

    const url = ' http://localhost:4000/platillos'

    fetch(url) 
    .then(respuesta => respuesta.json())
     .then(resultado => mostrarPlatillos(resultado))
       .catch(error => console.log(error))
    
}

function mostrarPlatillos(platillos) {

    const contenido = document.querySelector('#platillos .contenido');

    platillos.forEach( platillo => {

        const row = document.createElement('DIV');
        row.classList.add('row', 'py-3', 'border-top');

        const nombre = document.createElement('DIV')
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre;

        const precio = document.createElement('DIV')
        precio.classList.add('col-md-3','fw-bold');
        precio.textContent = `$ ${platillo.precio}`

        const categoria = document.createElement('DIV');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[platillo.categoria];

        //Estructura y condiciones del Boton
        const inputCantidad = document.createElement('INPUT');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${platillo.id}`;
        inputCantidad.classList.add('form-control');


        inputCantidad.onchange = function () {
            const cantidad = parseInt(inputCantidad.value);
            console.log(cantidad);
            agregarPlatillo({...platillo, cantidad})
        }
        //Agregamos estilos y ubicamos el boton con estas lineas
        const agregar = document.createElement('DIV');
        agregar.classList.add('col-md-2')
        agregar.appendChild(inputCantidad)


        row.appendChild(nombre);
        row.appendChild(categoria);
        row.appendChild(precio);
        row.appendChild(agregar);

        contenido.appendChild(row);
    })

}

function agregarPlatillo(producto) {  
    //Extraer el pedido actual 
    let { pedido } = cliente;

    if(producto.cantidad > 0) {  
        
        if(pedido.some(articulo => articulo.id === producto.id)){
            const pedidoActualizado = pedido.map( articulo => {
                if (articulo.id === producto.id) {
                    articulo.cantidad = producto.cantidad;
                }
                return articulo;
            });
            cliente.pedido = [...pedidoActualizado];
        }else {
            cliente.pedido = [...pedido, producto];
        }
    } else {
        const resultado = pedido.filter(articulo => articulo.id !== producto.id);
        cliente.pedido = [...resultado];
    }

    actualizarResumen()

}

function actualizarResumen() {
    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-6');

    const mesa = document.createElement('P');
    mesa.textContent = 'Mesa: '
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('SPAN');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');

    const hora = document.createElement('P');
    hora.textContent = 'Hora: '
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('SPAN');
    horaSpan.textContent = cliente.mesa;
    horaSpan.classList.add('fw-normal');


    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);


    contenido.appendChild(mesa);
}