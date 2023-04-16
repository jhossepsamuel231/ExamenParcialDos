const socket = io()
let usuario

let username = document.getElementById('username')
let actions = document.getElementById('actions')

const onLoadoIndex = () => {

    usuario = localStorage.getItem('usuario')

    if (!usuario) {
        window.location.href = '/login'
        return
    }

    usuario = JSON.parse(usuario)

}


const btnSend = document.getElementById("send-message");
const message = document.getElementById("message-area");
const boxMessages = document.getElementById("chat-box");

const fileInput = document.getElementById("file-upload");

const fileInputImg = document.getElementById("file-uploadImg");



btnSend.addEventListener("click", () => {
    let usuarioEncontrado = JSON.parse(localStorage.getItem('usuario'))
    if (message.value == "") {
        message.focus();
    } else {
        boxMessages.innerHTML += `
        <div class="chat from-message">
          <div class="detalles">
            <p>${message.value}</p>
          </div>
        </div>
            `;
        scrollBottom();
        let mensaje = { msg: message.value, userEnvio: usuarioEncontrado.username };
        socket.emit("message", mensaje)
        message.value = null;


    }
});

message.addEventListener('keypress', function () {
    let usuarioEncontrado = JSON.parse(localStorage.getItem('usuario'))
    socket.emit('chat:typing', usuarioEncontrado.username)
});

function enterkey() {
    keyenter = event.keyCode;
    if (keyenter == 13) {
        btnSend.click();
        scrollBottom();
    }
}
window.onkeydown = enterkey;

function scrollBottom() {
    boxMessages.scrollTop = boxMessages.scrollHeight;
}

socket.on("message", (data) => {
    boxMessages.innerHTML += `
        <div class="chat to-message">
          <div class="detalles">
          <p><strong>${data.userEnvio}</strong>: ${data.msg}</p>
          </div>
        </div>
        `;
    scrollBottom()
});

socket.on('chat:typing', function (data) {
    actions.innerHTML = `<p><em>${data} esta escribiendo </em>
    <i class="fa-solid fa-ellipsis fa-beat"></i></p>`
})






btnSend.addEventListener("click", () => {
    let usuarioEncontrado = JSON.parse(localStorage.getItem('usuario'))

    const file = fileInputImg.files[0];
    const reader = new FileReader();
    const nameImg = file.name;

    const imgUrl = `uploads/${file.name}`;

    console.log(imgUrl);

    reader.onload = (event) => {
        const fileData = event.target.result;
        boxMessages.innerHTML += `
            <!-- MI MENSAJE -->
        <div class="chat from-message">
          <div class="detalles">
            <p>${nameImg} <img class="image-file" src="${imgUrl}"></p>
          </div>
        </div>
        `;
        socket.emit("fileImage", { data: fileData, name: file.name, nameUser: usuarioEncontrado.username });
    };
    reader.readAsDataURL(file);
    fileInputImg.value = null;
});




socket.on("fileImage", (data) => {
    const fileName = data.name;
    const nombreUsuario = data.userEnvio;
    const imgUrl = `uploads/${fileName}`;

    boxMessages.innerHTML += `
        <!-- MENSAJE AMIGO -->
        <div class="chat to-message">
          <div class="detalles">
          <p><strong>${nombreUsuario}</strong>: ${fileName}
          <img class="image-file"src="${imgUrl}">         
          </p>
          </div>
        </div>
        `;
});








btnSend.addEventListener("click", () => {
    let usuarioEncontrado = JSON.parse(localStorage.getItem('usuario'))
    const file = fileInput.files[0];
    const fileExtension = file.name.split('.').pop();
    const fileUrl = `/uploads/${file.name}`;
    let icono;
    console.log(fileExtension)
    const reader = new FileReader();

    if (fileInput.files.length === 0) {
        fileInput.focus();
    } else {

        if (fileExtension === 'pdf') {
            icono = '<img src="/imagenDos.png" style="width: 70px; height: 70px;">';
        } else if (fileExtension === 'doc' || fileExtension === 'docx') {
            icono = '<img src="/imagenUno.png" style="width: 70px; height: 70px;">';
        } else if (tipoArchivo === 'xlsx') {
            icono = '<img src="/imagenTres.png" style="width: 70px; height: 70px;">';
        } else if (tipoArchivo === 'pptx') {
            icono = '<img src="/imagenCuatro.png" style="width: 70px; height: 70px;">';
        } else {
            icono = '<i class="fa fa-file"></i>';
        }

        const descarga = '<i class="fa-regular fa-circle-down"></i>'
        
        boxMessages.innerHTML += `
            <!-- MI MENSAJE -->
        <div class="chat from-message">
            <div class="detalles">
                <div class="fileUno" style="display: flex; justify-content: space-between; align-items: center;"> 
                    <div style="flex: 1; text-align: left;"> ${icono} </div>
                    <h5 style="flex: 2; text-align: center; padding:0 6px;">  ${file.name} </h5>
                    <a href="${fileUrl}" target="_blank" class="boton-descarga" style="flex: 1; text-align: center; font-size: 40px;"> ${descarga} </a> 
                </div>
                
            </div>
        </div>
            `;
        scrollBottom();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const dataUrl = reader.result;
            const data = {
                name: file.name,
                nameUser: "user",
                data: dataUrl,
                tipoDoc: fileExtension,
                userEnvio: usuarioEncontrado.username,
            };
            console.log({ data });
            socket.emit("file", data);
        };

        fileInput.value = null;
    }
});



socket.on("file", (data) => {
    const fileName = data.name;
    const userEnvio = data.userEnvio;
    const tipoArchivo = data.tipoFile;

    const fileUrl = `/uploads/${fileName}`;
    const message = `<p> <a href="${fileUrl}" target="_blank">${fileName}</a></p>`;

    if (tipoArchivo === 'pdf') {
        icono = '<img src="/imagenDos.png" style="width: 70px; height: 70px;">';
    } else if (tipoArchivo === 'doc' || tipoArchivo === 'docx') {
        icono = '<img src="/imagenUno.png" style="width: 70px; height: 70px;">';
    } else if (tipoArchivo === 'xlsx') {
        icono = '<img src="/imagenTres.png" style="width: 70px; height: 70px;">';
    } else {
        icono = '<i class="fa fa-file"></i>';
    }

    const descarga = '<i class="fa-regular fa-circle-down"></i>';


    boxMessages.innerHTML += `
    <!-- MENSAJE AMIGO -->
    <div class="chat to-message">
        <div class="detalles">

            
            <div class="fileUno" > 
            <strong>${userEnvio}: </strong>
            <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="flex: 1; text-align: left;"> ${icono} </div>
            <h5 style="flex: 2; text-align: center; padding:0 6px;">  ${fileName} </h5>
            <a href="${fileUrl}" target="_blank" class="boton-descarga" style="flex: 1; text-align: center; font-size: 40px;"> ${descarga} </a> 
            </div>
                </div>

        </div>
    </div>
    `;
    scrollBottom()

});





const users = [
    { id: 1, name: 'jhosep' },
    { id: 2, name: 'trejo' },
    { id: 3, name: 'gerson' },
    { id: 4, name: 'Reyna' }
];

function renderTableRows(data) {
    const tbody = document.querySelector('#conectados tbody');

    data.forEach(user => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.innerText = user.name;
        row.appendChild(nameCell);

        tbody.appendChild(row);
    });
}

renderTableRows(users);