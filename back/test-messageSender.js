module.exports = function sendMessage(socket) {
    const senderId = "484b97d7-7cdf-4ba0-8e1b-8968c8a349ae"; // ID del remitente (accountId)
    const recipientId = "9393324d-46ab-49d9-aaa0-e3a68fe37134"; // ID del destinatario (accountId)

    socket.emit('sendMessage', {
      senderId,
      recipientId,
      content: 'Hola desde el cliente de prueba',
    });
    console.log(`Mensaje enviado al destinatario con accountId: ${recipientId}`);
};
