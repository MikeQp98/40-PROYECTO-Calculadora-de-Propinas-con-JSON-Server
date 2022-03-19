let cliente = {
    mesa: '',
    hora:'',
    pedido: []
};

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

    mostrarSecciones();

}

function mostrarSecciones(){
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'));
}