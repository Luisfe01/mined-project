window.onpageshow = function(event) {
    if (event.persisted) {
        window.location.reload();
    }
};

const url = (window.location.hostname.includes('localhost')) ? 'http://localhost:8080/api/' : 'https://mined-project-production.up.railway.app/api/'
const miFormulario = document.querySelector('form')

miFormulario.addEventListener('submit', ev => {
    ev.preventDefault()
    $("#errorAlert").prop("hidden", true).html('')

    const nombres = $("#nombres").val();
    const apellidos = $("#apellidos").val();
    const correo = $("#correo").val();
    const codigo = $("#codigo").val();
    const institucion_id = $("#institucion").val();
    const data = {codigo, nombres, apellidos, correo, institucion_id}

    fetch(url+'docentes', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    })
    .then( resp => resp.json())
    .then( ({errors, token}) => {
        if (errors) {
            let html_err = ''
            errors.forEach(err => {
                html_err += err.msg+'<br>'
            });
            $("#errorAlert").prop("hidden", false).html(html_err)
            return;
        }
        localStorage.setItem('token', token)
        window.location = 'index.html'
    })
    .catch( err => {
        console.log(err);
    })
})

// Validar el token del localStorage 
const loadInfo = async() => {
    
    const resp = await fetch(url+'departamentos');
    
    const { departamentos, errors } = await resp.json()
    let select_dep = '';
    departamentos.forEach(dep => {
        select_dep = `<option value="${dep.id}" data-codigo="${dep.codigo}">${dep.departamento}</option>`
        $(`#departamento`).append(select_dep)
    });
    $(`#departamento`).selectpicker('refresh')

}


$("#departamento").change(async () => {
    const resp = await fetch(url+'municipios/'+$("#departamento").val());
    
    const { municipios, errors } = await resp.json()
    let select_mun = '';
    $(`#municipio`).html('').selectpicker('refresh')
    $(`#institucion`).html('').selectpicker('refresh')
    municipios.forEach(mun => {
        select_mun = `<option value="${mun.id}" data-codigo="${mun.codigo}">${mun.municipio}</option>`
        $(`#municipio`).append(select_mun)
    });
    $(`#municipio`).selectpicker('refresh')

})

$("#municipio").change(async () => {

    const query = {
        codigo_dep: $("#departamento").find(':selected').data('codigo'),
        codigo_mun: $("#municipio").find(':selected').data('codigo')
    }

    const resp = await fetch(url+'instituciones?'+ new URLSearchParams(query));

    const { instituciones, errors } = await resp.json()
    let select_ins = '';
    $(`#institucion`).html('').selectpicker('refresh')
    instituciones.forEach(ins => {
        select_ins = `<option value="${ins.id}" data-codigo="${ins.codigo}" data-subtext="${ins.codigo}">${ins.institucion}</option>`
        $(`#institucion`).append(select_ins)
    });
    $(`#institucion`).selectpicker('refresh')
})
const main = async () => {
    const token = localStorage.getItem('token') || ''
    if (token.length >= 10) {
        window.location = 'index.html'
        throw new Error('No hay token en el servidor')        
    }
    await loadInfo()

}

const salir = () => {
    localStorage.removeItem('token');
    window.location = 'login.html'
}

main()
