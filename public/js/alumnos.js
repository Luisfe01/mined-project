window.onpageshow = function (event) {
    if (event.persisted) {
        window.location.reload();
    }
};

const url = (window.location.hostname.includes('localhost')) ? 'http://localhost:8080/api/' : 'https://mined-project-production.up.railway.app/api/'
let table;
let user = null;

$(document).ready(function() {
    table = $('#miTabla').DataTable({
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'  // Ruta del archivo de traducción en español
        },
        data: [],  // Inicialmente, no hay datos
        columns: [
            { title: "Seleccione un grado", data: null }
        ]
    });
});

const validarJWT = async () => {
    const token = localStorage.getItem('token') || ''

    if (token.length <= 10) {
        window.location = 'login.html'
        throw new Error('No hay token en el servidor')
    }

    const resp = await fetch(url + 'login', {
        headers: { "x-token": token }
    });

    const { docente, token: tokenDB } = await resp.json()

    //Renovar token
    localStorage.setItem('token', tokenDB)
    user = docente;
    $("#userName").html(docente.nombres)
    cargarDatos(docente);

}

const cargarDatos = async (docente) => {
    const resp = await fetch(url + 'cargos/' + docente.id, {
        headers: { "x-token": 'token' }
    });
    const { cargos } = await resp.json();

    cargos.forEach((cargo) => {
        select_test = `<option value="${cargo.grado_id}" data-id="${cargo.seccion_id}">${cargo.grado} "${cargo.seccion}"</option>`
        $('#grado').append(select_test)
        $('#gradoNuevo').append(select_test)
    })
    $('#grado').selectpicker('refresh')
    $('#gradoNuevo').selectpicker('refresh')
}

$("#grado").change(async () => {
    $("button[name=btn-resultados]").prop("disabled", false);
})

$("button[name=btn-resultados]").click(() => {

    const data = { institucion: user.institucion_id, grado: $("#grado").val(), seccion: $("#grado").find(':selected').data('id') }

    obtenerResultados(data)
})

const obtenerResultados = async (query) => {

    const resp = await fetch(url + 'alumnos?' + new URLSearchParams(query), {
        headers: { "x-token": localStorage.getItem('token') }
    });
    const { errors, alumnos } = await resp.json();
    // Tu array de objetos
    const datos = alumnos;

    if ($.fn.DataTable.isDataTable('#miTabla')) {
        table.destroy();
        table.clear()
        $("#miTabla").html("");
    }
    // Configuración de DataTables
    table = $("#miTabla").DataTable({
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'  // Ruta del archivo de traducción en español
        },
        data: datos,
        columns: [
            { data: 'id', title: 'ID.' },
            { data: 'nie', title: 'NIE' },
            { data: 'nombres', title: 'Nombres' },
            { data: 'apellidos', title: 'Apellidos' },
            { data: 'genero', title: 'Genero' },
            { data: 'fecha_nacimiento', title: 'Fecha de Nacimiento' },
            {data: "id" , render : (data) => {
                return `<a class="btn btn-secondary btn-block" href="#" data-toggle="modal" data-target="#alumnoModal" data-id="${data}">Editar</a>`
            }, title: 'Opciones'},
        ],
        // Puedes personalizar más opciones según la documentación de DataTables
    });
}

const registrar = () => {
    $("#btn-registro").prop("disabled", true)
    $("#errorAlert").prop("hidden", true).html('')
    const data = {
        _id: $("#iduser").val(),
        nie: $("#nie").val(),
        nombres: $("#nombres").val(),
        apellidos: $("#apellidos").val(),
        grado_id: $("#gradoNuevo").val(),
        genero: $("#genero").val(),
        seccion_id: $("#gradoNuevo").find(':selected').data('id'),
        fecha_nacimiento: $("#fecha_nacimiento").val(),
        institucion_id: user.institucion_id
    }

    fetch(url+'alumnos', {
        method: data._id > 0 ? 'PUT' : 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json',"x-token": localStorage.getItem('token')}
    })
    .then( resp => resp.json())
    .then( ({errors, alumno}) => {
        if (errors) {
            let errores = '';
            errors.forEach(element => {
                errores += `${element.msg}</br>`
            });
            $("#errorAlert").prop("hidden", false).html(errores)
            return;
        }
        $('#alumnoModal').modal('hide');
        const query = { institucion: user.institucion_id, grado: data.grado_id, seccion: data.seccion_id }
        
        $(`#grado [data-id=${alumno.seccion_id}][value=${alumno.grado_id}]`).prop("selected", true).selectpicker("refresh")
        $("#grado").selectpicker("refresh")
        $("button[name=btn-resultados]").prop("disabled", false);
        obtenerResultados(query)
    })
    .catch( err => {
        console.log(err);
    })
    .finally(() => {
        $("#btn-registro").prop("disabled", false)
    })
}

$('#alumnoModal').on('show.bs.modal', function (event) {
    let button = $(event.relatedTarget)
    let modal = $(this)

    $(".form-control-user").val('')
    // $("#gradoNuevo").val('').selectpicker("refresh")
    $("#genero").val('').selectpicker("refresh")
    //Si se mandan datos (click en editar) el modal cambiara
    if (button.data('id')) {
        modal.find('.modal-title').text('Editar Alumno')
        const id = button.data('id')

        fetch(url+'alumnos/'+id, {
            method: 'GET',
            headers: {'Content-Type': 'application/json',"x-token": localStorage.getItem('token')}
        })
        .then( resp => resp.json())
        .then( ({errors, alumno}) => {

            $("#iduser").val(id)
            $("#nie").val(alumno.nie)
            $("#nombres").val(alumno.nombres)
            $("#apellidos").val(alumno.apellidos)
            $("#genero").val(alumno.genero).selectpicker("refresh")
            $(`#gradoNuevo [data-id=${alumno.seccion_id}][value=${alumno.grado_id}]`).prop("selected", true).selectpicker("refresh")
            $("#gradoNuevo").selectpicker("refresh")
            $("#fecha_nacimiento").val(alumno.fecha_nacimiento)
        })
        .catch( err => {
            console.log(err);
        })


    } else {
        //Si no se mandan datos (click en +) el modal cambiara
        modal.find('.modal-title').text('Registrar nuevo alumno')
    }
    $("#errorAlert").prop("hidden", true).html('')
})

const main = async () => {
    // Validar JWT
    await validarJWT()

}

const salir = () => {
    localStorage.removeItem('token');
    window.location = 'login.html'
}

main()