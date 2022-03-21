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

    limpiarHTML();

    if (cliente.pedido.length) {
        actualizarResumen();
    } else {
        mensajePedidoVacio();
    }

   

}

function actualizarResumen() {
    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-6', 'card' , 'py-2', 'px-3', 'shadow');

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
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');


    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    //Titulo de la seccion de Platillos Consumidos
    const heading = document.createElement('H3');
    heading.textContent = "Platillos Consumidos";
    heading.classList.add('my-4', 'text-center');

    //Iterar sobre el Array de Pedidos
    const grupo = document.createElement('UL');
    grupo.classList.add('list-group');

    const { pedido } = cliente;
    pedido.forEach( articulo => {
        const {nombre, cantidad, precio, id } = articulo

        const lista = document.createElement('LI');
        lista.classList.add('list-group-item');

        const nombreEl = document.createElement('H4');
        nombreEl.classList.add('my-4');
        nombreEl.textContent = nombre;

        const cantidadEl = document.createElement('P');
        cantidadEl.classList.add('fw-bold');
        cantidadEl.textContent = 'Cantidad:';
        
        const cantidadValor = document.createElement('SPAN')
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;

        const precioEL = document.createElement('P');
        precioEL.classList.add('fw-bold');
        precioEL.textContent = 'Precio:';
        
        const precioValor = document.createElement('SPAN')
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$${precio}`;

        const subtotalEL = document.createElement('P');
        subtotalEL.classList.add('fw-bold');
        subtotalEL.textContent = 'Subtotal:';
    
        const subtotalValor = document.createElement('SPAN')
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = calcularSubtotal(precio, cantidad);

        const btnEliminar = document.createElement('BUTTON');
        btnEliminar.classList.add('btn' , 'btn-danger');
        btnEliminar.textContent = 'Eliminar'

        //Funcion para Eliminar Pedido

        btnEliminar.onclick = function () {
            eliminarProducto(id)
        }



        cantidadEl.appendChild(cantidadValor);
        precioEL.appendChild(precioValor);
        subtotalEL.appendChild(subtotalValor);

        //Agregar Elementos al LI
        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEL);
        lista.appendChild(subtotalEL);
        lista.appendChild(btnEliminar);
        
        //Agregar lista al grupo principal
        grupo.appendChild(lista);
    })
    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);

    //Mostrar Formulario de Propinas
    formularioPropinas();
    
}

function limpiarHTML() {
    const contenido = document.querySelector('#resumen .contenido')

    while ( contenido.firstChild ) {
          contenido.removeChild(contenido.firstChild)
    }
}

function calcularSubtotal(precio, cantidad) {
   return `$ ${precio * cantidad}`
}

function eliminarProducto(id) {
     
         const {pedido} = cliente;
         const resultado = pedido.filter(articulo => articulo.id !== id);
        cliente.pedido = [...resultado];
    

    limpiarHTML();
    
    if (cliente.pedido.length) {
        actualizarResumen();
    } else {
        mensajePedidoVacio();
    }

    //Regresar la cantidad a 0 en el formulario

    const productoEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value = 0;
}


function mensajePedidoVacio() {

    const contenido = document.querySelector('#resumen .contenido');
    
    const texto = document.createElement('P');
    texto.classList.add('text-center');
    texto.textContent = 'Añade los Elementos del pedido';

    contenido.appendChild(texto);
    
}

function formularioPropinas() {
    
    const contenido = document.querySelector('#resumen .contenido')

    const formulario = document.createElement('DIV');
    formulario.classList.add('col-md-6', 'formulario')

    const divFormulario = document.createElement('DIV');
    divFormulario.classList.add('card', 'py-2', 'px-3', 'shadow');

    const heading = document.createElement('H3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Propina'

    //propinas 10%
    const radio10 = document.createElement('INPUT');
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = "10";
    radio10.classList.add('form.check-input');
    radio10.onclick = calcularPropina;
   

    const radio10Label = document.createElement('DIV');
    radio10Label.textContent = '10%';
    radio10Label.classList.add('form-check-label');

    const radio10Div = document.createElement('DIV');
    radio10Div.classList.add('form-check');

    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);

    //propinas 20%
    const radio20 = document.createElement('INPUT');
    radio20.type = 'radio';
    radio20.name = 'propina';
    radio20.value = "20";
    radio20.classList.add('form.check-input');
    radio20.onclick = calcularPropina;

    const radio20Label = document.createElement('DIV');
    radio20Label.textContent = '20%';
    radio20Label.classList.add('form-check-label');

    const radio20Div = document.createElement('DIV');
    radio20Div.classList.add('form-check');

    radio20Div.appendChild(radio20);
    radio20Div.appendChild(radio20Label);

     //propinas 50%
     const radio50 = document.createElement('INPUT');
     radio50.type = 'radio';
     radio50.name = 'propina';
     radio50.value = "50";
     radio50.classList.add('form.check-input');
     radio50.onclick = calcularPropina;
 
     const radio50Label = document.createElement('DIV');
     radio50Label.textContent = '50%';
     radio50Label.classList.add('form-check-label');
 
     const radio50Div = document.createElement('DIV');
     radio50Div.classList.add('form-check');
 
     radio50Div.appendChild(radio50);
     radio50Div.appendChild(radio50Label);

    divFormulario.appendChild(heading)
   //Agregarlo al Div Principal
    divFormulario.appendChild(radio10Div);
    divFormulario.appendChild(radio20Div);
    divFormulario.appendChild(radio50Div);
    formulario.appendChild(divFormulario);

    //Agregar al formulario
    contenido.appendChild(formulario)
}

function calcularPropina() {
    const { pedido } = cliente;
    let subtotal = 0;

    //Calcular el subtotal a pagar

    pedido.forEach( articulo => {
        subtotal += articulo.cantidad * articulo.precio;
    });

    //Colocar como variable los botones donde se selecciona los %  de la propina
    const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value;

    const propina = ((subtotal * parseInt(propinaSeleccionada)) /100);

    const total = subtotal + propina;

    mostrarTotalHTML(subtotal, total, propina);    

}

function mostrarTotalHTML (subtotal, total, propina) {

    const divTotales = document.createElement('DIV');
    divTotales.classList.add('total-pagar');

    //SubTotal 
    const subtotalParrafo = document.createElement('P');
    subtotalParrafo.classList.add('fs-3', 'fw-bold', 'mt-5');
    subtotalParrafo.textContent = 'SubTotal Consumo: ';

    const subtotalSpan = document.createElement('SPAN');
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent = `$${subtotal}`;

    subtotalParrafo.appendChild(subtotalSpan);

      //Propina 
      const propinaParrafo = document.createElement('P');
      propinaParrafo.classList.add('fs-3', 'fw-bold', 'mt-5');
      propinaParrafo.textContent = 'Propina a Pagar: ';
  
      const propinaSpan = document.createElement('SPAN');
      propinaSpan.classList.add('fw-normal');
      propinaSpan.textContent = `$${propina}`;
  
     










    subtotalParrafo.appendChild(subtotalSpan);
    propinaParrafo.appendChild(propinaSpan);

    divTotales.appendChild(subtotalParrafo);
    divTotales.appendChild(propinaParrafo);

    const formulario = document.querySelector('.formulario > div ');
    formulario.appendChild(divTotales);
}