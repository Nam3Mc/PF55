module.exports = function registerUser(socket) {
    //const accountId = "484b97d7-7cdf-4ba0-8e1b-8968c8a349ae"; // Cambia esto por el ID del usuario que quieras registrar
    const accountId = "9393324d-46ab-49d9-aaa0-e3a68fe37134";
    socket.emit("register", accountId);
    console.log(`Usuario ${accountId} registrado`);
};
