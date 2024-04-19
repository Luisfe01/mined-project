window.onpageshow = function(event) {
    if (event.persisted) {
        window.location.reload();
    }
};

const url = (window.location.hostname.includes('localhost')) ? 'http://localhost:8080/api/' : 'https://mined-project-production.up.railway.app/api/'
let ids_q = [];
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


const loadInfo = async(docente) => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const test = urlParams.get('alumno')
    let main_content = ''

    const evas = await fetch(url+'evaluaciones/alumn/'+test, {
        headers: {"x-token": 'token'}
    });
    const {err, eva} = await evas.json();

    if (err) {
        Swal.fire({
            title: 'Error',
            text: 'Ya se ha evaluado al alumno',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        }).then((result) => {
            window.location = 'home.html'
        })
        return;
    }

    ids_eva = eva.map(ev => ev.id);
    $("#alumno_name").html(`<span>${eva[0].alumno} - Edad: ${eva[0].years} años</span>`)

    $("#test_name").html(`<span>Evaluacion 1er Grado</span>`)

    $("#btnFinalizar").html(`<button class="btn btn-danger" onclick="calificar('${ids_eva.join()}')">Finalizar</button>`)
    
    for (const eva_id of eva) {
    
        
        const resp = await fetch(url+'evaluaciones/'+eva_id.id, {
            headers: {"x-token": 'token'}
        });
        const {errors, evaluacion} = await resp.json();

        if (errors) {
            console.log(errors);
            return;
        }

        const info =  evaluacion[0]
        if (info.estado === 'F') {
            // window.location = 'home.html'
        }

        
        contador(info.createdAt)

        const req_items = await fetch(url+'testdetalle/'+info.test_id+'?grado_id='+info.grado_id, {
            headers: {"x-token": 'token'}
        });
        const items = await req_items.json();

        if (items.errors) {
            console.log(items.errors);
            return;
        }
        let ids_detalles = ''
        let preguntas = ''

        const palabras = [4,5,6,7];
        const letras = [8,9];

        items.detail.forEach((item, i) => {
            ids_detalles += ","+item.id
            const tag = "P"+item.id;
            const question = item.question.split('+')

            let vocabulario = question[0]
            if (question[2]) {
                vocabulario = question[0] + " - " + question[2];
                if (question[2].includes("jpg")) {
                    vocabulario = `<img class="img-responsive w-50" src="${question[2]}">`
                }
            }
            if (info.test_id != 9 && info.test_id != 8) {
                preguntas += `
                <tr>
                    <td>${vocabulario}</td>
                    <td class="text-center tdb"><input class="form-check-input" type="radio" name="rd${tag}" id="rd${tag}1" value="1" onchange="handleChange(${items.total}, ${info.test_id})"></td>
                    <td class="text-center tdb"><input class="form-check-input" type="radio" name="rd${tag}" id="rd${tag}2" value="0" onchange="handleChange(${items.total}, ${info.test_id})"></td>
                    <td><input type="text" class="form-control form-control-user" name="obs${tag}"></td>
                </tr>
                `
            } else {
                preguntas += `
                    <div class="col-3 bor text-center">
                        <input class="form-check-input" type="checkbox" name="rd${tag}" id="rd${tag}1" value="1" onchange="handleChange(${items.total}, ${info.test_id})">
                        <label class="form-check-label h4 w-25 font-weight-bold" for="rd${tag}1">
                            ${question[0]}
                        </label>
                    </div>
                `
            }
        });

        if (info.test_id == 9 || info.test_id == 8) { 
            preguntas = `
                <tr>
                    <td colspan="4" class="sp">
                        <div class="row">
                            ${preguntas}
                        </div>
                    </td>
                </tr>
            `
        }

        ids_q[info.id] = ids_detalles;
        
        let title = ''
        if (palabras.includes(info.test_id)) {
            title = "Palabras";
        }
        if (info.test_id == 2) {
            title = "Consigna o instrucción";
        }
        if (info.test_id == 3) {
            title = "Preguntas";
        }
        if (info.test_id == 11) {
            title = "Oraciones";
        }
        if (info.test_id == 10) {
            title = "Dibujo";
        }

        const tr = letras.includes(info.test_id) ? '' : `
            <tr>
                <th>${title}</th>
                <th>Correcto</th>
                <th>Incorrecto</th>
                <th>Observaciones</th>
            </tr>
        `;


        main_content = `
        <span class="h3">${eva_id.test_name}</span> 
        <div class="wrap">
            <table>
                <thead>
                    <tr>
                        <th colspan="4">Instruccion: Marque con una X la casilla correspondiente</th>
                    </tr>
                    ${tr}
                </thead>
                <tbody id="Q${info.test_id}">
                    ${preguntas}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4">
                            <div class="row">
                                <p class="col-12">Total de respuestas ejecutadas correctamente: <span class="font-weight-bold" id="T${info.test_id}">0</span> de <span class="font-weight-bold">${items.total}</span> </p>
                                <div class="col-12">
                                    <div class="row">
                                        <p class="mx-3">Nivel de logro: <span class="font-weight-bold" id="R${info.test_id}"></span> </p>
                                    </div>
                                </div>
                                <p class="col-12">Aceptable: Realiza en forma correcta la mitad o mas de los ejercicios.</p>
                                <p class="col-12">Por mejorar: Realiza en forma correcta menos de la mitad de los ejercicios.</p>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
        <hr>
        `
        $("#cardBody").append(main_content)
    }

    
}


const contador = (inicio) => {
    
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


const handleChange = (total, test) => {

    let preguntas = document.getElementById("Q"+test).getElementsByTagName("input");
    let contadorCorrectas = 0;

    for (let i = 0; i < preguntas.length; i++) {
        if (preguntas[i].type !== "text" && preguntas[i].checked && preguntas[i].value === "1") {
            contadorCorrectas++;
        }
    }
    
    if (contadorCorrectas >= Math.ceil(total*0.5)) {
        result = "Aceptable"
    } else {
        result = "Por mejorar"
    }

    $("#R"+test).html(result)
    $("#T"+test).html(contadorCorrectas)

    console.log(ids_q[3]);
}


const calificar = async(ids) => {
    $("btnFinalizar").prop("disabled", true);
    const arr = ids.split(",");
    for (const idevaluacion of arr) {
        
        idtestdetail = ids_q[idevaluacion].split(",")
    
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
                observaciones: $(`input[name=obsP${q}]`).val() ?? ''
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
        if (count >= Math.ceil(total*0.5)) {
            result = "Aceptable"
        } else {
            result = "Por mejorar"
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
        })
        .catch( err => {
            console.log(err);
        })

    }

    Swal.fire({
        title: 'Resultado',
        text: 'Se han guardado los resultados',
        icon: 'success',
        confirmButtonText: 'Aceptar'
    }).then((result) => {
        window.location = 'home.html'
    })
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