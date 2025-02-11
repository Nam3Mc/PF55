const { io } = require("socket.io-client");
const registerUser = require("./test-registerUser");
const sendMessage = require("./test-messageSender");

const socket = io("http://localhost:5000");

socket.on('connect', () => {
    console.log('Conectado al servidor con socket ID:', socket.id);

    // Registra al usuario
   // registerUser(socket);

    // Envía un mensaje de prueba
   
    // Enviar un mensaje después de registrar
    setTimeout(() => {
        sendMessage(socket);
    }, 2000); // Asegúrate de que el registro se complete antes de enviar el mensaje
});

// Manejar el evento `newMessage`
socket.on('newMessage', (message) => {
    console.log('Nuevo mensaje recibido:', message);
});
