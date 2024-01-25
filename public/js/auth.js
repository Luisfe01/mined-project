window.onpageshow = function(event) {
    if (event.persisted) {
        window.location.reload();
    }
};

const url = (window.location.hostname.includes('localhost')) ? 'http://localhost:8080/api/' : 'https://mined-project-production.up.railway.app/api/auth/'
const miFormulario = document.querySelector('form')

miFormulario.addEventListener('submit', ev => {
    ev.preventDefault()

    const codigo = $("#codigo").val();
    const password = $("#password").val();
    const data = {codigo, password}

    fetch(url+'login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    })
    .then( resp => resp.json())
    .then( ({errors, token}) => {
        if (errors) {
            $("#errorAlert").prop("hidden", false).html(errors[0].msg)
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
const validarJWT = async() => {
    const token = localStorage.getItem('token') || ''

    if (token.length <= 10) {
        throw new Error('No hay token en el servidor')        
    }

    const resp = await fetch(url+'login', {
        headers: {"x-token": token}
    });
    
    const { docente, token: tokenDB } = await resp.json()

    //Renovar token
    localStorage.setItem('token', tokenDB)
    window.location = 'index.html'
}

const main = async () => {
    // Validar JWT
    await validarJWT()

}

main()
