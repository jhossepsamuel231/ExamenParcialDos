const path = require('path')
const express = require('express')
const app = express()
const SocketIO = require('socket.io')
const fs = require('fs');


app.use((express.static(path.join(__dirname, "public"))))

app.set("port", process.env.PORT || 3000);

const server = app.listen(app.get("port"), () => {
    console.log("Servidor corriendo en el puerto: ", app.get("port"));
})

const io = SocketIO(server)

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"))
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/login.html'))
})


io.on('connection', (socket) => {

    socket.on("message", (data) => {
        socket.broadcast.emit("message", data)
    })

    socket.on('chat:typing', (data) => {
        socket.broadcast.emit("chat:typing", data);
    })

    socket.on("fileImage", (data) => {
        const fileData = data.data.split(",")[1];
        const fileName = data.name;
        const nombreUsuario = data.nameUser;
        const filePath = path.join(__dirname, "public/uploads", fileName);

        fs.writeFile(filePath, fileData, "base64", (err) => {
            if (err) {
                console.error(err);
            } else {
                socket.broadcast.emit("fileImage", { name: fileName, userEnvio: nombreUsuario });
            }
        });
    });


    socket.on("file", (data) => {
        const fileData = data.data.split(",")[1];
        const fileName = data.name;
        const nombreUsuario = data.userEnvio;
        const tipoArchivo = data.tipoDoc;

        console.log({ data });
        const filePath = path.join(__dirname, "public/uploads", fileName);

        const extension = fileName.split(".").pop().toLowerCase();

        if (extension === "pdf" || extension === "doc" || extension === "docx" || extension === "xlsx") {
            fs.writeFile(filePath, fileData, "base64", (err) => {
                if (err) {
                    console.error(err);
                } else {
                    socket.broadcast.emit("file", { name: fileName, userEnvio: nombreUsuario, tipoFile: tipoArchivo });
                }
            });
        } else {
            console.error("Tipo de archivo no permitido.");
        }
    });

})
