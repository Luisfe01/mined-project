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
        window.location = 'index.html'
        throw new Error('No hay token en el servidor')        
    }

    const resp = await fetch(url+'login', {
        headers: {"x-token": token}
    });
    
    const { docente, token: tokenDB } = await resp.json()

    //Renovar token
    localStorage.setItem('token', tokenDB)
    $("#userName").html(docente.nombres)
    
    loadInfo()
}

const indicaciones = [
    ``,
    `<div class="row">
        <div class="col-lg-6 mb-4">
            <div class="card border-secondary h-100">
                <div class="card-body text-secondary">
                    <h5 class="card-title">La niña o el niño pasa de “LETRA” si:</h5>
                    <ul>
                        <li>Lee de forma correcta las cinco letras o al menos cuatro, marcar “1” en la fila de letra de la hoja de registro.</li>
                        <li>Marcar las demás casillas con “0”, y se clasifica en el nivel de letras.</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="col-lg-6 mb-4">
            <div class="card border-secondary h-100">
                <div class="card-body text-secondary">
                    <h5 class="card-title">La niña o niño no alcanza el nivel de “LETRA” si:</h5>
                    <ul>
                        <li>No lee de forma correcta ninguna de las letras, marcar “0” en la fila de LETRA y en las siguientes casillas de la hoja de registro. Dar por concluida la aplicación del instrumento de lectoescritura.</li>
                        <li>Si sólo lee de manera correcta 3 palabras o menos, marcar “0” en la fila de LETRA y en las siguientes casillas de la hoja de registro.</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>`,
    `<div class="row">
        <div class="col-lg-6 mb-4">
            <div class="card border-secondary h-100">
                <div class="card-body text-secondary">
                    <h5 class="card-title">La niña o el niño pasa de “PALABRA” si:</h5>
                    <ul>
                        <li>Lee de forma correcta las cinco palabras o al menos cuatro, marcar “1” en la fila de palabra de la hoja de registro, y se queda al nivel de palabra.</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="col-lg-6 mb-4">
            <div class="card border-secondary h-100">
                <div class="card-body text-secondary">
                    <h5 class="card-title">La niña o niño no alcanza el nivel de “PALABRA” si:</h5>
                    <ul>
                        <li>No lee de forma correcta ninguna de las palabras, marcar “0” en la fila de PALABRA y en las siguientes casillas de la hoja de registro. Dar por concluida la aplicación del instrumento de lectoescritura.</li>
                        <li>Si sólo lee de manera correcta 3 palabras o menos, marcar “0” en la fila de PALABRA y en las siguientes casillas de la hoja de registro.</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>`,
    `<div class="row">
        <div class="col-lg-6 mb-4">
            <div class="card border-secondary h-100">
                <div class="card-body text-secondary">
                    <h5 class="card-title">La niña o el niño pasa de “PÁRRAFO” si:</h5>
                    <ul>
                        <li>Lee con fluidez de forma correcta el párrafo, marcar “1” en la fila de párrafo de la hoja de registro y pasa al siguiente nivel.</li>
                        <li>Si lee con fluidez, cometiendo 3 errores o menos.</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="col-lg-6 mb-4">
            <div class="card border-secondary h-100">
                <div class="card-body text-secondary">
                    <h5 class="card-title">La niña o niño no alcanza el nivel de “PÁRRAFO” si:</h5>
                    <ul>
                        <li>No lee de forma correcta el párrafo, marcar “0” en la fila de PÁRRAFO y en las siguientes casillas de la hoja de registro. Dar por concluida la aplicación del instrumento de lectoescritura.</li>
                        <li>Si al leer párrafo comete más de 3 errores, marcar “0” en la fila de PÁRRAFO y en las siguientes casillas de la hoja de registro.</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>`,
    `<div class="row">
        <div class="col-lg-6 mb-4">
            <div class="card border-secondary h-100">
                <div class="card-body text-secondary">
                    <h5 class="card-title">La niña o el niño pasa de “HISTORIA” si:</h5>
                    <ul>
                        <li>Lee con fluidez de forma correcta la historia, marcar “1” en la fila de historia de la hoja de registro y pasa al siguiente nivel.</li>
                        <li>Si lee con fluidez, cometiendo 3 errores o menos.</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="col-lg-6 mb-4">
            <div class="card border-secondary h-100">
                <div class="card-body text-secondary">
                    <h5 class="card-title">La niña o niño no alcanza el nivel de “HISTORIA” si:</h5>
                    <ul>
                        <li>No lee de forma correcta la historia, marcar “0” en la fila de HISTORIA y en las siguientes casillas de la hoja de registro. Dar por concluida la aplicación del instrumento de lectoescritura</li>
                        <li>Si al leer historia comete más de 3 errores , marcar “0” en la fila de HISTORIA y en las siguientes casillas de la hoja de registro</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>`,
    `<div class="row">
        <div class="col-lg-6 mb-4">
            <div class="card border-secondary h-100">
                <div class="card-body text-secondary">
                    <h5 class="card-title">La niña o el niño pasa de “COMPRENSIÓN 1” si:</h5>
                    <ul>
                        <li>Responde de forma correcta la pregunta literal, seleccionar “Correcto” y pasa al siguiente nivel.</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="col-lg-6 mb-4">
            <div class="card border-secondary h-100">
                <div class="card-body text-secondary">
                    <h5 class="card-title">La niña o niño no alcanza el nivel de “COMPRENSIÓN 1” si:</h5>
                    <ul>
                        <li>No responde de forma correcta la pregunta literal, seleccionar “Incorrecto”. Dar por concluida la aplicación del instrumento de lectoescritura</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>`,
    `<div class="row">
        
        <div class="col-lg-6 mb-4">
            <div class="card border-secondary h-100">
                <div class="card-body text-secondary">
                    <h5 class="card-title">La niña o el niño se clasifica en “COMPRENSIÓN 2” si: </h5>
                    <ul>
                        <li>Responde de forma correcta la pregunta inferencial, seleccionar “Correcto”.</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="col-lg-6 mb-4">
            <div class="card border-secondary h-100">
                <div class="card-body text-secondary">
                    <h5 class="card-title">La niña o niño no alcanza el nivel de “COMPRENSIÓN 2” si:</h5>
                    <ul>
                        <li>No responde de forma correcta la pregunta inferencial seleccionar “Incorrecto” en la fila de COMPRENSIÓN 2 y se clasifica en comprensión 1. Dar por concluida la aplicación del instrumento de lectoescritura.</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>`,

]

const loadInfo = async(docente) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const test = urlParams.get('test')

    const resp = await fetch(url+'evaluaciones/'+test, {
        headers: {"x-token": 'token'}
    });
    const {errors, evaluacion} = await resp.json();

    if (errors) {
        console.log(errors);
        return;
    }

    const info =  evaluacion[0]
    if (info.estado === 'F') {
        window.location = 'index.html'
    }


    $("#test_name").html(`<span>${info.test_name}</span>`)
    $("#alumno_name").html(`<span>${info.alumno}</span>`)
    contador(info.createdAt)

    const req_items = await fetch(url+'testdetalle/'+info.test_id+'?grado_id='+info.grado_id, {
        headers: {"x-token": 'token'}
    });
    const items = await req_items.json();

    if (items.errors) {
        console.log(items.errors);
        return;
    }

    let main_content = ''
    let ids_detalles = ''
    items.detail.forEach((item, i) => {
        ids_detalles += ","+item.id
        const tag = "P"+item.id;
        const question = item.question.split('+')
        let body_q_html = '';
        if (question.length > 0) {
            for (const q of question) {
                // Condición para saltar la primera iteración
                if (q === question[0] || q === question[1]) {
                  continue;
                }
                
                const qId = Math.random().toString(36).substr(2)
                body_q_html += `
                    <a class="btn btn-danger btn-icon-split m-2" id="Q${qId}" onClick="markResult('${qId}')">
                        <span class="icon text-white-50">
                            <i class="fas fa-ban" id="I${qId}"></i>
                        </span>
                        <span class="text">${q}</span>
                    </a>
                `

                if (q.includes("jpg")) {
                    body_q_html = `<img class="img-responsive" src="${q}">`
                }
            }
        }
        
        let hoja_respuestas = ''

        if (item.respuestas != null) {
            let resp = ``
            item.respuestas.split('+').forEach(element => {
                resp += `
                    <li class="list-group-item">${element}</li>
                `
            });
            hoja_respuestas = `
            <div class="accordion col-12 mb-2" id="AC${tag}">
                <div class="card">
                    <div class="card-header" id="heading${tag}">
                    <h2 class="mb-0">
                        <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#HR${tag}" aria-expanded="false" aria-controls="HR${tag}">
                        Mostrar hoja de respuestas
                        </button>
                    </h2>
                    </div>
                    <div id="HR${tag}" class="collapse" aria-labelledby="heading${tag}" data-parent="#AC${tag}">
                        <div class="card-body">
                            <ul class="list-group">
                                ${resp}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            `
        }

        let isHidden = '';
        let si = 'Correcto';
        let no = 'Incorrecto';
        if (info.grado_id > 2 && i != 0) {
            isHidden = 'hidden'
            si = 'Si';
            no = 'No';
        }

        main_content += `
            <div class="row p-3" ${isHidden} id="MC${tag}">
                <div class="col-12 mb-2">
                    <strong>${question[0]}</strong>
                </div>
                <div class="col-12 mb-2">
                    <span>${question[1]}</span>
                    
                    ${indicaciones[item.id] ?? ''}
                    

                </div>
                <div class="col-12 mb-2">
                    ${body_q_html}
                </div>
                <div class="col-12 mb-2">
                    Respuesta
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="rd${tag}" id="rd${tag}1"  value="1" data-nivel="${item.nivel}" data-orden="${item.orden}" onchange="handleChange(this)">
                        <label class="form-check-label" for="rd${tag}1">
                            ${si}
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="rd${tag}" id="rd${tag}2" value="0" data-nivel="${item.nivel}" data-orden="${item.orden}" onchange="handleChange(this)">
                        <label class="form-check-label" for="rd${tag}2">
                            ${no}
                        </label>
                    </div>
                </div>
                ${hoja_respuestas}
                <div class="col-12">
                    <input type="text" class="form-control form-control-user" name="obs${tag}"
                    placeholder="Observaciones...">
                </div>
            </div> 
        `
    });

    $("#cardBody").html(main_content)
    $("#btnFinalizar").html(`<button class="btn btn-danger" onclick="calificar('${test}', '${ids_detalles}', '${info.grado_id}')">Finalizar</button>`)

    return;
}

const calificar = async(idevaluacion, idtestdetail, grado) => {
    $("btnFinalizar").prop("disabled", true);
    idtestdetail = idtestdetail.split(",")
    let count = 0;
    let result = "";
    const total = idtestdetail.length-1

    for (const q of idtestdetail) {
        // Condición para saltar la primera iteración
        if (q === idtestdetail[0]) {
          continue;
        }
        const rd = `rdP${q}`;
        const data = {
            respuesta: $(`input[name=${rd}]:checked`).val() == 1 ? true : false,
            test_detail_id: q,
            evaluacion_id: idevaluacion,
            observaciones: $(`input[name=obsP${q}]`).val()
        }

        fetch(url+`evaluaciondetalle`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
        })
        .then( resp => resp.json())
        .then( ({errors, evaluacione}) => {
            if (errors) {
                return console.error(errors);
            }
        })
        .catch( err => {
            console.error(err);
        })

        if (data.respuesta) {
            count++
        }
    }
    if (grado > 2) {
        if (count == 6) {
            result = "Establecido (Es)"
        }
        if (count <= 5) {
            result = "Inicial (In)"
        }
        if (count <= 2) {
            result = "Emergente (Em)"
        }
    } else {
        if (count >= Math.ceil(total*0.5)) {
            result = "Aceptable"
        } else {
            result = "Por mejorar"
        }
    }
    
    const info = {
        resultado: result,
        estado: "F"
    }

    fetch(url+`evaluaciones/`+idevaluacion, {
    method: 'PUT',
    body: JSON.stringify(info),
    headers: {'Content-Type': 'application/json'}
    })
    .then( resp => resp.json())
    .then( ({errors, evaluacione}) => {
        if (errors) {
            return console.error(errors);
        }

        Swal.fire({
            title: 'Resultado',
            text: result,
            icon: 'success',
            confirmButtonText: 'Aceptar'
        }).then((result) => {
            window.location = 'index.html'
        })
    })
    .catch( err => {
        console.log(err);
    })
}

const contador = (inicio) => {
    //Contador desde el registro de la habitacion
    let StartContador = new Date(inicio);
    let StartStamp = StartContador.getTime();

    function timerGO() {
        newDate = new Date();
        newStamp = newDate.getTime();
        let diff = Math.round((newStamp-StartStamp)/1000);
        let d = Math.floor(diff/(24*60*60));
        diff = diff-(d*24*60*60);
        let h = Math.floor(diff/(60*60));
        diff = diff-(h*60*60);
        let m = Math.floor(diff/(60));
        diff = diff-(m*60);
        let s = diff;
        var conteo = (h<10 ? `0${h}` : `${h}`) + (m<10 ? `:0${m}` : `:${m}`) + (s<10 ? `:0${s}` : `:${s}`);

        $("#time_count").html(conteo);
        
    }
    timer = setInterval(timerGO, 1000); 
}

const markResult = (id) => {

    if ($(`#Q${id}`).hasClass("btn-danger")) {
        $(`#Q${id}`).removeClass("btn-danger").addClass("btn-success")
        $(`#I${id}`).removeClass("fa-ban").addClass("fa-check")
    } else {
        $(`#Q${id}`).removeClass("btn-success").addClass("btn-danger")
        $(`#I${id}`).removeClass("fa-check").addClass("fa-ban")
    }
}

const handleChange = (radio) => {
    
    const valor = $(radio).val()
    const nivel = String($(radio).data("nivel"))
    const orden = String($(radio).data("orden"))
    if (nivel == 0 && orden == 0) {
       
        let target = $(radio).parent().parent().parent().next()

        if (target.length === 0) {
            target = $('#page-top')
        }

        $('html, body').animate({
            scrollTop: target.offset().top
        }, 'slow')
        target.addClass('shadow')
        setTimeout(() => {
            target.removeClass('shadow')
        }, 1000);

        return
    }

    const ids = nivel.split(',')

    if (valor == 1) {
        for (const id of ids) {
            if (id === 0) {
                continue;
            }
            $("input[name=rdP" + id + "][value=" + valor + "]").prop('checked',true);
        };
        $("#MCP"+orden).removeAttr('hidden')
        $("#MCP"+orden).get(0).scrollIntoView({behavior: 'smooth'})
    } else {
        $("#MCP"+ids[0]).removeAttr('hidden')
        $("#MCP"+ids[0]).get(0).scrollIntoView({behavior: 'smooth'})
    }
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
