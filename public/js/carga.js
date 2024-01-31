window.onpageshow = function (event) {
    if (event.persisted) {
        window.location.reload();
    }
};

const url = (window.location.hostname.includes('localhost')) ? 'http://localhost:8080/api/' : 'https://mined-project-production.up.railway.app/api/'
let table;
let user = null;

$(document).ready(function () {
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
        $('#gradoNuevo').append(select_test)
    })
    $('#grado').selectpicker('refresh')
    $('#gradoNuevo').selectpicker('refresh')
}

$("#grado").change(async () => {
    if (getEvaluaciones($("#grado").val(), "evaluacion")) {
        $("button[name=btn-resultados]").prop("disabled", false);
    }
})

$("#gradoNuevo").change(async () => {
    if (getEvaluaciones($("#gradoNuevo").val(), "evaluacionNuevo")) {
        $('#resultado').html("").selectpicker("refresh")
        select_test = `
        <option value="Establecido (Es)">Establecido (Es)</option>
        <option value="Inicial (In)">Inicial (In)</option>
        <option value="Emergente (Em)">Emergente (Em)</option>`
        $('#resultado').append(select_test).selectpicker("refresh")
    }
})

$("#evaluacionNuevo").change(async () => {
    const id_grado = $("#gradoNuevo").val()
    $('#resultado').html("").selectpicker("refresh")
    if (id_grado > 2) {
        select_test = `
        <option value="Establecido (Es)">Establecido (Es)</option>
        <option value="Inicial (In)">Inicial (In)</option>
        <option value="Emergente (Em)">Emergente (Em)</option>`
    } else {
        select_test = `
        <option value="Aceptable">Aceptable</option>
        <option value="Por mejorar">Por mejorar</option>`
    }

    $('#resultado').append(select_test).selectpicker("refresh")
})

const getEvaluaciones = async (id, receptor) => {

    const resp = await fetch(url + 'tests?grado=' + id, {
        headers: { "x-token": 'token' }
    });
    const { tests } = await resp.json();
    $("#" + receptor).html('').selectpicker("refresh");
    let select_test = ''
    tests.forEach(test => {
        select_test = `<option value="${test.id}" ${test.id === 1 ? 'selected' : ''}>${test.test_name}</option>`
        $("#" + receptor).append(select_test)
    });
    $("#" + receptor).selectpicker({ title: 'Seleccione una evaluacion' }).selectpicker('refresh')

    return tests[0].id === 1

}

$("#evaluacion").change(() => {
    $("button[name=btn-resultados]").prop("disabled", false);
})

$("button[name=btn-resultados]").click(() => {

    const data = { test_id: $("#evaluacion").val(), grado_id: $("#grado").val(), seccion_id: $("#grado").find(':selected').data('id'), docente_id: user.id }

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


const obtenerResultados = async (query) => {

    const resp = await fetch(url + 'cargas?' + new URLSearchParams(query), {
        headers: { "x-token": localStorage.getItem('token') }
    });
    const { errors, evaluaciones } = await resp.json();
    // Tu array de objetos
    const datos = evaluaciones;

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

    // Configuración de DataTables
    table = $("#miTabla").DataTable({
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'  // Ruta del archivo de traducción en español
        },
        data: datos,
        columns: [
            { data: 'resultado', title: 'Resultado' },
            // Agrega columnas adicionales según tus necesidades
            { data: 'cantidad', title: 'Total de alumnos' },
            {
                data: "id", render: (data) => {
                    return `<a class="btn btn-secondary btn-block" href="#" onClick="editTotal(${data})">Editar</a>`
                }, title: 'Opciones'
            },
        ],
        // Puedes personalizar más opciones según la documentación de DataTables
    });
}

const registrar = () => {
    $("#btn-registro").prop("disabled", true)
    $("#errorAlert").prop("hidden", true).html('')
    const data = {
        test_id: $("#evaluacionNuevo").val(),
        grado_id: $("#gradoNuevo").val(),
        seccion_id: $("#gradoNuevo").find(':selected').data('id'),
        resultado: $("#resultado").val(),
        cantidad: $("#cantidad").val(),
        docente_id: user.id
    }

    fetch(url + 'cargas', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json', "x-token": localStorage.getItem('token') }
    })
        .then(resp => resp.json())
        .then(async ({ errors, carga }) => {
            if (errors) {
                let errores = '';
                errors.forEach(element => {
                    errores += `${element.msg}</br>`
                });
                $("#errorAlert").prop("hidden", false).html(errores)
                return;
            }

            $('#datosModal').modal('hide');


            const query = { docente_id: user.id, grado_id: data.grado_id, seccion_id: data.seccion_id, test_id: data.test_id }

            $(`#grado [data-id=${carga.seccion_id}][value=${carga.grado_id}]`).prop("selected", true).selectpicker("refresh")
            $("#grado").selectpicker("refresh")

            $("button[name=btn-resultados]").prop("disabled", false);
            await getEvaluaciones(data.grado_id, "evaluacion")
            $("#evaluacion").val(data.test_id).selectpicker("refresh")
            obtenerResultados(query)
        })
        .catch(err => {
            console.log(err);
        })
        .finally(() => {
            $("#btn-registro").prop("disabled", false)
        })
}

const editTotal = async (id) => {
    Swal.fire({
        title: "Ingrese el nuevo total",
        input: "number",
        inputAttributes: {
            min: 0,
        },
        showCancelButton: true,
        confirmButtonText: "Actualizar",
        cancelButtonText: "Cancelar",
        showLoaderOnConfirm: true,
        preConfirm: async (x) => {
            try {
                const data = {cantidad:x}
                const response = await fetch(url + 'cargas/'+id, {
                    method: 'PUT',
                    body: JSON.stringify(data),
                    headers: { 'Content-Type': 'application/json', "x-token": localStorage.getItem('token') }
                })
                if (!response.ok) {
                    err = await response.json();
                    
                    return Swal.showValidationMessage(`
                    ${err.errors[0].msg}
                `);
                }
                return response.json();
            } catch (error) {
                Swal.showValidationMessage(`
                Ocurrio un error: ${error.errors[0].msg}
            `);
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: `Total Actualizado`
            });

            const data = { test_id: $("#evaluacion").val(), grado_id: $("#grado").val(), seccion_id: $("#grado").find(':selected').data('id'), docente_id: user.id }
            obtenerResultados(data)
        }
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