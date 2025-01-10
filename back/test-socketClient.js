const { io } = require("socket.io-client");

const socket = io("http://localhost:5000"); // Asegúrate de que el puerto y la URL sean correctos

socket.on('connect', () => {
    console.log('Conectado al servidor con socket ID:', socket.id);

    // Registrar al usuario al conectar
    registerUser();

    // Enviar un mensaje después de registrar
    sendMessage();
});

// Función para registrar el usuario
function registerUser() {
    const accountId = "9393324d-46ab-49d9-aaa0-e3a68fe37134"; // Cambia esto según el usuario
    //const accountId = "484b97d7-7cdf-4ba0-8e1b-8968c8a349ae"; // Cambia esto según el usuario

    socket.emit("register", accountId);
    console.log(`Usuario ${accountId} registrado`);
}

// Función para enviar un mensaje
function sendMessage() {
    const senderId = "9393324d-46ab-49d9-aaa0-e3a68fe37134"; // ID del remitente
    const recipientId = "484b97d7-7cdf-4ba0-8e1b-8968c8a349ae"; // ID del destinatario (accountId)

    socket.emit('sendMessage', {
      senderId,
      recipientId, // Usar accountId del destinatario, no socketId
      content: 'Hola desde el cliente de prueba',
    });
    console.log(`Mensaje enviado a ${recipientId}`);
}

socket.on("newMessage", (message) => {
    console.log("Nuevo mensaje recibido:", message);
});

socket.on("disconnect", () => {
    console.log("Desconectado del servidor");
});



