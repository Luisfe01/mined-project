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
            { title: "Seleccione un reporte para mostrar", data: null }
        ]
    });
});

const validarJWT = async () => {
    const token = localStorage.getItem('token') || ''

    if (token.length <= 10) {
        window.location = 'index.html'
        throw new Error('No hay token en el servidor')
    }

    const resp = await fetch(url + 'login', {
        headers: { "x-token": token }
    });

    const { docente, token: tokenDB } = await resp.json()

    //Renovar token
    localStorage.setItem('token', tokenDB)

    $("#userName").html(docente.nombres)
    user = docente;
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
    })
    $('#grado').selectpicker('refresh')
}

$("#grado").change(async () => {
    const id = $("#grado").val()
    const seccion = $("#grado").find(':selected').data('id');
    const resp = await fetch(url + 'alumnos?grado=' + id+'&seccion='+seccion+'&institucion='+user.institucion_id, {
        headers: { "x-token": localStorage.getItem('token') }
    });
    const { alumnos } = await resp.json();
    
    $("#evaluacion").html('').selectpicker("refresh");
    let select_test = ''
    alumnos.forEach(test => {
        select_test = `<option value="${test.id}">${test.nombres} ${test.apellidos}</option>`
        $("#evaluacion").append(select_test)
    });
    $("#evaluacion").selectpicker({ title: 'Seleccione un alumno' }).selectpicker('refresh')

    // if (tests[0].id === 1) {
    //     $("button[name=btn-resultados]").prop("disabled", false);
    //     $("button[name=btn-pdf]").prop("disabled", false);
    // }
})

$("#evaluacion").change(() => {
    $("button[name=btn-resultados]").prop("disabled", false);
    $("button[name=btn-pdf]").prop("disabled", false);
})

$("button[name=btn-resultados]").click(() => {

    const data = { test_id: $("#evaluacion").val(), grado_id: $("#grado").val(), seccion_id: $("#grado").find(':selected').data('id'), institucion_id: user.institucion_id }

    if (data.test_id === '') {
        Swal.fire({
            title: 'Error',
            text: `Seleccione una evaluacion para poder continuar`,
            icon: 'error',
            confirmButtonText: 'Aceptar'
        })
        return;
    }

    obtenerResultados(data)
})

const getQuery = () => {
    return { alumno: $("#evaluacion").val(), grado_id: $("#grado").val(), seccion_id: $("#grado").find(':selected').data('id'), institucion_id: user.institucion_id }
}

$("button[name=btn-pdf]").click(() => {
    // 

    window.open(url + 'evaluaciones/resultados/pdf?' + new URLSearchParams(getQuery()));
})

const obtenerResultados = async (query) => {

    const resp = await fetch(url + 'evaluaciones/resultados?' + new URLSearchParams(query), {
        headers: { "x-token": 'token' }
    });
    const { errors, result } = await resp.json();
    // Tu array de objetos
    const datos = result;

    if ($.fn.DataTable.isDataTable('#miTabla')) {
        table.destroy();
        table.clear()
        $("#miTabla").html("");
    }

    if (errors) {
        table = $('#miTabla').DataTable({
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'  // Ruta del archivo de traducción en español
            },
            data: [],  // Inicialmente, no hay datos
            columns: [
                { title: "No se encontraron datos", data: null }
            ]
        });
        return;
    }

    // Extraer columnas dinámicamente de la propiedad "detalles"
    const columnasDetalles = datos.reduce((columnas, evaluacion) => {
        evaluacion.detalles.forEach(detalle => {
            if (!columnas.includes(detalle.nombre)) {
                columnas.push(detalle.nombre);
            }
        });
        return columnas;
    }, []);

    // Configuración de DataTables
    table = $("#miTabla").DataTable({
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'  // Ruta del archivo de traducción en español
        },
        data: datos,
        columns: [
            { data: 'nie', title: 'NIE' },
            { data: 'alumno', title: 'Alumno' },
            { data: 'genero', render : (data) => {
                return data === 'F' ? 'Femenino' : 'Masculino'
            }, title: 'Genero' },
            { data: 'years', title: 'Edad' },
            { data: 'grado', title: 'Grado' },
            { data: 'test_name', title: 'Evaluacion' },
            // // Agrega las columnas dinámicamente desde "detalles"
            // ...columnasDetalles.map(nombre => ({
            //     data: function (row) {
            //         const detalleEncontrado = row.detalles.find(detalle => detalle.nombre === nombre);
            //         return detalleEncontrado ? detalleEncontrado.respuesta : null;
            //     },
            //     title: `${nombre}`
            // })),
            { data: 'resultado', title: 'Resultado' },
            // Agrega columnas adicionales según tus necesidades
            { data: 'observaciones', title: 'Observaciones' },
        ],
        // Puedes personalizar más opciones según la documentación de DataTables
    });
}

const main = async () => {
    // Validar JWT
    await validarJWT()

}

const salir = () => {
    localStorage.removeItem('token');
    window.location = 'index.html'
}

main()