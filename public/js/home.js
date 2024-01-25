window.onpageshow = function(event) {
    if (event.persisted) {
        window.location.reload();
    }
};
const url = (window.location.hostname.includes('localhost')) ? 'http://localhost:8080/api/' : 'https://mined-project-production.up.railway.app/api/'

let usuario = null;

// Referencias HTML
const txtUser = $('#txtuser');
const container = $('#maincontainer');


// Validar el token del localStorage 
const validarJWT = async() => {
    const token = localStorage.getItem('token') || ''

    if (token.length <= 10) {
        window.location = 'login.html'
        throw new Error('No hay token en el servidor')        
    }

    const resp = await fetch(url+'login', {
        headers: {"x-token": token}
    });
    
    const { docente, token: tokenDB } = await resp.json()
    usuario = docente
    //Renovar token
    localStorage.setItem('token', tokenDB)

    txtUser.html(`<span>${ docente.nombres + ' '+ docente.apellidos} | Código: ${docente.codigo}</span>`);
    $("#userName").html(docente.nombres)

    renderTest(docente)
}

const renderTest = async(docente) => {
    container.html('');
    const resp = await fetch(url+'cargos/'+docente.id, {
        headers: {"x-token": localStorage.getItem('token')}
    });
    const {cargos} = await resp.json();
    // console.log(json);
    // container

    let html = '';

    cargos.forEach(async(cargo) => {
        const html_id = cargo.seccion+cargo.grado;

        html += `
        <div class="col-6 mb-3">
            <div class="card shadow mb-3">
                <a href="#${html_id}" class="d-block card-header py-3 collapsed" data-toggle="collapse"
                    role="button" aria-expanded="false" aria-controls="${html_id}">
                    <h6 class="m-0 font-weight-bold text-secondary">Grado: ${cargo.grado} "${cargo.seccion}"</h6>
                </a>
                <div class="collapse" id="${html_id}">
                    <div class="card-body" id="body-${html_id}">
                        <div class="row mb-3">
                            <div class="col-lg-4 mb-2">
                                <select class="form-control selectpicker select-test-${html_id} sle" id="select-test-${html_id}" data-id="${html_id}" data-grado="${cargo.grado_id}" data-seccion="${cargo.seccion_id}" data-live-search="true" title="Seleccione la evaluacion">
                                </select>
                            </div>
                            <div class="col-lg-5 mb-2">
                                <select class="form-control selectpicker select-alumnos-${html_id}" id="select-alumnos-${html_id}" data-live-search="true" title="Seleccione un alumno" disabled>
                                </select>
                            </div>
                            <div class="col-lg-3 mb-2">
                                <button class="btn btn-primary btn-block" id="btn${html_id}" onClick="iniciar('${html_id}','${docente.id}')">Iniciar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `

        const resp = await fetch(url+'tests?grado='+cargo.grado_id, {
            headers: {"x-token": localStorage.getItem('token')}
        });
        const {tests} = await resp.json();
        let select_test = ''
        tests.forEach(test => {
            select_test = `<option value="${test.id}" ${test.id === 1 ? 'selected' : '' }>${test.test_name}</option>`
            $(`#select-test-${html_id}`).append(select_test)
        });
        $(`#select-test-${html_id}`).selectpicker('refresh')
        

        $(`#select-alumnos-${html_id}`).selectpicker({ title: 'Seleccione una evaluacion' }).selectpicker('refresh')

        if (cargo.grado_id > 2) {
            cargarAlumnos(html_id, cargo.grado_id, cargo.seccion_id, 1)
        }
    });

    container.html(html);

    $(".sle").on('change', function(e) {
        cargarAlumnos($(this).data("id"), $(this).data("grado"), $(this).data("seccion"), $(this).val())
    });
}

const iniciar = (id, docente_id) => {

    const alumno_id = $(`#select-alumnos-${id}`).val()
    const test_id = $(`#select-test-${id}`).val()

    const data = {
        alumno_id,
        test_id,
        docente_id,
        resultado: "N",
        estado: "A"
    }

    if (data.alumno_id == '' || data.test_id == '' || data.alumno_id === undefined) {
        const msg = data.alumno_id == '' ? "un alumno" : "una evaluacion";
        Swal.fire({
            title: 'Error',
            text: `Seleccione ${msg} para poder continuar`,
            icon: 'error',
            confirmButtonText: 'Aceptar'
        })
        return;
    }

    fetch(url+`evaluaciones`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json',"x-token": localStorage.getItem('token')}
    })
    .then( resp => resp.json())
    .then( ({errors, evaluacione}) => {
        if (errors) {
            let errores = '';
            errors.forEach(element => {
                errores += `<li class="list-group-item">${element.msg}</li>`
                
            });
            Swal.fire({
                title: "Errores",
                icon: "info",
                html: `
                    <ul class="list-group">
                        ${errores}
                    </ul>
                `,
                focusConfirm: false
            });
            
            return;
        }
        window.location = 'evaluacion.html?test='+evaluacione.id
    })
    .catch( err => {
        console.log(err);
    })
}

const salir = () => {
    localStorage.removeItem('token');
    window.location = 'login.html'
}

const addGrado = () => {
    $("#errorAlert").prop("hidden", true).html('')
    const data = {
        docente_id: usuario.id,
        grado_id: $("#grado").val(),
        seccion_id: $("#seccion").val()
    }

    fetch(url+'docentes/cargo', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json',"x-token": localStorage.getItem('token')}
    })
    .then( resp => resp.json())
    .then( ({errors, evaluacione}) => {
        if (errors) {
            let errores = '';
            errors.forEach(element => {
                errores += `${element.msg}</br>`
            });
            $("#errorAlert").prop("hidden", false).html(errores)
            return;
        }
        $('#nuevoGrado').modal('hide');
        renderTest(usuario)
    })
    .catch( err => {
        console.log(err);
    })
}

const cargarAlumnos = async (id, grado_id, seccion_id, test) => {
    $(`#select-alumnos-${id}`).html('').selectpicker("refresh");
    const req_alumnos = await fetch(url+`alumnos/evaluados?institucion=${usuario.institucion_id}&grado=${grado_id}&seccion=${seccion_id}&test=${test}&docente=${usuario.id}`, {
        headers: {"x-token": localStorage.getItem('token')}
    });
    
    const {errors, alumnos} = await req_alumnos.json();

    if (errors) {
        $(`#select-alumnos-${id}`).selectpicker({ title: 'No se encontraron alumnos' }).selectpicker('refresh')
        return;
    }
    let select_alumno = ''
    if (!errors) {
        alumnos.forEach(alumno => {
            select_alumno = `<option value="${alumno.id}">${alumno.nombres} ${alumno.apellidos}</option>`
            $(`#select-alumnos-${id}`).append(select_alumno)
        });
    }

    $(`#select-alumnos-${id}`).removeAttr("disabled")
    $(`#select-alumnos-${id}`).selectpicker({ title: 'Seleccione un alumno' }).selectpicker('refresh')
}


const main = async () => {
    // Validar JWT
    await validarJWT()
}

main()


