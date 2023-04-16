
let usuario

const listUsers = [
    {
        username: 'jhosep',
        password: '111'
    },
    {
        username: 'trejo',
        password: '111'
    },
    {
        username: 'gerson',
        password: '111'
    },
    {
        username: 'Reyna',
        password: '111'
    }
]




const onLoadLogin = () => {

    usuario = localStorage.getItem('usuario')
    if (usuario) {
        window.location.href = '/'
    }

}

const login = () => {

    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    const isUser =
        listUsers.find(user => user.username === username && user.password === password)

    if (!isUser) {
        alert('CONTRASEÑA INCORRECTA, INTENTE OTRA VEZ');
        return
    }

    localStorage.setItem('usuario', JSON.stringify({ username, password }))

    window.location.href = '/'
}




/* users.forEach(user => {
    
    const tr = document.getElementById("conectadosTR");
    const td = document.getElementById("conectadosTD");

    td.innerText = user.name;

    table.appendChild(tr);
    

}) */